import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { PositionsDetailsComponent } from 'src/app/components/positions-details/positions-details.component';

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
    path: 'position-info/:position_id',
    component: PositionsDetailsComponent,
    pathMatch: 'full'
  },
  {
    path: 'company-info',
    component: CompanyDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-company',
    component: CreateCompanyComponent,
    canActivate: [AuthGuard]
  },
];
