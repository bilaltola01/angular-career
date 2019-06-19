export interface UserGeneralInfo {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  gender: string;
  phone_num: string;
  recruiter: number;
  applicant: number;
  title: string;
  city_id: number;
  city: string;
  country_id: number;
  country: string;
  state_id: number;
  state: string;
  state_abrev: string;
  user_intro: string;
  site_admin: number;
  date_created: Date;
  photo: string;
}

export interface UserEducationItem {
  school_id: number;
  major_id:	number;
  focus_major: number;
  start_date:	string;
  graduation_date: string;
  gpa: number;
  edu_desc:	string;
  user_specified_school_name:	string;
  level_id:	number;
  focus_major_name:	string;
  education_id:	number;
  level: number;
  education_level: string;
  major_name: string;
  major_desc: string;
  school_name: string;
  website: string;
}

export interface UserExperienceItem {
  company_id:	number;
  job: string;
  start_date: string;
  end_date: string;
  company_name: string;
  position_name: string;
  exp_desc: string;
  user_specified_company_name: string;
  work_hist_id: number;
  main_industry_name: string;
  industry_names: any[];
  skills_trained: any[];
  add_industry_names: any[];
}

export interface UserSkillItem {
  skill_id:	number;
  skill: string;
  skill_level: number;
}

export interface UserInterestItem {
  interest_id: number;
  interest_name: string;
}
