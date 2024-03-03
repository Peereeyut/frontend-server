import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare var handleSignout: any;

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-project-ad',
  templateUrl: './project-ad.component.html',
  styleUrls: ['./project-ad.component.css']
})
export class ProjectAdComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      // this.getStudent(this.studentId);
    });
  }
  userProfile: any;
  api = "https://real-sweatsuit-toad.cyclic.app"
  show1: boolean = true;
  show2: boolean = false;

  selectedCategory: string = 'All';
  advisorId: string = '';

  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  AdvisorArray: any[] = [];
  isResultLoaded = false;
  currentIndex = -1;
  currentAdvisorID = "";
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
  filteredAdvisorArray: any[] = [];
  isSearchClicked = false;
  searchResultKeyword: string = '';
  idad: any;
  advisorData: any[] = [];
  phoneData: any[] = [];
  emailData: any[] = [];
  projectData: any[] = [];
  projectadvisorData: any[] = [];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const advisorId = params['idadvisor'];
      this.idad = advisorId;
      const projectId = params['idProject'];
      // console.log(advisorId)
      this.getAdvisor(advisorId);
      this.getProject(advisorId);
      this.getKeywords(advisorId);
      this.getAdvisorById(projectId);
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

  getAdvisor(advisorId: string) {
    this.http.get(this.api + `/projectAdv/advisor/:${advisorId}`).subscribe((resultData: any) => {
      // this.isResultLoaded = true;
      // this.advisorData = Object.entries(advisorData)[0];
      this.advisorData = resultData.data;
      this.http.get(this.api + `/projectAdv/advisor_phone/:${advisorId}`).subscribe(async (resultData: any) => {
        this.phoneData = await resultData.data;
        // console.log(resultData.data)
      })
      this.http.get(this.api + `/projectAdv/advisor_email/:${advisorId}`).subscribe(async (resultData: any) => {
        this.emailData = await resultData.data;
        // console.log(resultData.data)
      })
    });
  }

  getProject(advisorId: string) {
    this.http.get(this.api + `/projectAdv/project_advisor/:${advisorId}`).subscribe((advisorData: any) => {
      // this.isResultLoaded = true;
      this.projectData = advisorData.data;
    });
  }
  // ____________________________________ keyword(10) _______________________________
  keywordsData: any;
  countall:any;
  getKeywords(advisorId: string) {
    this.http.get(this.api + `/projectAdv/keywords/:${advisorId}`).subscribe(async(keywordData: any) => {
      // this.isResultLoaded = true;
      this.keywordsData = keywordData.data;
      var count = 0;
      for(let i of keywordData.data){
        // console.log(i.count)
        count += await i.count;
      }
      this.countall = await count;
      // console.log(await count)
    });
  }
  getAdvisorById(projectId: string) {
    this.http.get(this.api + `/rmProject/student/:${projectId}`).subscribe((resultData: any) => {
      this.projectadvisorData = resultData.data;
      return this.projectadvisorData;
    });
  }


  getDisplayedAdvisors() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    let displayedAdvisors: any[];

    // Use filteredStudentArray if search results are available, otherwise use StudentArray
    const baseArray =
      this.filteredAdvisorArray.length > 0
        ? this.filteredAdvisorArray
        : this.AdvisorArray;

    // Filter by category if a category is selected
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      displayedAdvisors = baseArray.filter(project => project.category === this.selectedCategory);
    } else {
      // If "All" is selected, show all projects
      displayedAdvisors = baseArray;
    }

    // Slice the array based on pagination
    displayedAdvisors = displayedAdvisors.slice(startIndex, endIndex);

    return displayedAdvisors;
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
    const previousPageData = this.AdvisorArray.slice(startIndex, endIndex);
    console.log('Previous page data:', previousPageData);
  }

}
