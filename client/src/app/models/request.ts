export interface UserObject {
  first_name: string;
  last_name: string;
  birthdate: any;
  gender: string;
  phone_num: string;
  recruiter: number;
  applicant: number;
  city_id: number;
  country_id: number;
  state_id: number;
  is_looking: number;
  photo: string;
  title: string;
  user_intro: string;
  ethnicity: string;
}

export interface UserEducationItemData {
  school_id: number;
  major_id: number;
  focus_major: number;
  start_date: any;
  graduation_date: any;
  gpa: number;
  edu_desc: string;
  user_specified_school_name: string;
  level_id: number;
  focus_major_name: string;
}

export interface UserExperienceItemData {
  company_id: number;
  job: string;
  start_date: any;
  end_date: any;
  job_desc: string;
  user_specified_company_name: string;
  skill_ids_trained: any[];
  add_industry_ids: any[];
}

export interface UserProjectItemData {
  project_name:	string;
  description: string;
  date_finished: any;
  href: string;
}

export interface UserPublicationItemData {
  publication_title: string;
  description: string;
  date_published: any;
  href: string;
  publisher: string;
}

export interface UserExternalResourcesItemData {
  link: string;
  description: string;
}

export interface MilitaryInfoRequest {
  military_status: string;
  military_status_description: string;
}
