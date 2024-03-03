import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private el: ElementRef, private route: ActivatedRoute,) {
    // this.setUpdate(this.projectData);
    // this.getProjectById(this.projectId);
    // this.EditForm = new FormGroup({
    //   en_title: new FormControl(''),
    //   th_title: new FormControl(''),
    //   url: new FormControl(''),
    //   category: new FormControl(''),
    //   year: new FormControl(''),

    //   idstudent: new FormControl(''),
    //   en_first_name: new FormControl(''),
    //   en_last_name: new FormControl(''),
    //   th_first_name: new FormControl(''),
    //   th_last_name: new FormControl(''),

    //   idadvisor: new FormControl(''),
    //   ad_en_first_name: new FormControl(''),
    //   ad_en_last_name: new FormControl(''),
    //   ad_th_first_name: new FormControl(''),
    //   ad_th_last_name: new FormControl(''),

    //   en_abstract: new FormControl(''),
    //   th_abstract: new FormControl(''),

    //   keyword: new FormControl(''),
    // });
  }

  showForm1: boolean = true;
  showForm2: boolean = false;
  isResultLoaded = false;
  isUpdateFormActive = false;

  students: any[] = [];
  // EditForm: FormGroup;
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

  Project_idProject: string = "";
  en_abstract: string = "";
  th_abstract: string = "";

  idkeyword: string = "";
  keyword: string = "";
  idstinvite: string = "";
  submittedWords: string[] = [];

  isClickable: boolean = true;
  invitestudentid: any;
  studentId: any
  projectId: string = "";
  projectData: any[] = [];
  projectABData: any;
  studentData: any;
  projectAdvisorData: any;
  projectKeywordData: any;

  api = "https://real-sweatsuit-toad.cyclic.app"

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['idProject'].substring(1);
      this.studentId = params['idstudent'].substring(1);
      this.invitestudentid = this.studentId;
      console.log(this.invitestudentid)
      this.getProjectById(this.projectId);
      this.getAbstractById(this.projectId);
      this.getStudent(this.studentId);
      this.getAdvisorById(this.projectId);
      this.getKeywordById(this.projectId);
    });
    // this.recallForm();
    // console.log(this.projectData)
    // this.setUpdate(this.projectData)
  }

  setUpdate(data: any) {
    this.en_title = data.en_title;
    this.th_title = data.th_title;
    this.url = data.url;
    this.category = data.category;
    this.year = data.year;

    this.idstudent = data.idstudent;
    this.en_first_name = data.en_first_name;
    this.en_last_name = data.en_last_name;
    this.th_first_name = data.th_first_name;
    this.th_last_name = data.th_last_name;
    this.descript = data.descript;

    this.idadvisor = data.idadvisor;
    this.ad_en_first_name = data.ad_en_first_name;
    this.ad_en_last_name = data.ad_en_last_name;
    this.ad_th_first_name = data.ad_th_first_name;
    this.ad_th_last_name = data.ad_th_last_name;

    this.en_abstract = data.en_abstract;
    this.th_abstract = data.th_abstract;

    this.keyword = data.keyword;
    this.currentStudentID = data.idstudent;
  }
  keywordId: any;
  object: any;
  arrayidkeyword: any[] = [];
  projectIdreturn: any;

  async register() {
    // /////////////////////////////////////////////
    let descriptData = {
      "descript": this.descript,
    };
    await this.http.post(this.api + "/adProject/member_role/add", descriptData).subscribe((Data: any) => {
      var idmember_role = Data.idmemberrole;
      console.log(idmember_role)

      let project_team = {
        "Project_idProject": this.projectId,
        "student_idstudent": this.studentId,
        "member_role_idmember_role": idmember_role,
      };
      console.log(project_team)
      this.http.post(this.api + "/adProject/project_team/add", project_team).subscribe((Data: any) => {

      });

      this.http.delete(this.api + "/profile/invitestudent/delete/:" + this.invitestudentid + '/:' + this.projectId).subscribe((Data: any) => {

      });
    });

    await alert("Project creatted Successfully");
    await this.router.navigate(['/profile']);
    this.scrollToTop();
  }

  getProjectById(projectId: string) {
    this.http.get(this.api + `/rmProject/:${projectId}`).subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.projectData = resultData.data;
      console.log(this.projectData[0])
    });
  }

  getAbstractById(projectId: string) {
    this.http.get(this.api + `/rmProject/abstract/:${projectId}`).subscribe((resultData: any) => {
      this.projectABData = resultData.data;
      // console.log(this.projectABData)

    });
  }

  // getStudentById(projectId: string) {
  //   this.http.get(this.api + `/rmProject/student/:${projectId}`).subscribe((resultData: any) => {
  //     this.projectstudentData = resultData.data;
  //   });
  // }
  getStudent(studentId: any) {
    this.http.get(this.api + `/adProject/:${studentId}`).subscribe((resultData: any) => {
      this.studentData = resultData.data;
      console.log(this.studentData)
    });
  }

  getAdvisorById(projectId: string) {
    this.http.get(this.api + `/rmProject/advisor/:${projectId}`).subscribe((resultData: any) => {
      this.projectAdvisorData = resultData.data;

    });
  }

  getKeywordById(projectId: string) {
    this.http.get(this.api + `/rmProject/keyword/:${projectId}`).subscribe(async (resultData: any) => {
      this.projectKeywordData = await resultData.data;
      // console.log(this.projectKeywordData.length)
      for (let i = 0; i < this.projectKeywordData.length; i++) {

        console.log(this.projectKeywordData[i])
        this.submittedWords.push(this.projectKeywordData[i].keyword);
      };
    });

    // console.log(this.submittedWords)
  }


  isAddButtonDisabled(): boolean {
    return this.students.length >= this.maxStudents;
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

  submitKeyword() {
    if (this.keyword.trim() !== '') {
      this.submittedWords.push(this.keyword);
      this.keyword = ''; // Clear the input field after submission
    }
  }

  deleteKeyword(idProject: any, keyword: any) {
    this.http.delete(this.api + `/rmProject/keyword/delete/:${keyword}`).subscribe((resultData: any) => {
      // this.projectAdvisorData = resultData.data;
    });
    this.http.delete(this.api + `/rmProject/keyword/delete/:${keyword}`).subscribe((resultData: any) => {
      // this.projectAdvisorData = resultData.data;

    });
  }
  removeSubmittedWord(word: string) {
    this.submittedWords = this.submittedWords.filter(submittedWord => submittedWord !== word);
    this.deleteKeyword(1, word);
  }

  save() {
    if (true) {
      // เช็คว่าฟอร์มถูกต้องหรือไม่
      // const isFormValid = this.year;

      if (true) {
        this.register();
      } else {
        alert('Please fill in all required fields.');

      }
    }
  }

}