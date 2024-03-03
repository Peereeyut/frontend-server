import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }
  apiurl = 'https://real-sweatsuit-toad.cyclic.app';
  role: any;
  iduser: any
  idrole: any

  isRegister(email: any) {
    return this.http.get(this.apiurl + '/api/user/:' + email)
  }

  RegisterUser(inputdata: any) {
    return this.http.post(this.apiurl, inputdata)
  }
  GetUserbyid(id: any) {
    return this.http.get(this.apiurl + '/backend/getuser/:' + id);
  }
  GetUser() {
    return this.http.get(this.apiurl + '/backend/User');
  }
  updaterole(iduser: any, idrole: any) {
    this.iduser = iduser
    this.idrole = idrole
    var detials={
      "iduser":iduser,
      "idrole":idrole
    }
    return this.http.put(this.apiurl + `/backend/updaterole`, detials);
  }
  getuserrole() {
    return this.http.get(this.apiurl + '/backend/role');
  }
  isloggedin() {
    return sessionStorage.getItem('email') != null;
  }
  roleresult: any;
  getrole(email: any) {
    this.http.get(`/getroleforauth/:${email}`).subscribe(async (resultData: any) => {
      this.roleresult = await resultData.data[0].name_role;
      sessionStorage.setItem("role", this.roleresult)
    });
  }
  // GetAllCustomer(){
  //   return this.http.get('http://localhost:3000/customer');
  // }

  setsession(email: any, userid: any) {
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('id', userid);


  }
  // GetUser(){
  //   return this.http.get(this.apiurl+'/backend/User').subscribe((studentData: any) => {
  //     this.isResultLoaded = true;
  //     console.log(studentData.data);
  // }
}