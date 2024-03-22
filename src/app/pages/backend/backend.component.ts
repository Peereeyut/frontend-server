import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdatepopupComponent } from './updatepopup/updatepopup.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-backendr',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.css']
})
export class BackendComponent implements AfterViewInit {

  constructor(private builder: FormBuilder, private service: AuthService, private dialog: MatDialog, private router: Router) {
    this.LoadUser();
  }
  userlist: any;
  dataSource: any;
  sessionid: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  varcategory:string=""
  listcategory=['Computer Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Industrial Engineering', 'Materials Engineering', 'Environmental Engineering']
  ngAfterViewInit():void {
    this.sessionid = sessionStorage.getItem("id")?.toString();
    this.listcategory.sort()

  }
  LoadUser() {
    this.service.GetUser().subscribe(res => {
      // console.log(Object.entries(res)[1][1])
      this.userlist = Object.entries(res)[1][1];
      this.dataSource = new MatTableDataSource(this.userlist);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'action'];

  updateuser(code: any) {
    this.OpenDialog('1000ms', '600ms', code);
  }

  OpenDialog(enteranimation: any, exitanimation: any, code: any) {
    const popup = this.dialog.open(UpdatepopupComponent, {
      enterAnimationDuration: enteranimation,
      exitAnimationDuration: exitanimation,
      width: '30%',
      data: {
        iduser: code
      }
    });
    popup.afterClosed().subscribe(res => {
      this.LoadUser();
    });
  }
  listcategory_insert:string[]=[]
  async funccategory(text:string){
    // await alert(text)
    await this.listcategory_insert.push(text)
    this.varcategory=''
    
  }


}
