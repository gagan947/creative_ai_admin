import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
      {
            path: '',
            loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
            pathMatch: 'full'
      },
      {
            path: 'forgot-password',
            loadComponent: () => import('./components/auth/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent),
      },
      {
            path: 'admin',
            loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
            canActivate: [RoleGuard],
            children: [
                  {
                        path: 'dashboard',
                        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
                        canActivate: [RoleGuard],
                        pathMatch: 'full'
                  },
                  {
                        path: 'teams',
                        loadComponent: () => import('./components/teams/teams.component').then(m => m.TeamsComponent),
                        canActivate: [RoleGuard],
                  },
                  {
                        path: 'project-enquiries',
                        loadComponent: () => import('./components/projectt-enquries/projectt-enquries.component').then(m => m.ProjecttEnquriesComponent),
                        canActivate: [RoleGuard],
                  },
                  {
                        path: 'projects',
                        loadComponent: () => import('./components/projects/projects.component').then(m => m.ProjectsComponent),
                        canActivate: [RoleGuard],
                  },
                  {
                        path: 'builder-cms/projects',
                        loadComponent: () => import('./components/builderCMS/cms-projects/cms-projects.component').then(m => m.CmsProjectsComponent),
                        // canActivate: [RoleGuard],
                  },
                  {
                        path: 'builder-cms/Features',
                        loadComponent: () => import('./components/builderCMS/cms-features/cms-features.component').then(m => m.CmsFeaturesComponent),
                        // canActivate: [RoleGuard],
                  },
                  {
                        path: 'builder-cms/feature-detail/:id',
                        loadComponent: () => import('./components/builderCMS/cms-features/cms-feature-detail/cms-feature-detail.component').then(m => m.CmsFeatureDetailComponent),
                        // canActivate: [RoleGuard],
                  },
                  {
                        path: 'builder-cms/project-details/:id',
                        loadComponent: () => import('./components/builderCMS/cms-projects/cms-project-details/cms-project-details.component').then(m => m.CmsProjectDetailsComponent),
                        // canActivate: [RoleGuard],
                  },
                  {
                        path: 'projects/view/:id',
                        loadComponent: () => import('./components/projects/project-details/main/main.component').then(m => m.MainComponent),
                        children: [
                              {
                                    path: '',
                                    redirectTo: 'overview',
                                    pathMatch: 'full'
                              },
                              {
                                    path: 'overview',
                                    loadComponent: () => import('./components/projects/project-details/pro-overview/pro-overview.component').then(m => m.ProOverviewComponent),
                              },
                              {
                                    path: 'tasks',
                                    loadComponent: () => import('./components/projects/project-details/pro-tasks/pro-tasks.component').then(m => m.ProTasksComponent),
                              },
                              {
                                    path: 'milestones',
                                    loadComponent: () => import('./components/projects/project-details/pro-milestones/pro-milestones.component').then(m => m.ProMilestonesComponent),
                              },
                              {
                                    path: 'timesheets',
                                    loadComponent: () => import('./components/projects/project-details/pro-timesheets/pro-timesheets.component').then(m => m.ProTimesheetsComponent),
                              },
                              {
                                    path: 'files',
                                    loadComponent: () => import('./components/projects/project-details/pro-files/pro-files.component').then(m => m.ProFilesComponent),
                              }
                        ]
                  },
            ]
      }

];
