import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';

export const companyRoutes: Routes = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full'
  },
  {
    path: 'create-company',
    component: CreateCompanyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'companies',
    component: CompaniesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'company-info',
    component: CompanyDetailComponent,
    canActivate: [AuthGuard]
  }
];
