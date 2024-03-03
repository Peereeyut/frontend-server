import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invite-ad',
  templateUrl: './invite-ad.component.html',
  styleUrls: ['./invite-ad.component.css']
})
export class InviteAdComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private el: ElementRef, private route: ActivatedRoute, private toastr: ToastrService) {

  }
  api = "https://real-sweatsuit-toad.cyclic.app"
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
  descript_role: string = "";

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
  inviteadvisorid: any;
  advisorId: any
  projectId: string = "";
  projectData: any[] = [];
  projectABData: any;
  advisorData: any;
  projectAdvisorData: any;
  projectKeywordData: any;
  iddescript_role: any;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['idProject'].substring(1);
      this.advisorId = params['idadvisor'].substring(1);
      this.inviteadvisorid = this.advisorId;
      console.log(this.inviteadvisorid)
      this.getProjectById(this.projectId);
      this.getAbstractById(this.projectId);
      this.getAdvisor(this.advisorId);
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
    this.descript_role = data.descript_role;

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

    let project_advisor = {
      "Project_idProject": this.projectId,
      "Advisor_idAdvisor": this.advisorId,
      "advisor_role_idadvisor_role": this.iddescript_role,
    };
    console.log(project_advisor)
    this.http.post(this.api + "/inviteAdv/project_advisor/add", project_advisor).subscribe(async (Data: any) => {
      if (await Data.status) {
        this.http.delete(this.api + "/inviteAdv/inviteadvisor/delete/:" + this.inviteadvisorid + '/:' + this.projectId).subscribe(async (Data: any) => {
          if (await Data.status) {
            await this.toastr.success("Project Join Successfully");
            await this.router.navigate(['/profilebyad']);
            this.scrollToTop();
          } else {
            await this.toastr.warning("Please fill Form")
          }
        });

      } else {
        await this.toastr.warning("Please fill Form")
      }

    });
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
  getAdvisor(advisorId: any) {
    this.http.get(this.api + `/inviteAdv/advisor/:${advisorId}`).subscribe((resultData: any) => {
      this.advisorData = resultData.data;
      console.log(this.advisorData)
    });
  }

  getAdvisorById(projectId: string) {
    this.http.get(this.api + `/rmProject/advisor/:${projectId}`).subscribe((resultData: any) => {
      this.projectAdvisorData = resultData.data;
    });
  }
  projectStudentData: any[] = [];

  getStudentById(projectId: string) {
    this.http.get(this.api + `/rmProject/student/:${projectId}`).subscribe((resultData: any) => {
      this.projectStudentData = resultData.data;
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
      const isFormValid = this.iddescript_role;
      console.log(isFormValid)
      if (isFormValid) {
        this.register();
      } else {
        this.goToPreviousForm();
        this.toastr.error('Please fill in all required fields description.');

      }
    }
  }

}
