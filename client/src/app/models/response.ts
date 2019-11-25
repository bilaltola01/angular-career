export class UserGeneralInfo {
  user_id: number;
  recruiter: number;
  applicant: number;
  email: string;
  first_name: string;
  last_name: string;
  city_id: number;
  city: string;
  state_id: number;
  state: string;
  state_abrev: string;
  country_id: number;
  country: string;
  ethnicity: string;
  birthdate: string;
  gender: string;
  phone_num: string;
  title: string;
  user_intro: string;
  photo: string;
  is_looking: number;
  site_admin: number;
  date_created: Date;
  skills: UserSkillItem[];
  education: UserEducationItem [];
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
  job_desc: string;
  user_specified_company_name: string;
  work_hist_id: number;
  main_industry_name: string;
  industries: any[];
  skills_trained: any[];
  add_industries: any[];
}

export interface UserSkillItem {
  skill_id:	number;
  skill: string;
  skill_level: number;
}

export interface UserInterestItem {
  interest_id: number;
  interest: string;
}

export interface UserProjectItem {
  project_id:	number;
  project_name:	string;
  description: string;
  date_finished: string;
  href: string;
}

export interface UserPublicationItem {
  publication_id: number;
  publication_title: string;
  description: string;
  date_published: string;
  href: string;
  publisher: string;
}

export interface UserExternalResourcesItem {
  resource_id: number;
  user_id: number;
  link: string;
  description: string;
}

export interface WorkAuthResponse {
  user_id: number;
  proof_auth: string;
  work_auth: number;
  visa_support: number;
}

export interface MilitaryInfoResponse {
  user_id: number;
  military_status: string;
  military_status_description: string;
}

export interface CriminalHistoryResponse {
  criminal_hist_id: number;
  user_id: number;
  arrest_date: any;
  charge: string;
  explanation: string;
  criminal_hist_public: number;
}

export interface CompanyInfoResponse {
  company_id: number;
  company_name:	string;
  company_desc:	string;
  company_logo:	string;
  company_size:	string;
  hq_city: number;
  hq_city_name: string;
  hq_state:	number;
  hq_state_name: string;
  hq_country:	number;
  hq_country_name: string;
  main_industry: number;
  main_industry_name: string;
  school:	number;
  warning:	string;
  company_industry_ids:	number[];
  company_industries: any[];
}

export interface PositionInfoResponse {
  position_popularity: number;
  position_id: number;
  position: string;
  level: string;
  type:	string;
  position_desc: string;
  start_date:	string;
  end_date:	string;
  position_filled: number;
  pay: number;
  negotiable:	number;
  repeat_post: number;
  repeat_date: string;
  cover_letter_req:	number;
  recruiter_id:	number;
  company_id:	number;
  company_name:	string;
  post_date: string;
  department:	string;
  open:	number;
  openings:	number;
  recruiter_name:	string;
  application_deadline: any;
  application_type: string;
  locations: any[];
  preferred_skills:	any[];
  minimum_skills:	any[];
  preferred_schools: any[];
  preferred_majors:	any[];
  preferred_education_levels:	any[];
  preferred_major_categories:	any[];
  preferred_languages: any[];
  preferred_interests: any[];
  preferred_experience:	any[];
}

export interface PositionTemplateInfoResponse {
  position_popularity: number;
  position_id: number;
  position:	string;
  level: string;
  type:	string;
  position_desc: string;
  start_date:	any;
  end_date:	any;
  position_filled: number;
  pay: number;
  negotiable:	number;
  repeat_post: number;
  repeat_date: any;
  cover_letter_req:	number;
  application_type:	string;
  application_deadline: any;
  recruiter_id: number;
  company_id: number;
  company_name: string;
  post_date: any;
  department: string;
  open:	number;
  openings:	number;
  recruiter_name: string;
  locations: any[];
  preferred_skills:	any[];
  minimum_skills:	any[];
  preferred_schools: any[];
  preferred_majors:	any[];
  preferred_education_levels:	any[];
  preferred_major_categories:	any[];
  preferred_languages: any[];
  preferred_interests: any[];
  preferred_experience:	any[];
}

export interface PositionTemplateResponse {
  template_id: number;
  user_id: number;
  position_template_name:	string;
  position:	string;
  level: string;
  type:	string;
  position_desc: string;
  start_date:	any;
  end_date:	any;
  position_filled: number;
  pay: number;
  negotiable:	number;
  repeat_post: number;
  repeat_date: any;
  cover_letter_req:	number;
  cover_letter_pref: number;
  department:	string;
  application_type:	string;
  application_deadline:	any;
}

