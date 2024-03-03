import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { ProjectRMComponent } from './pages/project-rm/project-rm.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectUserComponent } from './pages/project-user/project-user.component';
import { MyprojectComponent } from './pages/myproject/myproject.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BackendComponent } from './pages/backend/backend.component';
// import { TestComponent } from './pages/test/test.component';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './guard/AuthGuard';
import { RegisterComponent } from './register/register.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { InviteComponent } from './pages/invite/invite.component';
import { NotfoundpathComponent } from './pages/notfoundpath/notfoundpath.component';
import { AddprojectAdComponent } from './pages/Advisor/addproject-ad/addproject-ad.component';
// import { EditprojectAdComponent } from './pages/Advisor/editproject-ad/editproject-ad.component';
import { InviteAdComponent } from './pages/Advisor/invite-ad/invite-ad.component';
import { ProfileAdComponent } from './pages/Advisor/profile-ad/profile-ad.component';
import { ProjectAdComponent } from './pages/Advisor/project-ad/project-ad.component';
import { UpdateprofileAdComponent } from './pages/Advisor/updateprofile-ad/updateprofile-ad.component';
import { KeywordComponent } from './pages/project-user/keyword/keyword.component';
import { KeywordAdComponent } from './pages/Advisor/project-ad/keyword-ad/keyword-ad.component';


const routes: Routes = [{
  path: 'home',
  component: HomeComponent,
},
{
  path: 'project/:idProject',
  component: ProjectRMComponent,
},
{
  path: 'project-user/:idstudent',
  component: ProjectUserComponent,
},
{
  path: 'addproject/:idstudent',canActivate:[AuthGuard],
  component: AddProjectComponent,
},
{
  path: 'editproject/:idstudent/:idProject',canActivate:[AuthGuard],
  component: EditProjectComponent
},
{
  path: 'about',
  component: AboutComponent,
},
{
  path: 'dashboard',canActivate:[AuthGuard], 
  component: DashboardComponent,
},
{
  path: 'profile',canActivate:[AuthGuard],
  component: ProfileComponent,
},
{
  path: 'update-profile/:idstudent',
  component: UpdateProfileComponent,
},
{
  path: 'register',
  component: RegisterComponent,
},
{
  path: 'invite/:idstudent/:idProject',
  component: InviteComponent,
},
{
  path: 'devadmin',canActivate:[AuthGuard], 
  component: BackendComponent,
},
// Advisor Page________________________________________
{
  path: 'addprojectbyad',
  component: AddprojectAdComponent,
},
// {
//   path: 'editprojectbyad/:idadvisor/:idProject',
//   component: EditprojectAdComponent,
// },
{
  path: 'invitebyad/:idadvisor/:idProject',
  component: InviteAdComponent,
},
{
  path: 'profilebyad',canActivate:[AuthGuard], 
  component: ProfileAdComponent,
},
{
  path: 'projectbyad/:idadvisor',
  component: ProjectAdComponent,
},
{
  path: 'update-profilebyad/:idadvisor',
  component: UpdateprofileAdComponent,
},
{
  path: 'keyword/:idstudent/:keyword',
  component: KeywordComponent,
},
{
  path: 'keyword-ad/:idadvisor/:keyword',
  component: KeywordAdComponent,
},
// ___________________________________________________
// {
//   path: 'test/:idstudent/:idProject',
//   component: TestComponent,
// },
{ path: '', redirectTo: 'home', pathMatch: 'full' },
{
  path: '404',
  component: NotfoundpathComponent,
},
{
  path: '**',
  redirectTo:"/404",
},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
