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
  selector: 'app-updateprofile-ad',
  templateUrl: './updateprofile-ad.component.html',
  styleUrls: ['./updateprofile-ad.component.css']
})
export class UpdateprofileAdComponent implements OnInit {
  userProfile: any;
  result: any;
  dataEmail: any;
  api = "https://real-sweatsuit-toad.cyclic.app"
  isClickable: boolean = true;

  showForm1: boolean = true;
  showForm2: boolean = false;
  StudentArray: any[] = [];
  isResultLoaded = false;

  advisors: any[] = [];
  projectForm: FormGroup;
  maxStudents: number = 4;
  currentStudentID = "";

  iduser: string = "";
  idadvisor: string = "";
  ad_en_first_name: string = "";
  ad_en_last_name: string = "";
  ad_th_first_name: string = "";
  ad_th_last_name: string = "";
  phone: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private el: ElementRef,
    private service: AuthService
  ) {
    this.projectForm = this.fb.group({
      advisors: this.fb.array([]),

      idadvisor: ['', Validators.required],
      ad_en_first_name: ['', Validators.required],
      ad_en_last_name: ['', Validators.required],
      ad_th_first_name: ['',],
      ad_th_last_name: ['',],
    });
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      var idadvisor = await params['idadvisor'].substring(1);
      this.iduser = idadvisor
      await this.getStudent(idadvisor);
      console.log(idadvisor)

    })
  }
  phonelist: any[] = [];
  addPhone() {
    if (this.phone.trim() !== '') {
      var phoneNumbers = { "phone": this.phone, "advisor_idadvisor": this.iduser };
      // Assuming you have some logic to generate unique IDs for each phone number
      this.phonelist.push(phoneNumbers);
      this.phone = ''; // Clear input after adding
    }
    console.log(this.phonelist)
  }

  removePhone(phoneNumber: any) {
    // console.log(phoneNumber)
    this.phonelist = this.phonelist.filter(item => item.phone !== phoneNumber.phone);

  }

  removePhoneAd(phoneNumber: any) {
    var phone = { "phone": phoneNumber.phone, "advisor_idadvisor": this.iduser };
    console.log(phone)
    this.phoneData = this.phoneData.filter(item => item.phone !== phoneNumber.phone);

    this.http.delete(this.api + `/profileAdv/advisor_phone/leave/:${phone.advisor_idadvisor}/:${phone.phone}`).subscribe((res: any) => {
    })
  }

  async setUser() {
    this.idadvisor = await this.advisorData[1].idadvisor;
    this.ad_en_first_name = await this.advisorData[1].ad_en_first_name;
    this.ad_en_last_name = await this.advisorData[1].ad_en_last_name;
    this.ad_th_first_name = await this.advisorData[1].ad_th_first_name;
    this.ad_th_last_name = await this.advisorData[1].ad_th_last_name;
    this.currentStudentID = await this.advisorData[1].idadvisor;
  }

  advisorData: any[] = [];
  phoneData: any[] = [];
  emailData: any[] = [];
  async getStudent(advisorId: any) {
    this.http.get(this.api + `/profileAdv/advisor/:${advisorId}`).subscribe(async (advisorData: any) => {
      this.advisorData = await Object.entries(advisorData.data)[0];
      await this.setUser();
      await console.log(this.ad_en_first_name )
      this.http.get(this.api + `/profileAdv/advisor_phone/:${advisorId}`).subscribe(async (resultData: any) => {
        this.phoneData = await resultData.data;
        console.log(resultData.data)
      })
      this.http.get(this.api + `/profileAdv/advisor_email/:${advisorId}`).subscribe(async (resultData: any) => {
        this.emailData = await resultData.data;
        // console.log(this.emailData)
      })
    });
  }

  register_user() {
    let advisorData = {
      "idadvisor": this.idadvisor,
      "ad_en_first_name": this.ad_en_first_name,
      "ad_en_last_name": this.ad_en_last_name,
      "ad_th_first_name": this.ad_th_first_name,
      "ad_th_last_name": this.ad_th_last_name,
    };
    console.log(advisorData)
    for (let i of this.phonelist) {
      console.log(i)
      this.http.post(this.api + "/profileAdv/advisor_phone/add", i).subscribe((resultData: any) => {
      });
    }
    this.http.put(this.api + "/profileAdv/advisor/update/:" + this.iduser, advisorData).subscribe((resultData: any) => {
    });
    this.router.navigate(['/profile']);
    this.scrollToTop();
  }

  save() {
    console.log("asd")
    if (this.currentStudentID === '') {
      // เช็คว่าฟอร์มถูกต้องหรือไม่
      const isFormValid = this.iduser &&
        this.ad_en_first_name && this.ad_en_last_name;
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
