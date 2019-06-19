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

  public loadUsers(params: string): Observable<any> {

    return this.http.get(this.user_service_url + `users?${params}`, this.authHttpOptions())
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

  // General Information Services

  public getGeneralInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public updateGeneralInfo(generalInfo: UserObject): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}`, generalInfo, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  // Education Information Services

  public getEducationInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/education`, this.authHttpOptions())
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
    return this.http.patch(this.user_service_url + `user/${this.user_id}/education/${educationId}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  // Work Experience Services

  public getExperienceInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/experience`, this.authHttpOptions())
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
    return this.http.patch(this.user_service_url + `user/${this.user_id}/experience/${experienceId}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public getAdditionalIndustries(experienceId: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/experience/${experienceId}/additional-industries`, this.authHttpOptions())
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
    return this.http.get(this.user_service_url + `user/${this.user_id}/experience/${experienceId}/skills-trained`, this.authHttpOptions())
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

  public DeleteSkillTrainedById(experienceId: number, skillId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/experience/${experienceId}/skill-trained/${skillId}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  public getSkillsInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/skills`, this.authHttpOptions())
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

  public delteSkillInfoById(userSkillId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/skill/${userSkillId}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }

  // Publications Information Services
  public getPublicationsInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/publications`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }
  public postPublicationsInfo(publicationData: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/publications`, publicationData, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }
  public getPublicationsInfoById(publicationId: number): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/publications/${publicationId}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }
  public patchPublicationsInfoById(publicationData: any, publicationId: number): Observable<any> {
    return this.http.patch(this.user_service_url + `user/${this.user_id}/publications/${publicationId}`, publicationData, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }
  public deletePublicationsInfoById(publicationId: number): Observable<any> {
    return this.http.delete(this.user_service_url + `user/${this.user_id}/publications/${publicationId}`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }




  // User Interests Services
  public getUserInterestsInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/interests`, this.authHttpOptions())
    .pipe(
      map(data => {
        return {success: true, message: 'Success!', data: data};
      }),
      catchError(this.handleError)
    );
  }
  public postUserInterestsInfo(interestData: any): Observable<any> {
    return this.http.post(this.user_service_url + `user/${this.user_id}/interests`, interestData, this.authHttpOptions())
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
  public getProjectsInfo(): Observable<any> {
    return this.http.get(this.user_service_url + `user/${this.user_id}/projects`, this.authHttpOptions())
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


  private handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.message;
    } else {
      errorMessage = `Error Code: ${error.status}. Message: ${error.error.message}`;
    }
    return throwError({success: false, message: errorMessage});
  }
}
