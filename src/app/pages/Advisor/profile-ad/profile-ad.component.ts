import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare var handleSignout: any;

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-profile-ad',
  templateUrl: './profile-ad.component.html',
  styleUrls: ['./profile-ad.component.css']
})
export class ProfileAdComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      // this.getStudent(this.studentId);
    });
  }
  userProfile: any;
  show1: boolean = false;
  show2: boolean = false;
  show3: boolean = true;

  advisorId: string = '';
  selectedCategory: string = 'All';

  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  StudentArray: any[] = [];
  isResultLoaded = false;
  currentIndex = -1;
  currentadvisorID = "";
  currentPage = 1; // หน้าปัจจุบัน
  pageSize = 5;   // จำนวนรายการต่อหน้า
  totalPages = 0;

  currentProjectID = "";
  en_title: string = "";
  th_title: string = "";
  url: string = "";
  category: string = "";
  year: string = "";

  searchQuery: string = '';
  searchResults: any[] = [];
  filteredStudentArray: any[] = [];
  isSearchClicked = false;
  searchResultKeyword: string = '';
  atidproject: any;
  advisorData: any[] = [];
  projectData: any[] = [];
  studentmember: any = [];
  api="https://real-sweatsuit-toad.cyclic.app";
  async ngOnInit(): Promise<any> {
    this.userProfile =await JSON.parse(sessionStorage.getItem("loggedInUser") || "");
    await this.getIdByEmail(this.userProfile.email);
    await this.getAdvisor(this.advisorId);
    
    // await this.pieChart(["a","b","c"],[1,2,3],"asdsa");
    this.currentPage = 1; // กำหนดหน้าปัจจุบันเป็นหน้าที่ 1 เมื่อโหลด component
    this.pageSize = 5; // กำหนดจำนวนโปรเจ็คต่อหน้า
    // เรียกฟังก์ชันเพื่อดึงข้อมูลโปรเจ็คตามหน้าแรก
    await this.getProject(this.advisorId, this.currentPage, this.pageSize);
  }

  handleSignOut() {

    handleSignout();
    sessionStorage.removeItem("loggedInUser");
    this.router.navigate(["/"]).then(() => {
      window.location.reload();
    });
  }

  // _______________________________________________________# GET #________________________________________________________________
  // Get ID
  idbyemail: any;
  getIdByEmail(email: string) {
    this.http.get(this.api + `/api/user/:${email}`).subscribe(async (resultData: any) => {
      this.idbyemail = await resultData.data[0].iduser;
      await this.getAdvisor(this.idbyemail)
      await this.getInvited(this.idbyemail)
      await this.getProject(this.idbyemail, this.currentPage, this.pageSize)
      await this.dashboardAd();
    });
  }

  // Get Data Advisor
  phoneData: any[] = [];
  emailData: any[] = [];
  getAdvisor(advisorId: any) {
    this.http.get(this.api + `/profileAdv/advisor/:${advisorId}`).subscribe(async (advisorData: any) => {
      this.advisorData = await Object.entries(advisorData.data)[0];
      this.http.get(this.api + `/profileAdv/advisor_phone/:${advisorId}`).subscribe(async (resultData: any) => {
        this.phoneData = await resultData.data;
      })
      this.http.get(this.api + `/profileAdv/advisor_email/:${advisorId}`).subscribe(async (resultData: any) => {
        this.emailData = await resultData.data;
      })
    });
  }

  getstudentmember(idproject: any) {
    this.http.get(this.api + `/profile/studentProject/:${idproject}`).subscribe((resultData: any) => {
      this.studentmember = resultData.data;
    });
    return this.studentmember;
  }

  getProject(advisorId: any, page: number, pageSize: number) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    this.http.get(this.api + `/profileAdv/project_advisor/:${advisorId}`).subscribe(async (readvisorData: any) => {
      const allProjectData = await readvisorData.data;
      this.totalItems = allProjectData.length; // จำนวนรายการทั้งหมด
      this.projectData = await allProjectData.slice(startIndex, endIndex);
      this.totalPages = Math.ceil(this.totalItems / this.pageSize); // คำนวณหน้าทั้งหมด
    });
  }

  inviteadvisorData: any[] = [];
  getInvited(advisorId: any) {
    this.http.get(this.api + `/profileAdv/inviteadvisor/:${advisorId}`).subscribe(async (res: any) => {
      this.inviteadvisorData = await res.data;
    });
  }
  
  getPreviousPageData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const previousPageData = this.StudentArray.slice(startIndex, endIndex);
    console.log('Previous page data:', previousPageData);
  }

  getDisplayedStudents() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    let displayedStudents: any[];
    const baseArray =
      this.filteredStudentArray.length > 0
        ? this.filteredStudentArray
        : this.StudentArray;

    // Filter by category if a category is selected
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      displayedStudents = baseArray.filter(project => project.category === this.selectedCategory);
    } else {
      // If "All" is selected, show all projects
      displayedStudents = baseArray;
    }
    displayedStudents = displayedStudents.slice(startIndex, endIndex);

    return displayedStudents;
  }

  // _____________________________________________________________________________________________________________________________
  scrollToTop() {
    const element = document.body;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  totalItems = 0;
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getProject(this.idbyemail, this.currentPage, this.pageSize);
      this.scrollToTop();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getProject(this.idbyemail, this.currentPage, this.pageSize);
      this.scrollToTop();
    }
  }
  
  goToMyProject() {
    this.show1 = true;
    this.show2 = false;
    this.show3 = false;
  }
  
  goToInviteProject() {
    this.show1 = false;
    this.show2 = true;
    this.show3 = false;
  }

  goToDashboard() {
    this.show1 = false;
    this.show2 = false;
    this.show3 = true;
  }

  add(idbyemail: any) {
    this.router.navigate(['/addprojectbyad/:'+ idbyemail]);
    this.scrollToTop();
  }

  UpdateProfile() {
    this.getAdvisor(this.advisorId)
    this.router.navigate(['/update-profilebyad/:' + this.idbyemail]);
    this.scrollToTop();
    console.log(this.idbyemail)
  }
  idprojecteditproject: any;
  EditProject(idproject: any) {
    this.idprojecteditproject = idproject;
    console.log(this.idbyemail,idproject)
    this.router.navigate(['editprojectbyad/:' + this.idbyemail + "/:" + idproject]);
    this.scrollToTop();
  }
  JoinInvite(idproject: any) {
    this.idprojecteditproject = idproject;
    this.router.navigate(['invitebyad/:' + this.idbyemail + "/:" + idproject]);
    this.scrollToTop();
  }
  // test
  setUpdate(data: any) {
    this.en_title = data.en_title;
    this.th_title = data.th_title;
    this.url = data.url;
    this.category = data.category;
    this.year = data.year;

    this.currentProjectID = data.idProject;
    this.router.navigate(['test/:' + this.currentProjectID]);
    this.scrollToTop();
  }
  UpdateRecords(data: any) {
    let bodyData =
    {
      "en_title": this.en_title,
      "th_title": this.th_title,
      "url": this.url,
      "category": this.category,
      "year": this.year,
    };

    this.http.put(this.api + "/api/project/update" + "/" + this.currentProjectID, bodyData).subscribe((resultData: any) => {
      console.log(resultData);
      alert("project Registered Updateddd")
      this.getProject(this.idbyemail, this.currentPage, this.pageSize);
      this.router.navigate(['editproject/:' + this.currentProjectID]);
      this.scrollToTop();
    });
  }
  // 
  Unjoin(idProject: any) {
    var cancle = confirm("Remove Invited")
    if (cancle) {
      this.http.delete(this.api + "/profile/invitestudent/delete/:" + this.idbyemail + '/:' + idProject).subscribe((Data: any) => {
      });
      location.reload()
      this.scrollToTop();
    }
  }

  LeaveProject(idproject: any) {

    var confirmdelete = confirm("you leave from Project?")
    // console.log(confirmdelete)
    if (confirmdelete) {
      this.http.delete(this.api + `/profileAdv/leave/:${this.idbyemail}/:${idproject}`).subscribe((Data: any) => {
        // this.isResultLoaded = true;
        console.log(Data)
        location.reload()
        this.scrollToTop();
      });
    }
  }
  pie: any;
  async pieChart(pielabel: any, pieseries: any, titles: string) {
    this.pie = await{
      series: pieseries,
      chart: {
        width: 550,
        type: "pie",
      },
      title: { text: "TOP 5 Keywords of "+titles, align: "left" },
      labels: pielabel,
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + " Project"
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  label:any []=[];
  series:any[]=[];
  async dashboardAd(): Promise<any>{
    await this.http.get(this.api+"/profileAdv/chartadvisor/:"+await this.idbyemail).subscribe(async(res:any)=>{
      for(let i of res.data){
        await this.label.push(i.keyword);
        await this.series.push(i.freq)
      }
      await this.pieChart(this.label, this.series, this.advisorData[1].ad_en_first_name)
    })
  }



  
}

