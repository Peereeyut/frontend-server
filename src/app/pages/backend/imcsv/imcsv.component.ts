import { Component, ElementRef } from '@angular/core';
import { read, utils, writeFile } from 'xlsx'; 
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-imcsv',
  templateUrl: './imcsv.component.html',
  styleUrls: ['./imcsv.component.css']
})
export class ImcsvComponent {
  constructor(private http:HttpClient){}
  displayedColumns: string[] = ['id', 'firstname', 'lastname', 'email', 'tel'];
  dataSource:any;
  users:any[]=[]
  files:any;
  api = "https://backend-project-neon.vercel.app"
  csvImport($event:any){
    const files= $event.target.files;
    if(files.length){
      const file=files[0];
      const reader = new FileReader();
      reader.onload = (event:any)=>{
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if(sheets.length){
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
          this.users = rows;
          console.log(this.users)
          this.dataSource=rows
        }
      };
      reader.readAsArrayBuffer(file);

    }
  }
  cancel(){
    this.files.nativeElement.value=''
    this.users 
  }
  upload(){
    for(let i of this.dataSource){
      this.student_post(i)
    }
  }
  student_post(data:any){
    let studentData = {
      "idstudent": data.id,
      "en_first_name": data.firstname,
      "en_last_name": data.lastname,
      "th_first_name": "",
      "th_last_name": "",
      "email":data.email,
      "tel":data.tel 
    };
    this.http.post(this.api + "/register/student/add", studentData).subscribe(async(Data: any) => {
      if(Data.status){
        let returnid = await Data.insertId
        await this.user_student(studentData,returnid)
        await this.student_email(studentData.email, returnid);
        await this.student_phone(studentData.tel, returnid)
      }
    })
  }
  student_email(email:any, id:any){
    let emailData = {
      "student_idstudent": id,
      "email": email,
    };
    this.http.post(this.api + "/register/student_email/add", emailData).subscribe((Data: any) => {
    })
    
  }
  student_phone(tel:any, id:any){
    let phoneData = {
      "student_idstudent": id,
      "phone": tel,
    };
    this.http.post(this.api + "/register/student_phone/add", phoneData).subscribe((Data: any) => {
    })
  }
  user_student(data:any, id:any){
    let userData = {
      "iduser": id,
      "name": data.firstname,
      "email": data.email,
      "role_idrole": "2",
    };
    this.http.post(this.api + "/register/user/add", userData).subscribe((Data: any) => {
    })
  }
  user_advisor(){

  }
  
}  
