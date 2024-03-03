import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  @Output() categorySelected = new EventEmitter<string>();


 
  constructor(private router: Router) {
   
  }

  ngOnInit(): void {}

  onCategorySelected(category: string): void {
    this.categorySelected.emit(category);
    this.scrollToTop();
  }

  scrollToTop() {
    const element = document.body;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}
