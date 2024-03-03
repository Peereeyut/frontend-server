import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private el: ElementRef, private route: ActivatedRoute, private toastr: ToastrService,) {

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
  submittedWords: any[] = [];

  isClickable: boolean = true;

  studentId: any
  projectId: string = "";
  projectData: any[] = [];
  projectABData: any;
  studentData: any;
  projectstudentData: any;
  projectAdvisorData: any;
  projectKeywordData: any;

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      this.projectId = await params['idProject'].substring(1);
      this.studentId = await params['idstudent'].substring(1);
      await this.getstudentinvited(this.projectId);
      await this.getadvisorinvited(this.projectId);
      await this.getmemberteam(this.projectId)
      await this.getmemberteamAd(this.projectId);
      console.log(this.projectId)
      console.log(this.studentId)
      await this.getProjectById(this.projectId);
      await this.getAbstractById(this.projectId);
      this.getStudent(this.studentId);
      // await this.getStudentById(this.projectId);
      await this.getAdvisorById(this.projectId);
      await this.getKeywordById(this.projectId);
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
    this.keyword = data.keyword;
    this.currentStudentID = data.projectId;
  }

  UpdateRecords() {
    // Construct data objects for different parts of the project
    let bodyData = {
      "en_title": this.en_title,
      "th_title": this.th_title,
      "url": this.url,
      "category": this.category,
      "year": this.year,
    };

    let studentData = {
      "idstudent": this.idstudent,
      "en_first_name": this.en_first_name,
      "en_last_name": this.en_last_name,
      "th_first_name": this.th_first_name,
      "th_last_name": this.th_last_name,
    };

    let advisorData = {
      "idadvisor": this.idadvisor,
      "ad_en_first_name": this.ad_en_first_name,
      "ad_en_last_name": this.ad_en_last_name,
      "ad_th_first_name": this.ad_th_first_name,
      "ad_th_last_name": this.ad_th_last_name,
    };

    let abstractData = {
      "en_abstract": this.en_abstract,
      "th_abstract": this.th_abstract,
    };

    // Send PUT requests to update project details, student details, advisor details, and abstract details
    this.http.put(this.api + "/edProject/project/update/" + this.currentStudentID, bodyData).subscribe((resultData: any) => {
      // Update project details

      // Send PUT request to update student details
      this.http.put(this.api + "/edProject/student/update/" + this.idstudent, studentData).subscribe((resultData: any) => {
        // Update student details

        // Send PUT request to update advisor details
        this.http.put(this.api + "/edProject/advisor/update/" + this.idadvisor, advisorData).subscribe((resultData: any) => {
          // Update advisor details

          // Send PUT request to update abstract details
          this.http.put(this.api + "/edProject/abstract/update/" + this.Project_idProject, abstractData).subscribe((resultData: any) => {
            // Update abstract details
          });
        });
      });
    });
  
  }

  getProjectById(projectId: string) {
    this.http.get(this.api + `/rmProject/:${projectId}`).subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.projectData = resultData.data;
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // arrayidinvitestudent: any[] = [];
  resultST: any;
  submittedinviteStudent: any[] = [];
  async inviteStudent(id: string) {
    if (id.trim() !== '') {
      this.http.get(this.api + "/STprofile/:" + id).subscribe(async (studentData: any) => {
        this.resultST = await Object.entries(studentData.data)[0][1];
        var inviteconfirm = await confirm('invite \n' + this.resultST.idstudent + '   ' + this.resultST.en_first_name + '   ' + this.resultST.en_last_name)
        if (inviteconfirm) {
          this.object = { "student_idstudent": this.resultST.idstudent, "Project_idProject": this.projectId }
          await this.submittedinviteStudent.push(this.object);
          // this.arrayidinvitestudent.push(this.resultST.idstudent);
          this.idstinvite = '';
          // console.log(this.submittedinviteStudent)
        }
        else {
          this.idstinvite = '';
        }
      });
    }
    else {
      this.toastr.warning("Not correct,Please fill Form")
    }
  }

  removeSubmittedInviteStudent(id: any, idproject: any) {
    console.log(id)
    this.submittedinviteStudent = this.submittedinviteStudent.filter(submitted => submitted.student_idstudent !== id);
    this.invitedstudent = this.invitedstudent.filter(submitted => submitted.student_idstudent !== id);

    this.http.delete(this.api + "/edProject/deleteinvite/:" + id + "/:" + idproject).subscribe((Data: any) => {
      console.log(Data);
    });
  }
  // ////////////////////////////////////////////////////////////////////////
  idadinvite: string = '';
  submittedinviteAdvisor: any[] = [];
  arrayidinviteadvisor: any[] = [];
  result: any;
  async inviteAdvisor(id: string) {
    if (id.trim() !== '') {
      this.http.get(this.api + "/STprofile/advisor/:" + id).subscribe(async (advisorData: any) => {
        this.result = await Object.entries(advisorData.data)[0][1];
        var inviteconfirm = await confirm('invite \n' + this.result.idadvisor + '   ' + this.result.ad_en_first_name + '   ' + this.result.ad_en_last_name)
        if (inviteconfirm) {
          await this.submittedinviteAdvisor.push(this.result.idadvisor);
          this.object = { "idadvisor": this.result.idadvisor }
          this.arrayidinviteadvisor.push(this.result.idadvisor);
          this.idadinvite = '';
          // console.log(this.submittedinviteadvisor)
        }
        else {
          this.idadinvite = '';
        }
      });
    }
    else {
      this.toastr.warning("Not correct,Please fill Form")
    }
  }

  removeSubmittedInviteAdvisor(id: any, idproject: any) {
    console.log(id)
    this.submittedinviteAdvisor = this.submittedinviteAdvisor.filter(submitted => submitted.advisor_idadvisor !== id);
    this.invitedadvisor = this.invitedadvisor.filter(submitted => submitted.advisor_idadvisor !== id);

    this.http.delete(this.api + "/edProject/deleteinvite/:" + id + "/:" + idproject).subscribe((Data: any) => {
      console.log(Data);
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  keywordId: any;
  object: any;
  arrayidkeyword: any[] = [];
  submitKeyword() {

    if (this.keyword.trim() !== '') {
      let keywordData = {
        "keyword": this.keyword,
      };

      this.http.post(this.api + "/adProject/keyword/add", keywordData).subscribe(async (Data: any) => {
        this.keywordId = await Data.keywordId;
        this.object = { "idkey": this.keywordId, "keywords": this.keyword }
        this.submittedWords.push(this.keyword);
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

  save() {
 
      if (true) {
        this.UpdateRecords();
      } else {
        alert('Please fill in all required fields.');
      }
   
  }
  
  datateam: any[] = [];
  async getmemberteam(idproject: any) {
    try {
      const res: any = await this.http.get(this.api + "/projectteam/:" + idproject).toPromise();

      for (let i of res.member) {
        if (i.student_idstudent != this.studentId) {
          const data: any = await this.http.get(this.api + "/studentinfor/:" + i.student_idstudent).toPromise();
          console.log(data.student_data);
          this.datateam.push(data.student_data);
        }
      }

      console.log(this.datateam);
    } catch (error) {
      console.error("Error fetching project team:", error);
    }
  }
  // **
  datateamAd: any[] = [];
  async getmemberteamAd(idproject: any) {
    try {
      const res: any = await this.http.get(this.api + "/projectadvisor/:" + idproject).toPromise();
      this.datateamAd = res.member;
      console.log(this.datateamAd)
      
      // console.log(this.datateamAd);
    } catch (error) {
      console.error("Error fetching project team:", error);
    }
  }

  invitedstudent: any[] = [];
  async getstudentinvited(idProject: any) {
    try {
      const res: any = await this.http.get(this.api + "/invitedstudent/:" + idProject).toPromise();
      for (let i of res.data) {
        console.log(i)
        this.invitedstudent.push(i);
      }

      // console.log(this.submittedinviteStudent);
    } catch (error) {
      console.error("Error fetching project team:", error);
    }
  }

  invitedadvisor: any[] = [];
  async getadvisorinvited(idProject: any) {
    try {
      const res: any = await this.http.get(this.api + "/invitedadvisor/:" + idProject).toPromise();
      for (let i of res.data) {
        console.log(i)
        this.invitedadvisor.push(i);
      }

      // console.log(this.submittedinviteadvisor);
    } catch (error) {
      console.error("Error fetching project team:", error);
    }
  }

}
