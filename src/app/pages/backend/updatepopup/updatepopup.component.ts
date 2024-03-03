import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-updatepopup',
  templateUrl: './updatepopup.component.html',
  styleUrls: ['./updatepopup.component.css']
})
export class UpdatepopupComponent implements OnInit {

  constructor(private builder: FormBuilder, private service: AuthService, private toastr: ToastrService,
    private dialogref: MatDialogRef<UpdatepopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) {

    this.service.getuserrole().subscribe(res => {
      this.rolelist = Object.entries(res)[1][1];
    });
  }
  ngOnInit(): void {
    if (true) {
      this.loaduserdata(this.data.iduser);
    }
  }
  rolelist: any;
  editdata: any;
  api = "https://real-sweatsuit-toad.cyclic.app";

  registerform = this.builder.group({
    id: this.builder.control(''),
    name: this.builder.control(''),
    email: this.builder.control(''),
    role_idrole: this.builder.control('', Validators.required),
  });

  loaduserdata(code: any) {
    this.service.GetUserbyid(code).subscribe(res => {
      this.editdata = Object.entries(res)[1][1][0];
      console.log("loaduserdata")
      console.log(this.editdata);

      this.registerform.setValue({
        id: this.editdata.iduser,
        name: this.editdata.name,
        email: this.editdata.email,
        role_idrole: this.editdata.role_idrole,
      });
      console.log(this.registerform.value)
    });
  }

  async UpdateUser() {
    if (this.registerform.value.role_idrole == "3") {
      this.http.get(this.api + "/backend/getstudent/:" + this.registerform.value.id).subscribe(async (resst: any) => {
        //ถ้าดึงข้อมูลจากstudentและpost success จะupdate role  
        if (resst.status) {
          var detailspostadvisor = await {
            "idadvisor": resst.data[0].idstudent,
            "en_first_name": resst.data[0].en_first_name,
            "en_last_name": resst.data[0].en_last_name,
            "th_first_name": resst.data[0].th_first_name,
            "th_last_name": resst.data[0].th_last_name,
          }
          console.log(detailspostadvisor)
          this.http.post(this.api + "/backend/updateteacher", detailspostadvisor).subscribe(async (respost: any) => {
            if (respost.status) {
              //get phone
              this.http.get(this.api + "/backend/getstudentphone/:" + this.registerform.value.id).subscribe(async (res: any) => {
                console.log(res)
                if (res.status) {
                  for (let i of res.data) {
                    var body = await {
                      "phone": i.phone,
                      "idadvisor": respost.id,
                    }
                    await this.http.post(this.api + "/backend/updateteacherphone", body).subscribe((respost: any) => {

                    })
                  }
                }
              })
              //get email
              this.http.get(this.api + "/backend/getstudentemail/:" + this.registerform.value.id).subscribe(async (res: any) => {
                console.log(res)
                if (res.status) {
                  for (let i of res.data) {
                    var body = await {
                      "email": i.email,
                      "idadvisor": respost.id,
                    }
                    await this.http.post(this.api + "/backend/updateteacheremail", body).subscribe((respost: any) => {
                      console.log(respost)
                    })
                  }
                }
              })
              //del phone => del email => del student
             await this.http.delete(this.api + "/backend/deletestudentdetail/:" + detailspostadvisor.idadvisor).subscribe(async (resdel: any) => {
              console.log(resdel)
                if(resdel.status){
                  await this.http.delete(this.api + "/backend/deletestudent/:" + detailspostadvisor.idadvisor).subscribe(async (resdel: any) => {

                  })
                  //update role
                  this.service.updaterole(this.registerform.value.id, this.registerform.value.role_idrole).subscribe(async (res: any) => {
                  });
                  this.dialogref.close();
                  this.toastr.success("Update role complete");
                }
                else{
                  this.dialogref.close();
                  this.toastr.error("Update role Fail");
                }
              });



            }
            else {
              this.dialogref.close();
              this.toastr.error("Can't update role to teacher 1")
            }
          });
        }
        else {
          this.dialogref.close();
          this.toastr.error("Can't update role to teacher 2")
        }

      })
    }
    else {
      this.service.updaterole(this.registerform.value.id, this.registerform.value.role_idrole).subscribe(async (res: any) => {
        this.dialogref.close();
        this.toastr.success("Update role complete");
      })
    }

  }
}