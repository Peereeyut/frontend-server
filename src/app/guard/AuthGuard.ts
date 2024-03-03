import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree, } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { GuardService } from './guard.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnInit {
  constructor(private serviceG: GuardService, private router: Router, private tostr: ToastrService) { }
  async ngOnInit(): Promise<void> {
    this.userProfile = await JSON.parse(sessionStorage.getItem("loggedInUser") || "");
    // await this.serviceG.getrolebyemail("peereeyutn63@nu.ac.th");
    // await this.serviceG.getrolebyemail(this.userProfile.email)
  }
  userProfile: any;
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    try {
      this.userProfile = await JSON.parse(sessionStorage.getItem("loggedInUser") || "");
      const role = await this.serviceG.getrolebyemail(this.userProfile.email);
      // console.log(await role);
      // console.log(this.serviceG.islogin)
      if (await this.serviceG.islogin) {
  
        if (route.url[0].path === 'register') {
          return true
        }
        if (route.url[0].path === 'devadmin' || route.url[0].path === 'dashboard' || route.url[0].path === 'profile'|| route.url[0].path === 'profilebyad' || route.url[0].path === 'update-profile' ) {
          const menu = route.url[0].path;
          // console.log(menu)
          await this.serviceG.accessrole(role, menu);
          // await console.log(this.serviceG.canAccess)
          if (await this.serviceG.canAccess) {
            return true;
          } else {
            if(this.serviceG.role =="admin"){
              this.router.navigate(['devadmin']);
              return true
            }
            else{
            this.router.navigate(['home']);
            this.tostr.warning("Can't access 1");
            return false;}
          }
          // add
        } else if (route.url[1].path.length > 0) {
          const stid = await route.url[1].path.substring(1);
          await this.serviceG.emailmatchid(this.userProfile.email, stid)
          if (await this.serviceG.match) {
            if(await route.url[0].path==="addproject"){
              return true
            }
            else if (await route.url[2].path.length > 0) {
              const editidproject = await route.url[2].path.substring(1);
              await this.serviceG.myproject(this.userProfile.email, editidproject);
              if (this.serviceG.idmyproject) {
                return true
              }
              else {
                this.router.navigate(['home']);
                this.tostr.warning("Can't access 21");
                return false;
              }
            }
            else{
              this.router.navigate(['home']);
            this.tostr.warning("Can't access 22");
            return false;
            }
          }

          else {
            this.router.navigate(['home']);
            this.tostr.warning("Can't access 2");
            return false;
          }
        } else {
          this.router.navigate(['home']);
          this.tostr.warning("Can't access 2");
          return false;
        }
      }
      else {
        this.router.navigate(['home']);
        this.tostr.warning("Can't access 2");
        return false;
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      this.router.navigate(['home']);
      this.tostr.warning("Can't access error");
      return false;
    }
  }
}