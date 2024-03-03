import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

declare var handleSignout: any;

interface StudentData {
  [key: string]: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userProfile: any;
  result: any;
  dataEmail: any;
  role: any;
  userid: any
  StudentArray: any[] = [];
  isResultLoaded = false;

  students: any[] = [];
  projectForm: FormGroup;
  maxStudents: number = 4;
  currentStudentID = "";

  iduser: string = "";
  en_first_name: string = "";
  en_last_name: string = "";
  th_first_name: string = "";
  th_last_name: string = "";
  phone: string = ""; 
  api = "https://real-sweatsuit-toad.cyclic.app"
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private el: ElementRef,
    private service: AuthService
  ) {
    this.projectForm = this.fb.group({
      students: this.fb.array([]),

      idstudent: ['', Validators.required],
      en_first_name: ['', Validators.required],
      en_last_name: ['', Validators.required],
      th_first_name: ['',],
      th_last_name: ['',],
    });
  }

  async ngOnInit(): Promise<void> {
    this.userProfile =await  JSON.parse(sessionStorage.getItem("loggedInUser") || "");
    this.http.get(this.api + "/register/checkregister/:"+this.userProfile.email).subscribe((res:any)=>{
      if(res.state){
        this.router.navigate(["home"]);
      }
      
    })
  
  }


  register_user() {
    let userData = {
      "iduser": this.iduser,
      "name": this.en_first_name,
      "email": this.userProfile.email,
      "role_idrole": "2",
    };
    let studentData = {
      "idstudent": this.iduser,
      "en_first_name": this.en_first_name,
      "en_last_name": this.en_last_name,
      "th_first_name": this.th_first_name,
      "th_last_name": this.th_last_name,
    };
    let emailData = {
      "student_idstudent": this.iduser,
      "email": this.userProfile.email,
    };
    let phoneData = {
      "student_idstudent": this.iduser,
      "phone": this.phone,
    };
    this.http.post(this.api + "/register/user/add", userData).subscribe((Data: any) => {
    })
    this.http.post(this.api + "/register/student/add", studentData).subscribe((Data: any) => {
      this.http.post(this.api + "/register/student_phone/add", phoneData).subscribe((Data: any) => {
      })
      this.http.post(this.api + "/register/student_email/add", emailData).subscribe((Data: any) => {
        this.router.navigate(['/home']);
      })
    });
  }



  save() {
    if (this.currentStudentID === '') {
      // เช็คว่าฟอร์มถูกต้องหรือไม่
      const isFormValid = this.iduser &&
        this.en_first_name && this.en_last_name;
      console.log(this.currentStudentID)
      if (isFormValid) {
        this.register_user();
      } else {
        alert('Please fill in all required fields.');
      }
    } else {

    }
  }


}
