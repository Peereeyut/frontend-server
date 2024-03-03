import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { MenubarHeaderComponent } from './pages/home/components/menubar-header/menubar-header.component';
import { FiltersComponent } from './pages/home/components/filters/filters.component';
import { AddProjectComponent } from './pages/add-project/add-project.component';
import { EditProjectComponent } from './pages/edit-project/edit-project.component';
import { MyprojectComponent } from './pages/myproject/myproject.component';
import { TruncatePipe } from './truncate.pipe';
import { ProjectRMComponent } from './pages/project-rm/project-rm.component';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { AboutComponent } from './pages/about/about.component';
import { ProjectUserComponent } from './pages/project-user/project-user.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BackendComponent } from './pages/backend/backend.component';
import { TestComponent } from './pages/test/test.component';
import { RegisterComponent } from './register/register.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { UpdatepopupComponent } from './pages/backend/updatepopup/updatepopup.component';

import { ToastrModule } from 'ngx-toastr';
import { InvitePopupComponent } from './pages/add-project/invite-popup/invite-popup.component';
import { InviteComponent } from './pages/invite/invite.component';
import { NotfoundpathComponent } from './pages/notfoundpath/notfoundpath.component';
import { ProfileAdComponent } from './pages/Advisor/profile-ad/profile-ad.component';
import { ProjectAdComponent } from './pages/Advisor/project-ad/project-ad.component';
import { AddprojectAdComponent } from './pages/Advisor/addproject-ad/addproject-ad.component';
// import { EditprojectAdComponent } from './pages/Advisor/editproject-ad/editproject-ad.component';
import { UpdateprofileAdComponent } from './pages/Advisor/updateprofile-ad/updateprofile-ad.component';
import { InviteAdComponent } from './pages/Advisor/invite-ad/invite-ad.component';
import { KeywordComponent } from './pages/project-user/keyword/keyword.component';
import { KeywordAdComponent } from './pages/Advisor/project-ad/keyword-ad/keyword-ad.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { InviteadvisorEditComponent } from './pages/edit-project/inviteadvisor-edit/inviteadvisor-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MenubarHeaderComponent,
    FiltersComponent,
    AddProjectComponent,
    EditProjectComponent,
    MyprojectComponent,
    TruncatePipe,
    ProjectRMComponent,
    AboutComponent,
    ProjectUserComponent,
    DashboardComponent,
    ProfileComponent,
    BackendComponent,
    TestComponent,
    RegisterComponent,
    UpdateProfileComponent,
    UpdatepopupComponent,
    InvitePopupComponent,
    InviteComponent,
    NotfoundpathComponent,
    ProfileAdComponent,
    ProjectAdComponent,
    AddprojectAdComponent,
    // EditprojectAdComponent,
    UpdateprofileAdComponent,
    InviteAdComponent,
    KeywordComponent,
    KeywordAdComponent,
    InviteadvisorEditComponent,
 
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    MatGridListModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatTreeModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatBadgeModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatInputModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSelectModule,
    SocialLoginModule,
    ToastrModule.forRoot(),
    NgApexchartsModule,
    CanvasJSAngularChartsModule,
  ],
  providers: [ // Include the GoogleAuthService in the providers array
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('YOUR_CLIENT_ID'), // Replace 'YOUR_CLIENT_ID' with your actual Client ID
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

