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
  selector: 'app-myproject',
  templateUrl: './myproject.component.html',
  styleUrls: ['./myproject.component.css']
})
export class MyprojectComponent implements OnInit {
  userProfile: any;
  result: any;
  dataEmail: any;
  api = "https://real-sweatsuit-toad.cyclic.app"
  showForm1: boolean = true;
  showForm2: boolean = false;
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

  ngOnInit(): void {
    this.userProfile = JSON.parse(sessionStorage.getItem("loggedInUser") || "");
    this.service.isRegister(this.userProfile.email).subscribe(item=> {
      this.result = item;
      this.dataEmail=this.result.data[0].email;
      if (this.dataEmail === this.userProfile.email) {
        this.router.navigate(['/home']);
      }
      else {
        this.router.navigate(['/register']);
        
      }
    })
    
  }

  isAddButtonDisabled(): boolean {
    return this.students.length >= this.maxStudents;
  }

  Add() {
    const studentsArray = this.projectForm.get('students') as FormArray;
    studentsArray.push(this.createStudentFormGroup());
  }

  createStudentFormGroup(): FormGroup {
    return this.fb.group({
      idstudent: ['', Validators.required],
      en_first_name: ['', Validators.required],
      en_last_name: ['', Validators.required],
      th_first_name: ['', Validators.required],
      th_last_name: ['', Validators.required],
    });
  }

  get studentsControls() {
    return (this.projectForm.get('students') as FormArray).controls;
  }

  clearForm() {
    this.projectForm.reset();
  }

  register_user() {
    let userData = {
      "iduser": this.iduser,
      "name": this.en_first_name,
      "email": this.userProfile.email,
      "role_idrole": "5",
    };
    let studentData = {
      "idstudent": this.iduser,
      "en_first_name": this.en_first_name,
      "en_last_name": this.en_last_name,
      "th_first_name": this.th_first_name,
      "th_last_name": this.th_last_name,
      
    };
    if (this.dataEmail === this.userProfile.email) {
      this.router.navigate(['/home']);
      this.http.put(this.api + "/api/user/add", userData).subscribe((userData: any) => {
        console.log(userData);
      });
    }
    else {
      console.log(this.result.data[0].email)
      this.router.navigate(['/edit-profile']);
      this.http.post(this.api + "/api/user/add", userData).subscribe((userData: any) => {
        console.log(userData);
      });
      this.http.post(this.api + "/api/student/add", studentData).subscribe((studentData: any) => {
        console.log(studentData);
        alert("Project creatted Successfully");
        this.router.navigate(['/home']);
    });
    }
  }



  save() {
    if (this.currentStudentID === '') {
      // เช็คว่าฟอร์มถูกต้องหรือไม่
      const isFormValid = this.iduser &&
        this.en_first_name && this.en_last_name;

      if (isFormValid) {
        this.register_user();
      } else {
        alert('Please fill in all required fields.');

        // เลื่อนไปยังฟอร์มแรกที่ยังไม่ได้กรอก
        const firstInvalidControl = this.getFirstInvalidControl();
        if (firstInvalidControl) {
          firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      // โค้ดสำหรับการอัปเดต
    }
  }

  getFirstInvalidControl() {
    const formControls = this.projectForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName) && formControls[controlName].invalid) {
        return this.el.nativeElement.querySelector(`[formcontrolname="${controlName}"]`);
      }
    }
    return null;
  }

  onCancel() {
    this.router.navigate(['/home']);
    this.scrollToTop();
  }


  scrollToTop() {
    const element = document.body;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}


  // save() {
  //   console.log('Save function called');
  //   const studentData: any[] = [];
  //   this.students.forEach((student, index) => {
  //     const data = {
  //       st_id: student[`st_id_${index + 1}`] || '',
  //       n_ENG: student[`n_ENG_${index + 1}`] || '',
  //       n_TH: student[`n_TH_${index + 1}`] || '',
  //     };
  //     studentData.push(data);
  //   });
  
  //   console.log('Student data to be sent:', studentData);
  
  //   this.http.post(this.api + "/api/student/add", { students: studentData }).subscribe(
  //     (response: any) => {
  //       console.log(response);
  //       alert('Project created Successfully');
  //       this.router.navigate(['/home']);
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //       alert('Failed to create project. Please check the console for errors.');
  //     }
  //   );
  // } 