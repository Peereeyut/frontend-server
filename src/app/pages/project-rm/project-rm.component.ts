import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project-rm',
  templateUrl: './project-rm.component.html',
  styleUrls: ['./project-rm.component.css']
})
export class ProjectRMComponent {


  showForm1: boolean = true;
  showForm2: boolean = false;
  showForm3: boolean = false;
  showForm4: boolean = false;

  StudentArray: any[] = [];
  isResultLoaded = false;
  currentStudentID = "";
  
  projectId: string = '';

  en_title: string = "";
  th_title: string = "";

  st_id_1: string = "";
  n_ENG_1: string = "";
  n_TH_1: string = "";

  st_id_2: string = "";
  n_ENG_2: string = "";
  n_TH_2: string = "";

  st_id_3: string = "";
  n_ENG_3: string = "";
  n_TH_3: string = "";

  st_id_4: string = "";
  n_ENG_4: string = "";
  n_TH_4: string = "";

  advisor: string = "";
  coadvisor: string = "";
  description: string = "";
  category: string | undefined;
  year: string = "";

  projectData: any[] = []; // เพิ่มตัวแปร projectData เพื่อเก็บข้อมูลโปรเจ็ค
  projectABData: any[] = [];
  projectstudentData: any[] = [];
  projectAdvisorData: any[] = [];
  projectKeywordData: any[] = [];
  api = "https://real-sweatsuit-toad.cyclic.app"

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    // ...
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const projectId = params['idProject'];
      console.log(projectId)
      this.getProjectById(projectId);
      this.getAbstractById(projectId);
      this.getStudentById(projectId);
      this.getAdvisorById(projectId);
      this.getKeywordById(projectId);
    });
    // this.route.params.subscribe((params) => {
    //   const projectABId = params['Project_idProject'];
    //   this.getAbstractById(projectABId);
    // });
  }

  onShowCategory(newCategory: any): void {
    this.category = newCategory;
  }

  getProjectById(projectId: any) {
    this.http.get(this.api + `/rmProject/:${projectId}`).subscribe((resultData: any) => {
      // console.log(resultData);
      this.projectData = resultData.data;
    });
  }

  getAbstractById(projectId: any) {
    this.http.get(this.api + `/rmProject/abstract/:${projectId}`).subscribe((resultData: any) => {
      this.projectABData = Object.entries(resultData.data)[0];
    });
  }

  getStudentById(projectId: any) {
    this.http.get(this.api + `/rmProject/student/:${projectId}`).subscribe((resultData: any) => {
      this.projectstudentData = resultData.data;
    });
  }

  getAdvisorById(projectId: any) {
    this.http.get(this.api + `/rmProject/advisor/:${projectId}`).subscribe((resultData: any) => {
      this.projectAdvisorData = resultData.data;
      // console.log(this.projectAdvisorData)
    });
  }

  getKeywordById(projectId: any) {
    this.http.get(this.api + `/rmProject/keyword/:${projectId}`).subscribe((resultData: any) => {
      this.projectKeywordData = resultData.data;
      // console.log(this.projectAdvisorData)
    });
  }

  Abstract() {
    this.showForm1 = true;
    this.showForm2 = false;
    this.showForm3 = false;
    this.showForm4 = false;
  }

  Authors() {
    this.showForm1 = false;
    this.showForm2 = true;
    this.showForm3 = false;
    this.showForm4 = false;
  }

  References() {
    this.showForm1 = false;
    this.showForm2 = false;
    this.showForm3 = true;
    this.showForm4 = false;
  }

  Keywords() {
    this.showForm1 = false;
    this.showForm2 = false;
    this.showForm3 = false;
    this.showForm4 = true;
  }
}
