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
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  userProfile: any;
  result: any;
  dataEmail: any;

  isClickable: boolean = true;

  showForm1: boolean = true;
  showForm2: boolean = false;
  StudentArray: any[] = [];
  isResultLoaded = false;

  students: any[] = [];
  projectForm: FormGroup;
  maxStudents: number = 4;
  currentStudentID = "";

  iduser: string = "";
  idstudent: string = "";
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
    this.route.params.subscribe(async (params) => {
      var idstudent = await params['idstudent'].substring(1);
      this.iduser = idstudent
      await this.getStudent(idstudent);

    })
  }
  phonelist: any[] = [];
  addPhone() {
    if (this.phone.trim() !== '') {
      var phoneNumbers = { "phone": this.phone, "student_idstudent": this.iduser };
      // Assuming you have some logic to generate unique IDs for each phone number
      this.phonelist.push(phoneNumbers);
      this.phone = ''; // Clear input after adding
    }
    console.log(this.phonelist)
  }

  removePhone(phoneNumber: any) {
    // console.log(phoneNumber)
    this.phonelist = this.phonelist.filter(item => item.phone !== phoneNumber.phone);

    // this.http.delete(this.api + `/profile/student_phone/leave`, phoneNumber).subscribe((resultData: any) => {
    //   console.log(resultData.data)
    // })
  }

  removePhoneAd(phoneNumber: any) {
    var phone = { "phone": phoneNumber.phone, "student_idstudent": this.iduser };
    console.log(phone)
    this.phoneData = this.phoneData.filter(item => item.phone !== phoneNumber.phone);

    this.http.delete(this.api + `/profile/student_phone/leave/:${phone.student_idstudent}/:${phone.phone}`).subscribe((res: any) => {
    })
  }

  async setUser() {
    this.idstudent = await this.studentData[1].idstudent;
    this.en_first_name = await this.studentData[1].en_first_name;
    this.en_last_name = await this.studentData[1].en_last_name;
    this.th_first_name = await this.studentData[1].th_first_name;
    this.th_last_name = await this.studentData[1].th_last_name;
    this.currentStudentID = await this.studentData[1].idstudent;
  }

  studentData: any[] = [];
  phoneData: any[] = [];
  emailData: any[] = [];
  async getStudent(studentId: any) {
    this.http.get(this.api + `/profile/student/:${studentId}`).subscribe(async (studentData: any) => {
      this.studentData = await Object.entries(studentData.data)[0];
      await this.setUser();
      await console.log(this.idstudent, this.en_first_name)
      this.http.get(this.api + `/profile/phone/:${studentId}`).subscribe(async (resultData: any) => {
        this.phoneData = await resultData.data;
        // console.log(resultData.data)
      })
      this.http.get(this.api + `/profile/email/:${studentId}`).subscribe(async (resultData: any) => {
        this.emailData = await resultData.data;
        // console.log(resultData.data)
      })
    });
  }

  register_user() {

    let userData = {
      "iduser": this.iduser,
      "name": this.en_first_name,
    };
    let studentData = {
      "idstudent": this.idstudent,
      "en_first_name": this.en_first_name,
      "en_last_name": this.en_last_name,
      "th_first_name": this.th_first_name,
      "th_last_name": this.th_last_name,

    };
    console.log(studentData)
    for (let i of this.phonelist) {
      console.log(i)
      this.http.post(this.api + "/profile/student_phone/add", i).subscribe((resultData: any) => {
      });
    }
    this.http.put(this.api + "/profile/student/update/:"+ this.iduser,studentData).subscribe((resultData: any) => {
    });
    this.router.navigate(['/profile']);
    this.scrollToTop();
  }

  save() {
    console.log("asd")
    if (this.currentStudentID === '') {
      // เช็คว่าฟอร์มถูกต้องหรือไม่
      const isFormValid = this.iduser &&
        this.en_first_name && this.en_last_name;
      if (isFormValid) {
        this.register_user();
      } else {
        alert('Please fill in all required fields.');
      }
    }
  }

  onCancel() {
    this.router.navigate(['/profile']);
    this.scrollToTop();
  }


  scrollToTop() {
    const element = document.body;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}
