import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class GuardService {
    constructor(private http: HttpClient) { }
    apiurl = "https://real-sweatsuit-toad.cyclic.app/guard";
    async islogin() {
        if (await sessionStorage.getItem("eamil") != null) {
            return await true
        }
        else {
            return await false
        }
    }
    role: any;
    access: any;
    async getrolebyemail(email: string) {
        try {
            const res: any = await this.http.get(this.apiurl + "/roleuser/:" + email).toPromise();
            this.role =await res.roleName;
            const ress: any = await this.http.get(this.apiurl + "/accessrole/:" + res.roleName).toPromise();
            this.access = ress.access[0];
            // console.log(this.role)
            return await res.roleName;
        } catch (error) {
            console.error("Error fetching role:", error);
            throw error; // Handle the error appropriately
        }

    }
    canAccess: any;
    async accessrole(role: any, column: any) {
        // console.log("acccessrole", this.access)
        if (this.access[column] == 1) {
            this.canAccess = await Promise.resolve(1);
        } else {
            this.canAccess = await Promise.resolve(0);
        }
    }


    //when edit profile
    match: any;
    async emailmatchid(email: any, idUser: any) {
        try {
            const res: any = await this.http.get(`${this.apiurl}/emailmatchid/:${email}`).toPromise();
            // console.log(res,email, idUser)

            if (res.match == idUser) {
                this.match = true;
            } else {
                this.match = false;
            }

        } catch (error) {
            console.error("Error fetching role:", error);
            throw error; // Handle the error appropriately
        }
    }


    idmyproject: any;
    async myproject(email: any, idProject: any) {
        try {
            const res: any = await this.http.get(`${this.apiurl}/myproject/:${email}`).toPromise();
            for (let i of res.setresult) {
                if (i == idProject) {
                    this.idmyproject = true;
                    // console.log(i)
                    return this.idmyproject
                }
                else {
                    this.idmyproject = false
                }
            }

        } catch (error) {
            console.error("Error fetching role:", error);
            throw error; // Handle the error appropriately
        }
    }


}