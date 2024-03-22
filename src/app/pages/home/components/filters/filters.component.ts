import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  @Output() categorySelected = new EventEmitter<string>();


 
  constructor(private router: Router, private http:HttpClient) {}

  api = "https://backend-project-neon.vercel.app";
  listcategory:string[]=[]
  async ngOnInit(): Promise<void> {
    await this.funcgetmajor();
  
    
  }

  onCategorySelected(category: string): void {
    this.categorySelected.emit(category);
    this.scrollToTop();
  }

  scrollToTop() {
    const element = document.body;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  async funcgetmajor(){
    this.http.get(this.api+"/backend/major").subscribe(async(res:any)=>{
      for(let item of res.data){
        var name =await item.major_name
        await this.listcategory.push(name)
      }
      await this.listcategory.sort()
    })
  }
}
