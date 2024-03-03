import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { InviteadvisorEditComponent } from './inviteadvisor-edit/inviteadvisor-edit.component';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
})
export class EditProjectComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private el: ElementRef, private route: ActivatedRoute, private toastr: ToastrService, private dialog: MatDialog,) {

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

  idmember_role: string = "";
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
      await this.getroleDescript(this.projectId, this.studentId);
      await this.getmemberteamAd(this.projectId);
      await this.getProjectById(this.projectId);
      await this.getAbstractById(this.projectId);
      this.getStudent(this.studentId);
      // await this.getStudentById(this.projectId);
      await this.getAdvisorById(this.projectId);
      await this.getKeywordById(this.projectId);
    });
  }

  async UpdateRecords() {
    let bodyData = await {
      "en_title": this.projectData[0].en_title,
      "th_title": this.projectData[0].th_title,
      "url": this.projectData[0].url,
      "category": this.projectData[0].category,
      "year": this.projectData[0].year,
      "idProject": this.projectData[0].idProject
    };

    let abstractData = await {
      "en_abstract": this.projectABData[0].en_abstract,
      "th_abstract": this.projectABData[0].th_abstract,
      "idProject": this.projectData[0].idProject
    };

    let roledescriptData = await {
      "descript": this.roledescriptData[0].descript,
      "idmember_role": this.roledescriptData[0].member_role_idmember_role
    };

    await this.http.put(this.api + "/edProject/project/update", bodyData).subscribe(async (resultData: any) => {
    });


    await this.http.put(this.api + "/edProject/abstract/update", abstractData).subscribe((resultData: any) => {
    });

    await this.http.put(this.api + "/edProject/descript/update", roledescriptData).subscribe((resultData: any) => {
    });

    for (let j of this.submittedinviteStudent) {
      let invitestudent = await {
        "Project_idProject": j.Project_idProject,
        "student_idstudent": j.student_idstudent,
      };
      await this.http.post(this.api + "/adProject/invitestudent/add", invitestudent).subscribe((Data: any) => {
      })
    }
    for (let k of this.arrayidinviteadvisor) {
      console.log(k);
      let inviteadvisor = await {
        "Project_idProject": this.projectData[0].idProject,
        "advisor_idadvisor": k.idadvisor,
      };
      console.log(inviteadvisor)
      await this.http.post(this.api + "/adProject/inviteadvisor/add", inviteadvisor).subscribe((Data: any) => {
      })
    }
    console.log(bodyData)
    this.router.navigate(['/profile']);
    this.scrollToTop();
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

  getStudent(studentId: any) {
    this.http.get(this.api + `/adProject/:${studentId}`).subscribe((resultData: any) => {
      this.studentData = resultData.data;

    });
  }

  getAdvisorById(projectId: string) {
    this.http.get(this.api + `/rmProject/advisor/:${projectId}`).subscribe((resultData: any) => {
      this.projectAdvisorData = resultData.data;
    });
  }

  getKeywordById(projectId: string) {
    this.http.get(this.api + `/edProject/project_keyword/:${projectId}`).subscribe(async (resultData: any) => {
      this.projectKeywordData = await resultData.data;
      for (let i = 0; i < this.projectKeywordData.length; i++) {

        this.submittedWords.push(this.projectKeywordData[i]);
      };
    });
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
  arrayidinvitestudent: any[] = [];
  resultST: any;
  submittedinviteStudent: any[] = [];
  async inviteStudent(id: string) {
    if (id.trim() !== '') {
      this.http.get(this.api + "/STprofile/:" + id).subscribe(async (studentData: any) => {
        if (studentData.data.length > 0) {
          this.resultST = await Object.entries(studentData.data)[0][1];
          var inviteconfirm = await confirm('invite \n' + this.resultST.idstudent + '   ' + this.resultST.en_first_name + '   ' + this.resultST.en_last_name)
          if (inviteconfirm) {
            this.object = { "student_idstudent": this.resultST.idstudent, "Project_idProject": this.projectId }
            await this.submittedinviteStudent.push(this.object);

            this.idstinvite = '';
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
  removeInviteStudent(id: any, idproject: any) {
    console.log(id, idproject)
    this.submittedinviteStudent = this.submittedinviteStudent.filter(submitted => submitted.student_idstudent !== id);
  }

  removeSubmittedInviteStudent(id: any, idproject: any) {
    // console.log(id,idproject)
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


  removeInviteAdvisor(id: any,) {
    console.log(id)
    this.arrayidinviteadvisor = this.arrayidinviteadvisor.filter(submitted => submitted.idadvisor !== id.idadvisor);
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  removeSubmittedInviteAdvisor(result: any) {
    console.log(result)
    
    this.submittedinviteAdvisor = this.submittedinviteAdvisor.filter(submitted => submitted.idadvisor !== result.idadvisor);

    this.http.delete(this.api + "/edProject/deleteinviteAd/:" + result.idadvisor + "/:" + this.projectId).subscribe((Data: any) => {
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
      console.log(keywordData)
      this.http.post(this.api + "/adProject/keyword/add", keywordData).subscribe(async (Data: any) => {
        this.keywordId = await Data.keywordId;
        this.object = { "idProject": this.projectId, "keyword": this.keyword, "idkeyword": this.keywordId }
        this.submittedWords.push(this.object);
        // this.arrayidkeyword.push(this.keywordId);
        console.log(this.keywordId)
        this.keyword = '';
        console.log(this.projectId)
        var data = { "idProject": this.projectId, "idkeyword": this.keywordId }
        this.http.post(this.api + `/edProject/project_keyword/add`, data).subscribe(async (Data: any) => {

        })

      });
    }
    else {
      this.toastr.warning("Not correct,Please fill Form")
    }
  }


  removeSubmittedWord(id: any, word: any, idkeyword: any) {
    console.log(id, word, idkeyword)
    this.submittedWords = this.submittedWords.filter(submittedWord => submittedWord.keyword !== word);

    this.http.delete(this.api + `/edProject/project_keyword/delete/:${id}/:${idkeyword}`).subscribe((Data: any) => {
      console.log(Data);

      this.http.delete(this.api + "/edProject/keyword/delete/:" + idkeyword).subscribe((Data: any) => {
        console.log(Data);
      })
    });
  }

  save() {
    if (this.currentStudentID === '') {
      // เช็คว่าฟอร์มถูกต้องหรือไม่
      const isFormValid = this.en_title && this.th_title && this.year && this.descript;

      if (isFormValid) {
        this.UpdateRecords();
      } else {
        alert('Please fill in all required fields.');
      }
    }
  }

  datateam: any[] = [];
  async getmemberteam(idproject: any) {
    try {
      const res: any = await this.http.get(this.api + "/edProject/projectteam/:" + idproject).toPromise();

      for (let i of res.member) {
        if (i.student_idstudent != this.studentId) {
          const data: any = await this.http.get(this.api + "/edProject/studentinfor/:" + i.student_idstudent).toPromise();
          // console.log(data, );
          await data.student_data.push(i.descript);
          this.datateam.push(await data.student_data);
        }
      }

      // console.log(this.datateam);
    } catch (error) {
      console.error("Error fetching project team:", error);
    }
  }
  // **
  datateamAd: any[] = [];
  async getmemberteamAd(idproject: any) {
    try {
      const res: any = await this.http.get(this.api + "/edProject/projectadvisor/:" + idproject).toPromise();
      if (res.status) {
        for (let i of res.advisor_data) {
          // console.log(i)
          await this.datateamAd.push(i);
        }
      }
    } catch (error) {
      console.error("Error fetching project team:", error);
    }
  }

  // **
  roledescriptData: any[] = [];
  async getroleDescript(idproject: any, studentId: any) {
    try {
      const res: any = await this.http.get(this.api + "/edProject/roleDescript/:" + idproject + "/:" + studentId).toPromise();
      this.roledescriptData = res.member;
      console.log(this.roledescriptData)
      // console.log(idproject,studentId)
      // console.log(this.datateamAd);
    } catch (error) {
      console.error("Error fetching project team:", error);
    }
  }

  invitedstudent: any[] = [];
  async getstudentinvited(idProject: any) {
    try {
      const res: any = await this.http.get(this.api + "/edProject/invitedstudent/:" + idProject).toPromise();
      for (let i of res.data) {
        console.log(i)
        this.submittedinviteStudent.push(i);
      }

      // console.log(this.submittedinviteStudent);
    } catch (error) {
      console.error("Error fetching project team:", error);
    }
  }

  invitedadvisor: any[] = [];
  async getadvisorinvited(idProject: any) {
    try {
      const res: any = await this.http.get(this.api + "/edProject/invitedadvisor/:" + idProject).toPromise();
      console.log(res.data)
      if (res.status) {

        for (let i of res.data) {
          // console.log(i)
          this.object = await {
            "idadvisor": i.advisor_idadvisor,
            "name": i.ad_en_first_name,
            "lastname": i.ad_en_last_name
          }
          await this.submittedinviteAdvisor.push(this.object);
        }
      }
    } catch (error) {
      console.error("Error fetching project team:", error);
    }
  }
  inviteAdvisorpopup(data: any) {
    if (data.trim() !== '') {
      this.OpenDialog('1000ms', '600ms', data);
    }
    else {
      this.toastr.warning("Not correct,Please fill Form")
    }
  }
  async OpenDialog(enteranimation: any, exitanimation: any, data: any) {
    const popup = this.dialog.open(InviteadvisorEditComponent, {
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
        "name": res.ad_en_first_name,
        "lastname": res.ad_en_last_name
      }
      await this.arrayidinviteadvisor.push(await this.object);
      this.idadinvite = '';
      console.log(this.arrayidinviteadvisor)
    });
  }
}
