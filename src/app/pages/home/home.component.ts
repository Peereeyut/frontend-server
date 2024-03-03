import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: './hometest.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() fullWidthMode = false;

  sortByTitleClicked: boolean = false;
  sortByDateClicked: boolean = false;
  selectedCategory: string = 'All';

  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  StudentArray: any[] = [];
  isResultLoaded = false;
  currentIndex = -1;
  currentStudentID = "";
  currentPage = 1; // หน้าปัจจุบัน
  pageSize = 5;   // จำนวนรายการต่อหน้า
  totalPages = 0;  // จำนวนหน้าทั้งหมด

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

  idadvisor: string = "";
  ad_en_first_name: string = "";
  ad_en_last_name: string = "";
  ad_th_first_name: string = "";
  ad_th_last_name: string = "";

  en_abstract: string = "";
  th_abstract: string = "";

  keyword: string = "";

  searchQuery: string = '';
  searchResults: any[] = [];
  filteredStudentArray: any[] = [];
  isSearchClicked = false;
  searchResultKeyword: string = '';
  noSearchResultsFound: boolean = false;

  api = "https://real-sweatsuit-toad.cyclic.app"
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    // this.route.queryParams.subscribe(params => {
    //   this.getAllProject();
    // });
  }

  onSubmit(): void {
    this.isSearchClicked = true;
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      // ตรวจสอบว่ามีการค้นหาหรือไม่
      this.filteredStudentArray = this.forgetstudent.filter((project: any) => {


        return (
          (project[0].en_title && project[0].en_title.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (project[0].th_title && project[0].th_title.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (project[0].year && project[0].year.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (project[0].url && project[0].url.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (project[0].category && project[0].category.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (project[1]?.[0]?.en_first_name && project[1][0].en_first_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (project[1]?.[1]?.en_first_name && project[1][1].en_first_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (project[1]?.[2]?.en_first_name && project[1][2].en_first_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (project[1]?.[3]?.en_first_name && project[1][3].en_first_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (project[1]?.[4]?.en_first_name && project[1][4].en_first_name.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (String(project[1]?.[0]?.idstudent).includes(this.searchQuery.toLowerCase())) ||
          (String(project[1]?.[1]?.idstudent).includes(this.searchQuery.toLowerCase())) ||
          (String(project[1]?.[2]?.idstudent).includes(this.searchQuery.toLowerCase())) ||
          (String(project[1]?.[3]?.idstudent).includes(this.searchQuery.toLowerCase())) ||
          (String(project[1]?.[4]?.idstudent).includes(this.searchQuery.toLowerCase()))
        );

      });

      // คำนวณหน้าและแสดงผลลัพธ์
      this.totalPages = Math.ceil(this.filteredStudentArray.length / this.pageSize);
      this.currentPage = 1;
      this.searchResultKeyword = this.searchQuery;
      this.getDisplayedStudents();

      // ตรวจสอบว่ามีผลลัพธ์การค้นหาหรือไม่
      this.noSearchResultsFound = this.filteredStudentArray.length === 0;
    } else {
      this.searchResults = [];
      this.searchResultKeyword = '';
    }

    // เรียกใช้งานฟังก์ชัน highlightSearchText() เมื่อมีการค้นหา
    this.highlightSearchText();
  }

  cancelSearch(): void {
    this.searchResults = [];
    this.searchResultKeyword = '';
    this.searchQuery = '';
    this.isSearchClicked = false;

    const navigationExtras: NavigationExtras = {
      queryParams: { 'refresh': new Date().getTime() },
      skipLocationChange: true
    };
    this.router.navigate(['/home'], navigationExtras);
    this.currentPage = 1;
    this.getDisplayedStudents();
  }

  getWidthOfSearchResults(): number {
    const keywordLength = this.searchResultKeyword.length;
    const estimatedWidthPerCharacter = 10; // ปรับตามขนาดตัวอักษรและระยะห่าง
    const minWidth = 100; // ความกว้างขั้นต่ำ

    return Math.max(minWidth, keywordLength * estimatedWidthPerCharacter);
  }


  async ngOnInit(): Promise<void> {
    await this.getAllProject();
    // this.getStudentforeachProject(idProject)
    // this.getStudent();
    await this.getDisplayedStudents();
    this.route.queryParams.subscribe(params => {
      if (params['refresh']) {
        // Refresh logic or function call goes here
      }
    });
  }

  onShowCategory(newCategory: string): void {
    this.selectedCategory = newCategory;
    this.getDisplayedStudents();
  }

  forgetstudent: any[] = [];
  async getAllProject() {
    this.http.get(this.api + "/api/project/").subscribe(async (resultData: any) => {
      this.isResultLoaded = true;
      this.StudentArray = await resultData.data;

      //for get student
      for (let i of resultData.data) {
        this.http.get(this.api + "/api/studentproject/:" + i.idProject).subscribe(async (res: any) => {
          // console.log(res.data)
          var setarray = await [i, res.data]
          this.forgetstudent.push(await setarray)
          // await console.log(await this.forgetstudent)
        })
      }
      this.totalPages = Math.ceil(this.StudentArray.length / this.pageSize);
    });
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
    // console.log('Previous page data:', previousPageData);
  }

  // getDisplayedStudents() {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;

  //   let displayedStudents: any[];
  //   const baseArray =
  //     this.filteredStudentArray.length > 0
  //       ? this.filteredStudentArray
  //       : this.forgetstudent;

  //   // Filter by category if a category is selected
  //   if (this.selectedCategory && this.selectedCategory !== 'All') {
  //     displayedStudents = baseArray.filter(project => project[0].category === this.selectedCategory);
  //   } else {
  //     // If "All" is selected, show all projects
  //     displayedStudents = baseArray;
  //   }
  //   displayedStudents = displayedStudents.slice(startIndex, endIndex);

  //   return displayedStudents;
  // }

  highlightSearchText(text?: any): any {
    if (!text) {
      // If no text is provided, return an empty string or null
      return '';
    }
    const query = this.searchQuery.toString(); // Convert searchQuery to string
    if (typeof text !== 'string') {
      // Convert non-string values to strings
      text = text.toString();
    }
    return text.replace(new RegExp(query, 'gi'), (match: string) => { // Specify the type of 'match'
      return '<mark>' + match + '</mark>';
    }) + ' ';
  }




  onSearchInputChange() {
    // เรียกใช้งาน highlightSearchText() เมื่อมีการเปลี่ยนแปลงในการค้นหา
    this.highlightSearchText();

    if (this.searchQuery.trim() !== '') {
      // นี่คือส่วนที่คุณต้องทำการค้นหาข้อมูลของคุณ (เช่นจาก API) และกำหนดค่าให้กับ this.searchResults
      // ตัวอย่าง: ค้นหาจากรายการ Students
      // console.log(this.searchQuery)
      this.searchResults = this.forgetstudent.filter(([project, students]) => {
        return project.en_title.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    } else {
      this.searchResults = [];
    }
  }

  sortByTitle(): void {
    if (!this.sortByTitleClicked) {
        // Sort projects by title
        this.filteredStudentArray.sort((a, b) => {
            const titleA = a[0].en_title.toLowerCase();
            const titleB = b[0].en_title.toLowerCase();
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
        // Re-calculate current page data if needed
        this.currentPage = 1;
        this.sortByTitleClicked = true;
        this.sortByDateClicked = false; // Reset sortByDateClicked
    }
}


  sortByDate(): void {
    if (!this.sortByDateClicked) {
      // Sort projects by date
      this.filteredStudentArray.sort((a, b) => {
        const dateA = new Date(a[0].year);
        const dateB = new Date(b[0].year);
        return dateA.getTime() - dateB.getTime();
      });
      // Re-calculate current page data if needed
      this.currentPage = 1;
      this.sortByDateClicked = true;
      this.sortByTitleClicked = false; // Reset sortByTitleClicked
    }
  }
  getDisplayedStudents() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    let displayedStudents: any[];
    const baseArray =
      this.filteredStudentArray.length > 0
        ? this.filteredStudentArray
        : this.forgetstudent;

    if (this.selectedCategory && this.selectedCategory !== 'All') {
      displayedStudents = baseArray.filter(project => project[0].category === this.selectedCategory);
    } else {
      // If "All" is selected, show all projects
      displayedStudents = baseArray;
    }

    if (this.sortByTitleClicked) {
      displayedStudents.sort((a, b) => {
        const titleA = a[0].en_title.toLowerCase();
        const titleB = b[0].en_title.toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
      });
    }

    // Sort projects by date if sortByDateClicked is true
    if (this.sortByDateClicked) {
      displayedStudents.sort((a, b) => {
        const dateA = new Date(a[0].year);
        const dateB = new Date(b[0].year);
        return dateA.getTime() - dateB.getTime();
      });
    }

    // Slice the array to display only the current page
    displayedStudents = displayedStudents.slice(startIndex, endIndex);

    return displayedStudents;
  }
}
