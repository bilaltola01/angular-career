import { AuthGuard } from '../../guard/auth.guard';
import { Routes } from '@angular/router';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { CompaniesComponent } from './companies/companies.component';

export const companyRoutes: Routes = [
  {
    path: 'create-company',
    component: CreateCompanyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'companies',
    component: CompaniesComponent,
    canActivate: [AuthGuard]
  }

];
