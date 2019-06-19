export interface UserObject {
  first_name: string;
  last_name: string;
  birthdate: string;
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
}

export interface UserEducationItemData {
  school_id: number;
  major_id: number;
  focus_major: number;
  start_date: string;
  graduation_date: string;
  gpa: number;
  edu_desc: string;
  user_specified_school_name: string;
  level_id: number;
  focus_major_name: string;
}

export interface UserExperienceItemData {
  company_id: number;
  job: string;
  start_date: string;
  end_date: string;
  position_name: string;
  exp_desc: string;
  user_specified_company_name: string;
  skill_ids_trained: any[];
  add_industry_ids: any[];
}
