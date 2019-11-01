import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private position_service_url = `${environment.serverUrl}/${environment.position_service}/api/${environment.api_version}/`;
  private school_url = `${environment.serverUrl}/${environment.position_service}/api/${environment.api_version}/position/`;
  private position_management_service_url = `${environment.serverUrl}/${environment.position_management_service}/api/${environment.api_version}/`;

  constructor(private http: HttpClient, private helperService: HelperService) {
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


  public getPositions(queryString?: string): Observable<any> {
    let queryUrl = `${this.position_service_url}Jobs`;
    if (queryString) {
      queryUrl = `${queryUrl}?${queryString}`;
    }
    return this.http.get(queryUrl, this.authHttpOptions())
    .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }

  public getPositionById(positionId: number): Observable<any> {
    return this.http.get(this.position_management_service_url + `position/${positionId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPosition(positionInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position', positionInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public putPosition(positionId: number, positionInfo: any): Observable<any> {
    return this.http.put(this.position_management_service_url + `position/${positionId}`, positionInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public patchPosition(positionId: number, positionInfo: any): Observable<any> {
    return this.http.patch(this.position_management_service_url + `position/${positionId}`, positionInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deletePosition(positionId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `position/${positionId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPreferredSkills(skillsInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position/preferred-skills', skillsInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public patchPreferredSkill(skillInfo: any): Observable<any> {
    return this.http.patch(this.position_management_service_url + 'position/preferred-skill', skillInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deletePreferredSkill(positionId: number, skillId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `position/${positionId}/preferred-skill/${skillId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postMinimumSkills(skillsInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position/minimum-skills', skillsInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public patchMinimumSkill(skillInfo: any): Observable<any> {
    return this.http.patch(this.position_management_service_url + 'position/minimum-skill', skillInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deleteMinimumSkill(positionId: number, skillId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `position/${positionId}/minimum-skill/${skillId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPreferredSchools(schoolsInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position/preferred-schools', schoolsInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deletePreferredSchool(positionId: number, schoolId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `position/${positionId}/preferred-school/${schoolId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPreferredMajors(majorsInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position/preferred-majors', majorsInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deletePreferredMajor(positionId: number, majorId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `position/${positionId}/preferred-major/${majorId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPreferredEducation(educationInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position/preferred-education', educationInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deletePreferredEducation(positionId: number, educationLevelId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `position/${positionId}/preferred-education/${educationLevelId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPreferredMajorCategories(categoriesInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position/preferred-major-categories', categoriesInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deletePreferredMajorCategory(positionId: number, majorCategoryId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `position/${positionId}/preferred-major-category/${majorCategoryId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPreferredInterests(interestsInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position/preferred-interests', interestsInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deletePreferredInterest(positionId: number, interestId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `position/${positionId}/preferred-interests/${interestId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPreferredExperience(experienceInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position/preferred-experience', experienceInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postFullPreferredExperience(experienceInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position/full-experience', experienceInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public patchPreferredExperience(experienceInfo: any): Observable<any> {
    return this.http.patch(this.position_management_service_url + 'position/preferred-experience', experienceInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deletePreferredExperience(positionId: number, experienceId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `position/${positionId}/preferred-experience/${experienceId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPreferredExperienceSkillsTrained(skillsInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'experience/preferred-skills-trained', skillsInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPreferredExperienceSkillTrained(skillInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'experience/preferred-skill-trained', skillInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deletePreferredExperienceSkillTrained(experienceId: number, skillId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `experience/${experienceId}/preferred-skill-trained/${skillId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postLocation(locationInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position/location', locationInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public getPositionLocations(positionId: number): Observable<any> {
    return this.http.get(this.position_service_url + `position/${positionId}/locations`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public deletePositionLocations(positionId: number, cityId: number, countryId: number): Observable<any> {
    return this.http.delete(this.position_management_service_url + `position/${positionId}/city/${cityId}/country/${countryId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public patchLocation(locationInfo: any): Observable<any> {
    return this.http.patch(this.position_management_service_url + 'position/location', locationInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public getPositionTemplates(): Observable<any> {
    return this.http.get(this.position_management_service_url + 'position-templates', this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public postPositionTemplate(positionTemplateInfo: any): Observable<any> {
    return this.http.post(this.position_management_service_url + 'position-template', positionTemplateInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public patchPositionTemplate(positionTemplateInfo: any): Observable<any> {
    return this.http.patch(this.position_management_service_url + 'position-template', positionTemplateInfo, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public getPositionTemplateById(positionTemplateId: number): Observable<any> {
    return this.http.get(this.position_management_service_url + `position-template/${positionTemplateId}`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  public getPositionTemplateInfoById(positionTemplateId: number): Observable<any> {
    return this.http.get(this.position_management_service_url + `position-template/${positionTemplateId}/template-info`, this.authHttpOptions())
      .pipe(
        map(
          data => {
            return {success: true, message: 'Success!', data: data};
          }
        ),
        catchError(this.handleError)
      );
  }

  private handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    return throwError({ success: false, message: errorMessage });
  }


  public getPosition(queryParam): Observable<any> {
    let queryUrl = `${this.position_service_url}full-position`;
    if (queryParam) {
      queryUrl = `${queryUrl}/${queryParam}`;
    }
    return this.http.get(queryUrl, this.authHttpOptions())
    .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }
  public getPositionsSaveJobData(queryString?: string): Observable<any> {
    const userId = this.helperService.extractUserId();
    let queryUrl = `${this.position_service_url}user/${userId}/saved-positions`;
    if (queryString) {
      queryUrl = `${queryUrl}?${queryString}`;
    }
    return this.http.get(queryUrl, this.authHttpOptions())
    .pipe(
        map(
          data => {
            return { success: true, message: 'Success!', data: data };
          }
        ),
        catchError(this.handleError)
      );
  }
 public getRestrictedSchool(queryParam) {
   let queryUrl = `${this.school_url}`;
   if ( queryParam) {
     queryUrl = `${queryUrl}${queryParam}/schools`;
   }
   return this.http.get(queryUrl, this.authHttpOptions())
   .pipe(
     map(
       data => {
         return { success: true, message: 'success!', data: data};
       }
     ),
     catchError(this.handleError)
   );
 }
}
