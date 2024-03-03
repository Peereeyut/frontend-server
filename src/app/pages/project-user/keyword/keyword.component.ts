import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare var handleSignout: any;

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-keyword',
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.css']
})
export class KeywordComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      // this.getStudent(this.studentId);
    });
  }
  userProfile: any;

  show1: boolean = true;
  show2: boolean = false;

  selectedCategory: string = 'All';
  studentId: string = '';
  idst: any;
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  StudentArray: any[] = [];
  isResultLoaded = false;
  currentIndex = -1;
  currentStudentID = "";
  currentPage = 1; // หน้าปัจจุบัน
  pageSize = 5;   // จำนวนรายการต่อหน้า
  totalPages = 0;
  projectId: string = '';

  titleENG: string = "";
  titleTH: string = "";

  category: string | undefined;
  year: string = "";
  keywords: string = "";

  searchQuery: string = '';
  searchResults: any[] = [];
  filteredStudentArray: any[] = [];
  isSearchClicked = false;
  searchResultKeyword: string = '';

  studentData: any[] = [];
  phoneData: any[] = [];
  emailData: any[] = [];
  projectData: any[] = [];
  projectstudentData: any[] = [];
  api = "https://real-sweatsuit-toad.cyclic.app"
// keyword/:idstudent/:keyword
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const studentId = params['idstudent'];
      this.idst = studentId;
      const keyword = params['keyword'];
      // console.log(studentId)
      this.getStudent(studentId);
      this.getProject(studentId,keyword);
      this.getKeywords(studentId);
      // this.getStudentById();
    });
  }

  goToMyInfo() {
    this.show1 = true;
    this.show2 = false;
  }

  goToMyProject() {
    this.show1 = false;
    this.show2 = true;
  }

  handleSignOut() {

    handleSignout();
    sessionStorage.removeItem("loggedInUser");
    this.router.navigate(["/"]).then(() => {
      window.location.reload();
    });
  }

  getStudent(studentId: string) {
    this.http.get(this.api + `/STprofile/:${studentId}`).subscribe((resultData: any) => {
      // this.isResultLoaded = true;
      // this.studentData = Object.entries(studentData)[0];
      this.studentData = resultData.data;
      this.http.get(this.api + `/profile/phone/:${studentId}`).subscribe(async (resultData: any) => {
        this.phoneData = await resultData.data;
        // console.log(resultData.data)
      })
      this.http.get(this.api + `/profile/email/:${studentId}`).subscribe(async (resultData: any) => {
        this.emailData = await resultData.data;
        // console.log(resultData.data)
      })
    });
  }

  getProject(studentId: string, keyword: string) {
    this.http.get(this.api + `/STprofile/project/:${studentId}/:${keyword}`).subscribe((studentData: any) => {
      // this.isResultLoaded = true;
      this.projectData = studentData.data;
    });
  }
  // ____________________________________ keyword(10) _______________________________
  keywordsData: any;
  getKeywords(studentId: string) {
    this.http.get(this.api + `/STprofile/keywords/:${studentId}`).subscribe((keywordData: any) => {
      // this.isResultLoaded = true;
      this.keywordsData = keywordData.data;
      console.log(this.keywordsData)
    });
  }

  filterProjectsByKeyword(keyword: string) {
    if (keyword.trim() === '') return; // Return if the keyword is empty or whitespace only
    this.filteredStudentArray = this.projectData.filter((project: any) => {
      return project.keywords.includes(keyword);
    });
  }  

  getStudentById(projectId: string) {
    this.http.get(this.api + `/rmProject/student/:${projectId}`).subscribe((resultData: any) => {
      this.projectstudentData = resultData.data;
      return this.projectstudentData;
    });
  }


  getDisplayedStudents() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    let displayedStudents: any[];

    // Use filteredStudentArray if search results are available, otherwise use StudentArray
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

    // Slice the array based on pagination
    displayedStudents = displayedStudents.slice(startIndex, endIndex);

    return displayedStudents;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getPreviousPageData();
      this.scrollToTop();
    }
  }

  scrollToTop() {
    const element = document.body;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  getPreviousPageData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const previousPageData = this.StudentArray.slice(startIndex, endIndex);
    console.log('Previous page data:', previousPageData);
  }

}
