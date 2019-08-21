import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserProfileStateService {
  public user$: BehaviorSubject<any> = new BehaviorSubject(null);
  public educations$: BehaviorSubject<any> = new BehaviorSubject(null);
  public experiences$: BehaviorSubject<any> = new BehaviorSubject(null);
  public skills$: BehaviorSubject<any> = new BehaviorSubject(null);
  public interests$: BehaviorSubject<any> = new BehaviorSubject(null);
  public projects$: BehaviorSubject<any> = new BehaviorSubject(null);
  public publications$: BehaviorSubject<any> = new BehaviorSubject(null);
  public externalResources$: BehaviorSubject<any> = new BehaviorSubject(null);

  public get getUser(): Observable<any> {
    return this.user$.asObservable();
  }

  public setUser(value: any) {
    this.user$.next(value);
  }

  public get getEducations(): Observable<any> {
    return this.educations$.asObservable();
  }

  public setEducations(value: any) {
    this.educations$.next(value);
  }

  public get getExperiences(): Observable<any> {
    return this.experiences$.asObservable();
  }

  public setExperiences(value: any) {
    this.experiences$.next(value);
  }

  public get getSkills(): Observable<any> {
    return this.skills$.asObservable();
  }

  public setSkills(value: any) {
    this.skills$.next(value);
  }

  public get getInterests(): Observable<any> {
    return this.interests$.asObservable();
  }

  public setInterests(value: any) {
    this.interests$.next(value);
  }

  public get getProjects(): Observable<any> {
    return this.projects$.asObservable();
  }

  public setProjects(value: any) {
    this.projects$.next(value);
  }

  public get getPublications(): Observable<any> {
    return this.publications$.asObservable();
  }

  public setPublications(value: any) {
    this.publications$.next(value);
  }

  public get getExternalResources(): Observable<any> {
    return this.externalResources$.asObservable();
  }

  public setExternalResources(value: any) {
    this.externalResources$.next(value);
  }
}
