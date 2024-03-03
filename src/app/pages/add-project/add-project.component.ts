import { Component, Injectable, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvitePopupComponent } from './invite-popup/invite-popup.component';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})

export class AddProjectComponent implements OnInit {

  api = "https://real-sweatsuit-toad.cyclic.app"

  showForm1: boolean = true;
  showForm2: boolean = false;

  students: any[] = [];
  projectForm: FormGroup;
  maxStudents: number = 4;
  currentStudentID = "";

  en_title: string = "";
  th_title: string = "";
  url: string = "";
  category: string = "";
  year: string = "";

  idstudent: string = "";
  en_first_name: string = "";
  en_last_name: string = "";
  th_first_name: string = "";
  th_last_name: string = "";
  descript: string = "";

  idadvisor: string = "";
  ad_en_first_name: string = "";
  ad_en_last_name: string = "";
  ad_th_first_name: string = "";
  ad_th_last_name: string = "";

  en_abstract: string = "";
  th_abstract: string = "";

  keyword: string = "";

  idstinvite: string = "";
  submittedinviteStudent: any[] = [];
  submittedWords: any[] = [];
  isClickable: boolean = true;
  studentData: any[] = [];
  project_keywordData: any[] = [];
  studentId: any
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private el: ElementRef,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.projectForm = this.fb.group({
      students: this.fb.array([]),

      en_title: ['', Validators.required],
      th_title: ['', Validators.required],
      url: ['',],
      category: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/), Validators.maxLength(10)]],

      idstudent: ['', Validators.required],
      en_first_name: ['', Validators.required],
      en_last_name: ['', Validators.required],
      th_first_name: ['',],
      th_last_name: ['',],
      descript: ['',],

      idadvisor: ['', Validators.required],
      ad_en_first_name: ['', Validators.required],
      ad_en_last_name: ['', Validators.required],
      ad_th_first_name: ['',],
      ad_th_last_name: ['',],

      en_abstract: ['', Validators.required],
      th_abstract: ['', Validators.required],

      keyword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.studentId = params['idstudent'].substring(1);
    });
    this.getStudent(this.studentId);
  }

  isAddButtonDisabled(): boolean {
    return this.students.length >= this.maxStudents;
  }

  setStudent(data: any) {
    this.idstudent = data.idstudent;
    this.en_first_name = data.en_first_name;
    this.en_last_name = data.en_last_name;
    this.th_first_name = data.th_first_name;
    this.th_last_name = data.th_last_name;

    this.currentStudentID = data.idstudent;
  }

  getStudent(studentId: any) {
    this.http.get(this.api + `/adProject/:${studentId}`).subscribe((resultData: any) => {
      this.studentData = resultData.data;
      // console.log(this.studentData)
    });
  }
  projectIdreturn: any;
  async register() {
    console.log('Year value in register():', this.year);
    let bodyData = {
      "en_title": this.en_title,
      "th_title": this.th_title,
      "url": this.url,
      "category": this.category,
      "year": this.year,
    };

    this.http.post(this.api + "/api/project/add", bodyData).subscribe(async (resultData: any) => {
      this.projectIdreturn = await resultData.projectId;
      //////////////////////////////////////////////////////////
      for (let i of this.arrayidkeyword) {
        console.log(i)

        let project_keywordData = await {
          "Project_idProject": this.projectIdreturn,
          "keyword_idkeyword": i,
        };
        await console.log(project_keywordData)
        await this.http.post(this.api + "/adProject/project_keyword/add", project_keywordData).subscribe(async (Data: any) => {
        });

      }
      for (let j of this.arrayidinvitestudent) {
        console.log(j)
        let invitestudent = await {
          "Project_idProject": this.projectIdreturn,
          "student_idstudent": j,
        };
        console.log(invitestudent)
        await this.http.post(this.api + "/adProject/invitestudent/add", invitestudent).subscribe((Data: any) => {
        })
      }
      for (let k of this.arrayidinviteadvisor) {
        let inviteadvisor = await {
          "Project_idProject": this.projectIdreturn,
          "advisor_idadvisor": k.idadvisor,
        };
        console.log(inviteadvisor)
        await this.http.post(this.api + "/adProject/inviteadvisor/add", inviteadvisor).subscribe((Data: any) => {
        })
      }
      // /////////////////////////////////////////////
      let descriptData = {
        "descript": this.descript,
      };
      await this.http.post(this.api + "/adProject/member_role/add", descriptData).subscribe((Data: any) => {
        var idmember_role = Data.idmemberrole;

        let project_team = {
          "Project_idProject": this.projectIdreturn,
          "student_idstudent": this.studentId,
          "member_role_idmember_role": idmember_role,
        };
        console.log(project_team)
        this.http.post(this.api + "/adProject/project_team/add", project_team).subscribe((Data: any) => {
        })


      })
      //////////////////////////////////////////////////////////
      let abstractData = {
        "Project_idProject": this.projectIdreturn,
        "en_abstract": this.en_abstract,
        "th_abstract": this.th_abstract,
      };
      await this.http.post(this.api + "/adProject/abstract/add", abstractData).subscribe((Data: any) => {
        console.log(abstractData);
      })
      ////////////////////////////////////////////////////////////
    });
    await this.toastr.success("Project creatted Successfully");
    await this.router.navigate(['/home']);
    this.scrollToTop();
  }

  save() {
    if (this.currentStudentID === '') {
      // เช็คว่าฟอร์มถูกต้องหรือไม่
      const isFormValid = this.en_title && this.th_title && this.year && this.category && this.en_abstract && this.th_abstract;

      if (isFormValid) {
        this.register();
      } else {
        this.toastr.warning('Please fill in all required fields.');
        const firstInvalidControl = this.getFirstInvalidControl();
        if (firstInvalidControl) {
          firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      // โค้ดสำหรับการอัปเดต
      //   this.http.post("/addProject/keyword/delete/:").subscribe((Data: any) => {
      //   console.log(Data);
      // });
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
    this.router.navigate(['/profile']);
    this.scrollToTop();
  }

  goToPreviousForm() {
    this.showForm1 = true;
    this.showForm2 = false;
    this.scrollToTop();
  }

  goToNextForm() {
    this.showForm1 = false;
    this.showForm2 = true;
    this.scrollToTop();
  }
  scrollToTop() {
    const element = document.body;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async OpenDialog(enteranimation: any, exitanimation: any, data: any) {
    const popup = this.dialog.open(InvitePopupComponent, {
      enterAnimationDuration: enteranimation,
      exitAnimationDuration: exitanimation,
      width: '50%',
      data: {
        name: data,
        listadvisor: this.arrayidinviteadvisor,
      }
    });

    popup.afterClosed().subscribe(async (res: any) => {
      this.object = await { 
        "idadvisor": res.idadvisor,
        "name":res.ad_en_first_name,
        "lastname":res.ad_en_last_name
       }
      await this.arrayidinviteadvisor.push(await this.object);
      this.idadinvite = '';
      console.log(this.arrayidinviteadvisor)
    });
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  arrayidinvitestudent: any[] = [];
  resultST: any;

  async inviteStudent(id: string) {
    if (id.trim() !== '') {
      this.http.get(this.api + "/STprofile/:" + id).subscribe(async (studentData: any) => {
        if (studentData.data.length > 0) {
          this.resultST = await Object.entries(studentData.data)[0][1];
          var inviteconfirm = await confirm('invite \n' + this.resultST.idstudent + '   ' + this.resultST.en_first_name + '   ' + this.resultST.en_last_name)
          if (inviteconfirm) {
            await this.submittedinviteStudent.push(this.resultST.idstudent);
            this.object = { "idstudent": this.resultST.idstudent }
            this.arrayidinvitestudent.push(this.resultST.idstudent);
            this.idstinvite = '';
            // console.log(this.submittedinviteStudent)
          }
          else {
            this.idstinvite = '';

          }
        }
        else {
          this.toastr.error("Account not found " + id)
        }
      });
    }
    else {
      this.toastr.warning("Not correct,Please fill Form")
    }
  }

  removeSubmittedInviteStudent(id: any) {
    console.log(id)
    this.submittedinviteStudent = this.submittedinviteStudent.filter(submitted => submitted !== id);

    // this.http.delete("/addProject/keyword/delete/:" + id).subscribe((Data: any) => {
    //   console.log(Data);
    // });
  }
  // ////////////////////////////////////////////////////////////////////////
  idadinvite: string = '';
  submittedinviteAdvisor: any[] = [];
  arrayidinviteadvisor: any[] = [];
  result: any;
  async inviteAdvisor(id: any) {
    if (id != null) {
      this.object = await { "idadvisor": String(id) }
      await this.arrayidinviteadvisor.push(this.object);
      this.idadinvite = '';
      console.log(this.arrayidinviteadvisor)
    }
  }

  removeSubmittedInviteAdvisor(id: any) {
    console.log(id)
    this.arrayidinviteadvisor = this.arrayidinviteadvisor.filter(submitted => submitted.idadvisor !== id);

    // this.http.delete("/addProject/keyword/delete/:" + id).subscribe((Data: any) => {
    //   console.log(Data);
    // });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  keywordId: any;
  object: any;
  arrayidkeyword: any[] = [];
  submitKeyword() {

    if (this.keyword.trim() !== '') {
      let keywordData = {
        "keyword": this.keyword.toLowerCase(),
      };

      this.http.post(this.api + "/adProject/keyword/add", keywordData).subscribe(async (Data: any) => {
        this.keywordId = await Data.keywordId;
        this.object = { "idkey": this.keywordId, "keywords": this.keyword }
        this.submittedWords.push(this.object);
        this.arrayidkeyword.push(this.keywordId);
        console.log(this.keywordId)
        this.keyword = '';

      });
    }
    else {
      this.toastr.warning("Not correct,Please fill Form")
    }
  }

  removeSubmittedWord(id: any, word: any) {
    console.log(id, word)
    this.submittedWords = this.submittedWords.filter(submittedWord => submittedWord.keywords !== word);

    this.http.delete(this.api + "/adProject/keyword/delete/:" + id).subscribe((Data: any) => {
      console.log(Data);
    });
  }

  inviteAdvisorpopup(data: any) {
    if (data.trim() !== '') {
      this.OpenDialog('1000ms', '600ms', data);
    }
    else {
      this.toastr.warning("Not correct,Please fill Form")
    }
  }

}
