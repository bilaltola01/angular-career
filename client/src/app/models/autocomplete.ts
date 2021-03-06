export interface City {
  city: string;
  city_id: number;
}

export interface State {
  state: string;
  state_id: number;
}

export interface School {
  school_name: string;
  school_id: number;
}

export interface Major {
  major_id: number;
  major_name: string;
}

export interface Skill {
  skill_id: number;
  skill: string;
}

export interface Interest {
  interest_id: number;
  interest: string;
}

export interface Level {
  level_id: number;
  level: number;
  education_level: string;
}

export interface Company {
  company_id: number;
  company_name: string;
  company_logo: string;
}

export interface Industry {
  industry_id: number;
  industry_name: string;
}

export interface Recruiter {
  recruiter_id: number;
  recruiter_name: string;
}

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  photo: string;
}

export interface MajorCategory {
  cat_id: number;
  cat_name: string;
}
