import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  page_titles = [
    '',
    'Basic Info',
    'About Me',
    'Education',
    'Work Experience',
    'Skills & Interests',
    'Projects',
    'Publications',
    'External Links',
    ''
  ];

  profileCreationPages = [
    'choose-option',
    'profile-basic',
    'profile-about',
    'profile-education',
    'profile-work',
    'profile-skills',
    'profile-project',
    'profile-publication',
    'profile-links',
    'profile-status'
  ];

  progressWidth = [
    {
      label: 0,
      width: 0
    },
    {
      label: 10,
      width: 100 / 9 - 100 / 18
    },
    {
      label: 20,
      width: 200 / 9 - 100 / 18
    },
    {
      label: 30,
      width: 300 / 9 - 100 / 18
    },
    {
      label: 40,
      width: 400 / 9 - 100 / 18
    },
    {
      label: 50,
      width: 500 / 9 - 100 / 18
    },
    {
      label: 60,
      width: 600 / 9 - 100 / 18
    },
    {
      label: 70,
      width: 700 / 9 - 100 / 18
    },
    {
      label: 90,
      width: 800 / 9 - 100 / 18
    },
    {
      label: 100,
      width: 100
    }
  ];

  basic_information = {
    location: 'Los Angeles, California, USA',
    birthOfDay: 'August 27, 1995',
    gender: 'Male',
    ethnicity: 'American'
  };

  about_me = 'Explain Brief About Yourself.';

  educations = [
    {
      university: 'Brown University',
      degree: 'Master’s of Science',
      course: 'Computer Science',
      completion: '2012 - 2015',
      description: ''
    }
  ];

  work_experiences = [
    {
      company_name: 'Renew Information Technology',
      years: 'May 2017 - Present',
      designation: 'Software Engineer',
      description: '',
      skills_trained: [
        'Software Engineering',
        'Programing',
        'Machine Learning',
        'Medicare',
        'Node JS',
        'Python',
        'HTML5',
        'Adobe Photoshop'
      ],
      additional_exposure: [
        'Software Engineering',
        'Programing',
        'Machine Learning',
        'Medicare',
        'Node JS',
        'Python',
        'HTML5',
        'Adobe Photoshop'
      ]
    }
  ];

  skill_trained = [
    ''
  ];
  additional_exposure = [
    ''
  ];

  skills = [
    {
      title: 'Motion Design',
      proficieny: 4
    },
    {
      title: 'Indesign',
      proficieny: 3
    },
    {
      title: 'Data Science',
      proficieny: 4
    },
    {
      title: 'Adobe XD',
      proficieny: 4
    },
    {
      title: 'Adobe Photoshop',
      proficieny: 5
    },
    {
      title: 'Adobe Indesign',
      proficieny: 5
    },
    {
      title: 'Node JS',
      proficieny: 1
    },
    {
      title: 'Adobe After Effects',
      proficieny: 1
    }
  ];

  skill = {
    title: '',
    proficieny: 4
  };

  interests = [
    'Software Engineering',
    'Programing',
    'Machine Learning',
    'Medicare',
    'Node JS',
    'Python',
    'HTML5',
    'Adobe Photoshop'
  ];

  interest = '';

  projects = [
    {
      project_name: 'Stem Kids New York City',
      years: '2012 - 2015',
      description: ''
    }
  ];

  publications = [
    {
      publication_name: 'Stem Kids New York City',
      years: '2012 - 2015',
      description: ''
    }
  ];

  external_links = {
    twitter: 'twitter.com/markzucker1965',
    facebook: 'facebook.com/markzucker1965',
    google: 'google.com/markzucker1965',
    linkedin: ''
  };

  statuses = [
    'Actively Looking For Job',
    'Exploring Opportunities'
  ];

  profile_status = this.statuses[0];

  selectedPageIndex = 0;

  constructor() { }

  ngOnInit() {
  }

  goToCreatProfilePage() {
    this.selectedPageIndex = 1;
  }

  goToNextPage() {
    if (this.selectedPageIndex < this.profileCreationPages.length - 1) {
      this.selectedPageIndex++;
    } else {
      this.selectedPageIndex = 0;
    }
  }

  goToPage(index: number) {
    if (this.selectedPageIndex > index) {
      this.selectedPageIndex = index;
    }
  }

  addEducation() {
    const education = {
      university: '',
      degree: '',
      course: '',
      completion: '',
      description: ''
    };

    this.educations.push(education);
  }

  addWorkExperience() {
    const work_experience = {
      company_name: 'Renew Information Technology',
      years: 'May 2017 - Present',
      designation: 'Software Engineer',
      description: '',
      skills_trained: [],
      additional_exposure: []
    };
    this.work_experiences.push(work_experience);
    this.skill_trained.push('');
    this.additional_exposure.push('');
  }

  addSkillsTrained(index: number) {
    if (this.skill_trained[index]) {
      this.work_experiences[index].skills_trained.push(this.skill_trained[index]);
      this.skill_trained[index] = '';
    }
  }

  addAdditionalExposure(index: number) {
    if (this.additional_exposure[index]) {
      this.work_experiences[index].additional_exposure.push(this.additional_exposure[index]);
      this.additional_exposure[index] = '';
    }
  }

  addSkills() {
    if (this.skill.title) {
      this.skills.push(this.skill);
      this.skill = {
        title: '',
        proficieny: 4
      };
    }
  }

  addInterests() {
    if (this.interest) {
      this.interests.push(this.interest);
      this.interest = '';
    }
  }

  addProjects() {
    const project = {
      project_name: '',
      years: '',
      description: ''
    };
    this.projects.push(project);
  }

  addPublications() {
    const publication = {
      publication_name: '',
      years: '',
      description: ''
    };
    this.publications.push(publication);
  }

  setProfileStatus(index: number) {
    this.profile_status = this.statuses[index];
  }

  blurSkillSearchField(type: string, index: number) {
    switch (type) {
      case 'skill_trained':
        this.skill_trained[index] = '';
        break;
      case 'additional_exposure':
        this.additional_exposure[index] = '';
        break;
      case 'skill':
        this.skill = {
          title: '',
          proficieny: 4
        };
        break;
      case 'interest':
        this.interest = '';
        break;
      default:
        break;
    }
  }
}
