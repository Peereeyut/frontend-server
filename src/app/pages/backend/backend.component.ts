import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdatepopupComponent } from './updatepopup/updatepopup.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-backendr',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.css']
})
export class BackendComponent implements AfterViewInit {

  constructor( private service: AuthService, private dialog: MatDialog, private router: Router, private http:HttpClient, private toastr:ToastrService) {
    this.LoadUser();
  }
  
  userlist: any;
  dataSource: any;
  sessionid: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  api = "https://backend-project-neon.vercel.app";
  varcategory:string=""
  listcategory:any[]=[];
  userProfile:any
  ngAfterViewInit():void {
    this.userProfile = JSON.parse(sessionStorage.getItem("loggedInUser") || "");
    this.sessionid = sessionStorage.getItem("id")?.toString();
    this.funcgetmajor();
    // this.listcategory.sort()

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

  async funcclearcategory(){
    this.listcategory_insert=[]
  }

  async funcgetmajor(){
    this.http.get(this.api+"/backend/major").subscribe(async(res:any)=>{
      for(let item of res.data){
        var name = item.major_name
        this.listcategory.push(name)
      }
    })
  }
  
  async funcSubmit(){
    var time = Date().toString()
    var date = await this.formatDate(time)
    for(let i of this.listcategory_insert){

      
      var body={
        "major_name":i,
        "editedby":this.userProfile.email,
        "editedby_time": date
      }
      console.log(body)
      this.http.post(this.api+'/backend/major/add',body).subscribe((res:any)=>{
        console.log(res)
        if(res.status){
          this.toastr.success("add major Complete")
        }
      })
    }
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
