import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserObject } from 'src/app/models';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  max_limit = 100;

  helper = new JwtHelperService();

  // store the URL so we can redirect after logging in
  public redirectUrl: string;
  private user_id = -1;

  private auth_service_url = `${environment.serverUrl}/${environment.auth_service}/api/${environment.api_version}/`;
  private user_service_url = `${environment.serverUrl}/${environment.user_service}/api/${environment.api_version}/`;

  constructor(private http: HttpClient) {
    if (this.isLoggedIn()) {
      const token = localStorage.getItem('token');
      this.user_id = this.helper.decodeToken(token).user_id;
    }
  }

  public signUp(user): Observable<any> {
    return this.http.post(this.auth_service_url + 'register', user, this.httpOptions())
      .pipe(
        map(
          data => {
            if (data['token']) {
              return {success: true, message: data['message']};
            } else {
              return {success: false, message: data['message']};
            }
          }
        ),
        catchError(this.handleError)
      );
  }

  public login(user, isRemember: boolean): Observable<any> {
    return this.http.post(this.auth_service_url + 'login', user, this.httpOptions())
      .pipe(
        map(data => {
          if (data['token']) {
            localStorage.setItem('token', data['token']);
            if (isRemember) {
              localStorage.setItem('storedUser', JSON.stringify(user));
            } else {
              localStorage.setItem('storedUser', null);
            }
            this.user_id = this.helper.decodeToken(data['token']).user_id;
          }
          return {success: this.isLoggedIn(), message: data['message']};
        }),
        catchError(this.handleError)
      );
  }

  public checkStoredUser(): any {
    const user = localStorage.getItem('storedUser');
    return JSON.parse(user);
  }

  public emailVerification(user_id: string, verify_str: string, verify_key: string): Observable<any> {
    return this.http.get(this.auth_service_url + `user/${user_id}/${verify_str}/${verify_key}`, this.httpOptions())
      .pipe(
        map(data => {
          return {success: true, message: data['message']};
        }),
        catchError(this.handleError)
      );
  }

  public putPassword(passwordInfo: any): Observable<any> {
    passwordInfo.user_id = this.user_id;
    return this.http.put(this.auth_service_url + `password`, passwordInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public forgotPassword(newPasswordInfo: any, user_id: string, validation_token: string): Observable<any> {
    return this.http.post(this.auth_service_url + `user/${user_id}/token/${validation_token}/change-password`, newPasswordInfo, this.httpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public sendPasswordResetEmail(info: any): Observable<any> {
    return this.http.post(this.auth_service_url + 'send-password-reset-email', info, this.httpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getUsers(query: string): Observable<any> {
    return this.http.get(this.user_service_url + `users?${query}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('storedUser');
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    let isLoggedIn = false;
    if (token) {
      isLoggedIn = true;
    }
    return isLoggedIn;
  }

  public resendEmail(email: object) {
    return this.http.post(this.auth_service_url + `send-email`, email, this.httpOptions())
      .pipe(
        map(data => {
          return {success: true, message: data['message']};
        }),
        catchError(this.handleError)
      );
  }

  public refreshToken(): Observable<any> {
    return this.http.get(this.auth_service_url + 'token/refresh', this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, data: data['token']};
        })
      );
  }

  // General Information Services
  public getGeneralInfo(userId: number = this.user_id): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }
  public getSignedPhotoUrl(file: File): Observable<any> {
    const requestUrl =
      `${this.user_service_url}user/${this.user_id}/sign-s3?file-name=${file.name}&file-type=${file.type}`;

    return this.http.get(`${requestUrl}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError));
  }

  public uploadPhotoToS3(file: File, signedRequest: string, publicUrl: string): Observable<any> {
    return this.http.put(`${signedRequest}`, file)
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: publicUrl};
        }),
        catchError(this.handleError));
  }


  public updateGeneralInfo(generalInfo: any): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}`, generalInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        })
      );
  }

  public getEducationInfo(userId: number = this.user_id): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/education?limit=${this.max_limit}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getEducationInfoById(educationId: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/education/${educationId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  // Education Information Services

  public postEducationInfo(educationInfo: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/education`, educationInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public patchEducationInfoById(educationInfo: any, educationId: number): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}/education/${educationId}`, educationInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deleteEducationInfoById(educationId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/education/${educationId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getExperienceInfo(userId: number = this.user_id): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/experience?limit=${this.max_limit}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getExperienceInfoById(experienceId: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/experience/${experienceId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  // Work Experience Services

  public postExperienceInfo(experienceInfo: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/experience`, experienceInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public patchExperienceInfoById(experienceInfo: any, experienceId: number): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}/experience/${experienceId}`, experienceInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deleteExperienceInfoById(experienceId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/experience/${experienceId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getAdditionalIndustries(experienceId: number): Observable<any> {
    return this.http.get(this.user_service_url + `experience/${experienceId}/additional-industries`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public postAdditionalIndustry(additionalIndustryInfo: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/additional-industry`, additionalIndustryInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getAdditionalIndustryById(experienceId: number, industryId: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/experience/${experienceId}/additional-industry/${industryId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public DeleteAdditionalIndustryById(experienceId: number, industryId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/experience/${experienceId}/additional-industry/${industryId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getSkillsTrained(experienceId: number): Observable<any> {
    return this.http.get(this.user_service_url + `experience/${experienceId}/skills-trained`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public postSkillTrained(skillInfo: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/skill-trained`, skillInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getSkillTrainedById(experienceId: number, skillId: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/experience/${experienceId}/skill-trained/${skillId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deleteSkillTrainedById(experienceId: number, skillId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/experience/${experienceId}/skill-trained/${skillId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getSkillsInfo(limit: number, offset: number, userId: number = this.user_id): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/skills?limit=${limit}&offset=${offset}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }
  public postSkillInfo(skillData: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/skill`, skillData, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getSkillInfoById(userSkillId: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/skill/${userSkillId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public patchSkillInfoById(userSkillId: number, skillData: any): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}/skill/${userSkillId}`, skillData, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deleteSkillInfoById(userSkillId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/skill/${userSkillId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  // Publications Information Services
  public getPublicationsInfo(userId: number = this.user_id): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/publications?limit=${this.max_limit}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public postPublicationsInfo(publicationData: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/publication`, publicationData, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getPublicationsInfoById(publicationId: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/publication/${publicationId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public patchPublicationsInfoById(publicationData: any, publicationId: number): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}/publication/${publicationId}`, publicationData, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deletePublicationsInfoById(publicationId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/publication/${publicationId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }
  // User Interests Services
  public getUserInterestsInfo(limit: number, offset: number, userId: number = this.user_id): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/interests?limit=${limit}&offset=${offset}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public postUserInterestsInfo(interestData: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/interest`, interestData, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getUserInterestsInfoById(userInterestId: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/interests/${userInterestId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deleteUserInterestsInfoById(userInterestId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/interests/${userInterestId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  // User Introduction Services
  public getIntroductionInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/introduction`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public patchIntroductionInfo(IntroductionInfo: any): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}/introduction`, IntroductionInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  // Course Services
  public getCoursesInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/courses`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public postCoursesInfo(courseData: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/courses`, courseData, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getCoursesInfoByTitle(userCourseTitle: string): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/courses/${userCourseTitle}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public patchCoursesInfoByTitle(courseData: any, userCourseTitle: string): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}/courses/${userCourseTitle}`, courseData, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deleteCoursesInfoByTitle(userCourseTitle: string): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/courses/${userCourseTitle}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  // School Services
  public getSchoolInfoByName(school_name: string): Observable<any> {
    return this.http.get(this.user_service_url + `school/get-id/${school_name}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  // Major Servies
  public getMajorInfoByName(major_name: string): Observable<any> {
    return this.http.get(this.user_service_url + `major/get-id/${major_name}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  // Language Services
  public getLanguagesInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/languages`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public postLanguagesInfo(languageInfo: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/languages`, languageInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deleteLanguagesInfoById(languageId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/language/${languageId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public patchLanguagesInfoById(languageInfo: any, languageId: number): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}/language/${languageId}`, languageInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  // Projects Information Services
  public getProjectsInfo(userId: number = this.user_id): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/projects?limit=${this.max_limit}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public postProjectInfo(projectInfo: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/project`, projectInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public patchProjectInfoById(projectInfo: any, projectId: number): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}/project/${projectId}`, projectInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deleteProjectInfoById(projectId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/project/${projectId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getExternalResourcesInfo(userId: number = this.user_id): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/external-resources`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public postExternalResourcesInfo(resourceInfo: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/external-resources`, resourceInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public patchExternalResourcesById(resourceInfo: any, resourceId: number): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}/external-resource/${resourceId}`, resourceInfo, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public deleteExternalResourcesById(resourceId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/external-resource/${resourceId}`, this.authHttpOptions())
      .pipe(
        map(data => {
          return {success: true, message: 'Success!', data: data};
        }),
        catchError(this.handleError)
      );
  }

  public getUserContacts(userId: number, limit: number, offset: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/contacts?limit=${limit}&offset=${offset}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public getUserContactById(contactId: number, userId: number = this.user_id): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/contact/${contactId}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public deleteUserContactById(contactId: number, userId: number = this.user_id): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${userId}/contact/${contactId}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public postUserContact(userInfo: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/contact`, userInfo, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public getIncomingContactRequests(userId: number, limit: number, offset: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/incoming-contact-requests?limit=${limit}&offset=${offset}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public getIncomingContactRequestsById(userId: number, contactId: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/contact/${contactId}/incoming-contact-request`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public deleteContactRequestsById(userId: number, contactId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${userId}/contact/${contactId}/contact-request`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public getOutgoingContactRequestById(contactId: number, userId: number = this.user_id): Observable<any> {
    return this.http.get(this.user_service_url + `user/${userId}/contact/${contactId}/outgoing-contact-request`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public postOutgoingContactRequest(contactId: number, userId: number = this.user_id): Observable<any> {
    return this.http.post(this.user_service_url + 'user/outgoing-contact-request', {user_id: userId, contact_id: contactId}, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public deleteOutgoingContactRequest(contactId: number, userId: number = this.user_id): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${userId}/contact/${contactId}/contact-request`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  }

  private authHttpOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
  }

  private handleError(error) {
    let message: string;

    if (error) {
      if (error.error) {
        message = error.error.message;
      } else {
        message = error.statusText;
      }
    }

    if (!environment.production) {
      console.error(`UserService -> handleError -> error. Error Code: ${error.status}. Message: ${message}. Details:`, error);
    }

    return throwError({success: false, message: error.error.message ? error.error.message : error.statusText});
  }
}
