import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare var handleSignout: any;

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      // this.getStudent(this.studentId);
    });
  }
  userProfile: any;

  sortByTitleClicked: boolean = false;
  sortByDateClicked: boolean = false;

  show1: boolean = true;
  show2: boolean = false;
  show3: boolean = false;

  studentId: string = '';
  selectedCategory: string = 'All';

  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  StudentArray: any[] = [];
  isResultLoaded = false;
  currentIndex = -1;
  currentStudentID = "";
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
  studentData: any[] = [];
  projectData: any[] = [];
  studentmember: any = [];
  api = "https://real-sweatsuit-toad.cyclic.app"
  async ngOnInit() {
    this.userProfile = await JSON.parse(sessionStorage.getItem("loggedInUser") || "");
    await this.getIdByEmail(this.userProfile.email);
    await this.getStudent(this.studentId);
    this.currentPage = 1; // กำหนดหน้าปัจจุบันเป็นหน้าที่ 1 เมื่อโหลด component
    this.pageSize = 5; // กำหนดจำนวนโปรเจ็คต่อหน้า
    // เรียกฟังก์ชันเพื่อดึงข้อมูลโปรเจ็คตามหน้าแรก
    await this.getDisplayedStudents();
    await this.getProject(await this.studentId, this.currentPage, this.pageSize);
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

  handleSignOut() {

    handleSignout();
    sessionStorage.removeItem("loggedInUser");
    this.router.navigate(["/"]).then(() => {
      window.location.reload();
    });
  }

  idbyemail: any;
  getIdByEmail(email: string) {
    this.http.get(this.api + `/api/user/:${email}`).subscribe(async (resultData: any) => {
      this.idbyemail = await resultData.data[0].iduser;
      this.getStudent(this.idbyemail)
      this.getInvited(this.idbyemail)
      this.getProject(this.idbyemail, this.currentPage, this.pageSize)
    });
  }
  // getProject(studentId: any) {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.http.get(this.api + `/STprofile/project/:${studentId}`).subscribe(async (restudentData: any) => {
  //     const allProjectData = await restudentData.data;
  //     this.projectData = allProjectData.slice(startIndex, endIndex);
  //     this.totalPages = Math.ceil(allProjectData.length / this.pageSize);
  //   });
  // }
  getProject(studentId: any, page: number, pageSize: number) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    this.http.get(this.api + `/profile/project/:${studentId}`).subscribe(async (restudentData: any) => {
      var allProjectData = await restudentData.data;
      // console.log(studentId, allProjectData);
      this.totalItems = allProjectData.length; // จำนวนรายการทั้งหมด
      this.projectData = await allProjectData.slice(startIndex, endIndex);
      this.totalPages = Math.ceil(this.totalItems / this.pageSize); // คำนวณหน้าทั้งหมด
    });
  }

  invitestudentData: any[] = [];
  getInvited(studentId: any) {

    this.http.get(this.api + `/profile/invitestudent/:${studentId}`).subscribe(async (res: any) => {
      this.invitestudentData = await res.data;
      // console.log(this.invitestudentData)
      // console.log(studentData)
      // console.log('sasa')
    });
  }

  phoneData: any[] = [];
  emailData: any[] = [];
  getStudent(studentId: any) {
    this.http.get(this.api + `/profile/student/:${studentId}`).subscribe(async (studentData: any) => {
      // this.studentData = await studentData.data[0];  
      this.studentData = await Object.entries(studentData.data)[0];
      console.log(studentData.data[0])
      this.http.get(this.api + `/profile/phone/:${studentId}`).subscribe(async (resultData: any) => {
        this.phoneData = await resultData.data;
      })
      this.http.get(this.api + `/profile/email/:${studentId}`).subscribe(async (resultData: any) => {
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

  scrollToTop() {
    const element = document.body;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  totalItems = 0;

  // getProjectPage(studentId: any, page: number, pageSize: number) {
  //   const startIndex = (page - 1) * pageSize;
  //   const endIndex = startIndex + pageSize;
  //   this.http.get(this.api + `/STprofile/project/:${studentId}`).subscribe(async (restudentData: any) => {
  //     const allProjectData = await restudentData.data;
  //     this.totalItems = allProjectData.length; // จำนวนรายการทั้งหมด
  //     this.projectData = await allProjectData.slice(startIndex, endIndex);
  //     this.totalPages = Math.ceil(this.totalItems / this.pageSize); // คำนวณหน้าทั้งหมด
  //   });
  // }


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

  getPreviousPageData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const previousPageData = this.StudentArray.slice(startIndex, endIndex);
    // console.log('Previous page data:', previousPageData);
  }

  // getDisplayedStudents() {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;

  //   let displayedStudents: any[];
  //   const baseArray =
  //     this.filteredStudentArray.length > 0
  //       ? this.filteredStudentArray
  //       : this.StudentArray;

  //   // Filter by category if a category is selected
  //   if (this.selectedCategory && this.selectedCategory !== 'All') {
  //     displayedStudents = baseArray.filter(project => project.category === this.selectedCategory);
  //   } else {
  //     // If "All" is selected, show all projects
  //     displayedStudents = baseArray;
  //   }
  //   displayedStudents = displayedStudents.slice(startIndex, endIndex);

  //   return displayedStudents;
  // }

  add(idbyemail: any) {

    this.router.navigate(['/addproject/:' + idbyemail]);
    this.scrollToTop();
  }

  UpdateProfile() {
    this.getStudent(this.studentId)
    this.router.navigate(['/update-profile/:' + this.idbyemail]);
    this.scrollToTop();
    console.log(this.idbyemail)
  }
  idprojecteditproject: any;
  EditProject(idproject: any) {
    this.idprojecteditproject = idproject;
    this.router.navigate(['editproject/:' + this.idbyemail + "/:" + idproject]);
    this.scrollToTop();
  }
  JoinInvite(idproject: any) {
    this.idprojecteditproject = idproject;
    this.router.navigate(['invite/:' + this.idbyemail + "/:" + idproject]);
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
      this.http.delete(this.api + `/project/leave/:${this.idbyemail}/:${idproject}`).subscribe((Data: any) => {
        // this.isResultLoaded = true;
        console.log(Data)
        // location.reload()
        this.scrollToTop();
      });
    }
  }

  sortByTitle(): void {
    if (!this.sortByTitleClicked) {
      // Sort projects by title
      this.projectData.sort((a, b) => {
        const titleA = a.en_title.toLowerCase();
        const titleB = b.en_title.toLowerCase();
        const numRegEx = /^\d+/; // Regular expression to match numbers at the beginning of the string
  
        // Extract numbers from the beginning of the titles
        const numA = parseInt(titleA.match(numRegEx)?.[0]) || 0;
        const numB = parseInt(titleB.match(numRegEx)?.[0]) || 0;
  
        // Compare numbers first, then the rest of the string
        if (numA !== numB) {
          return numA - numB; // Sort numbers in ascending order
        } else {
          // If numbers are the same, compare the remaining characters
          const restA = titleA.replace(numRegEx, '');
          const restB = titleB.replace(numRegEx, '');
          return restA.localeCompare(restB);
        }
      });
  
      // Reset sortByDateClicked to false before setting sortByTitleClicked to true
      this.sortByDateClicked = false;
      this.sortByTitleClicked = true;
  
      // No need to recalculate current page data again
    }
  }
  
  sortByDate(): void {
    if (!this.sortByDateClicked) {
      // Sort projects by date
      this.projectData.sort((a, b) => {
        const dateA = new Date(a.year);
        const dateB = new Date(b.year);
        return dateA.getTime() - dateB.getTime();
      });
  
      // Reset sortByTitleClicked to false before setting sortByDateClicked to true
      this.sortByTitleClicked = false;
      this.sortByDateClicked = true;
  
      // No need to recalculate current page data again
    }
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
  
}
