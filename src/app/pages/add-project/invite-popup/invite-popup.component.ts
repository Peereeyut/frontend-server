import { Component, EventEmitter, Inject, Injectable, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
// import { AddProjectComponent } from '../add-project.component';
@Component({
  selector: 'app-invite-popup',
  templateUrl: './invite-popup.component.html',
  styleUrls: ['./invite-popup.component.css']
})
// @Injectable({
//   providedIn: 'root'
// })
export class InvitePopupComponent implements OnInit {

  constructor(private http: HttpClient, private builder: FormBuilder, private service: AuthService, private toastr: ToastrService,
    private dialogref: MatDialogRef<InvitePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataadvisor = data.name;
    console.log(this.dataadvisor)
  }
  api="https://real-sweatsuit-toad.cyclic.app";
  async ngOnInit(): Promise<void> {
    await this.getinformation(this.dataadvisor)
  }

  dataadvisor: any;
  editdata: any;
  state:boolean=false;
  resgetinformation:any;
  async getinformation(data:any){
    this.http.get(this.api+"/adProject/getforadvisor/:"+data).subscribe(async(res:any)=>{
      if(res.data.length>=1){
        // console.log(res.data)
        this.resgetinformation=res.data;
        this.state=true;
      }
      else{
        this.resgetinformation=["Not found Advisor"];
      }
    })
  }

  inviteStudent() {
    //invite table use this function
  }
  idadinvite: string = '';
  object:any;
  arrayidinviteadvisor: any[] = [];

  
  
}
