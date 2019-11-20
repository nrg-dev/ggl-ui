import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/index';
import { HttpResponse, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { AlertService, AuthenticationService, UserService } from '../_services/index';
import { IfObservable } from 'rxjs/observable/IfObservable';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    loading1 = false;
    returnUrl: string;
    countryList: any = {};
   // status: any;
    temp:string;
    user:User;
    memberID3:string;

    bankList: any = {};  
    bankTransferList:  any ={};

    selectedFiles: FileList;
    currentFileUpload: File;
    progress: { percentage: number } = { percentage: 0 };
    
    public loginmenu1 = true;
    public loginmenu2 = false;
    public loginmenu3 = false;
    public loginmenu4 = false;
    public paymentdiv = true;
    public debitdiv = false;
    public creditdiv =  false;
    public nextdetails = false;
    public bankdetails2 = false;
    public buttondiv = false;
    public dbsbankdetails = false;
    loginheader="Member Sign In";
    loginadmin="Admin Login";
    errorStatus : any;
    serverissuedialog = 'none';
    errordialog = 'none';
    signupdialog ='none';
    viewMode: any ={};
    errorpasswordCheck = 'none';
    successDialog = 'none';
    failuredialog = 'none';
    networkissue = 'none';
    invalidotpdialog = 'none';
    invaliduserdialog = 'none';
    registersuccessdialog = 'none';
    userExsistdialog = 'none';
    memberIDNotValiddialog = 'none';
    accTypeissue = 'none';
    paymentDialog = "none";
    public paydiv = false;
    public paymentBack = true;
    public creditback = false;
    public finishdiv = true;

    public payUpload = false;
    paymentSuccess = 'none';
    memberIDNonValiddialog = 'none';
    memberID: string;

    location: Location;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService : UserService,
        private alertService: AlertService) {
            this.model.currentusername='';
            this.model.currentpassword='';

         }

    ngOnInit() {
        this.model.currentusername='';
        this.model.currentpassword='';
        this.model.bankName = '';
        this.model.banktransfer = '';

        this.userService.getCountry()
        .subscribe(
            data => {
                this.countryList = data;
            },
            error => {
                this.networkissue = 'block';
            }
        );
        this.userService.getBankName()
        .subscribe(
            data => {
                this.bankList = data;
            },
            error => {
                this.networkissue = 'block';
            }
        );

        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    forgetCancel()
    {
        this.loginmenu1 = true;
        this.loginmenu2 = false;
        this.loginmenu3 = false;
        this.loginmenu4 = false;
        this.model.currentusername='';
        this.model.currentpassword='';
 
    }
    forgetPassword(){
        this.loginmenu1 = false;
        this.loginmenu2 = true;
        this.loginmenu3 = false;
        this.loginmenu4 = false;

        this.model.currentusername='';
        this.model.currentpassword='';
    }

   
    submitPassword(){
       if(this.model.newPassword1 == this.model.newPassword2) {
            this.authenticationService.resetPassword(this.model.newPassword1,localStorage.getItem('forgetUser'))
            .subscribe(
            data => {
                this.user=data;
                if(this.user.status=='success') {
                    this.loginmenu1 = true;
                    this.loginmenu2 = false;
                    this.loginmenu3 = false;
                    this.loginmenu4 = false;
                    this.model.currentusername='';
                    this.model.currentpassword='';
                    this.alertService.success('New Password is updated successfully.');
                }
                if(this.user.status=='failure') {
                    this.invalidotpdialog = 'block';
                }
            },
            error => {
                this.networkissue = 'block';
            });
        }
        else {
            this.errorpasswordCheck = 'block';
        }
    }
   
    OTPCheck(){
        this.authenticationService.OTPCheck(this.model.otp)
        .subscribe(
        data => {
            this.user=data;
            if(this.user.status=='success') {
                this.loginmenu1 = false;
                this.loginmenu2 = false;
                this.loginmenu3 = false;
                this.loginmenu4 = true;
                this.model.newPassword1='';
                this.model.newPassword1='';
            }
            if(this.user.status=='failure') {
                this.invalidotpdialog = 'block';
            }
        },
        error => {
            this.networkissue = 'block';
        });

    }
    checkUserName(){
        localStorage.setItem('forgetUser',this.model.currentusername);
        this.authenticationService.checkUserName(this.model.currentusername)
        .subscribe(
            data => {
                this.user=data;
                if(this.user.status=='success') {
                    this.loginmenu1 = false;
                    this.loginmenu2 = false;
                    this.loginmenu3 = true;
                    this.loginmenu4 = false;
                }
                
                if(this.user.status=='failure') {
                    this.invaliduserdialog = 'block';
                    this.loginmenu1 = false;
                    this.loginmenu2 = true;
                    this.loginmenu3 = false;
                    this.loginmenu4 = false;
                }

            }, 
            error => {
                this.networkissue = 'block';
            });
        this.model.currentusername='';
        this.model.otp='';
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.currentusername, this.model.currentpassword)
        .subscribe(
        data => {
            this.user=data;
            console.log("Status ====>", this.user.status); 
            console.log("Value", data);

            if(this.user.status=="success1" && this.user.userRole=="admin") {                    
                localStorage.setItem('currentusername',this.model.currentusername);
                localStorage.setItem('userRole',this.user.userRole);
                localStorage.setItem('memberNumber',this.user.memberNumber);  
                localStorage.setItem('userloginPrimaryKeyString',this.user.userloginPrimaryKeyString);  
                this.router.navigate(['/admin-header']);
            } 

            if(this.user.status=="success" && this.user.userRole=="admin") {                    
                localStorage.setItem('currentusername',this.model.currentusername);
                localStorage.setItem('userRole',this.user.userRole);
                localStorage.setItem('memberNumber',this.user.memberNumber);  
                localStorage.setItem('userloginPrimaryKeyString',this.user.userloginPrimaryKeyString);  
                this.router.navigate(['/dashboard']);
            } 
                
            if(this.user.status=="success" && this.user.userRole=="member") {                    
                localStorage.setItem('currentusername',this.model.currentusername);
                localStorage.setItem('userRole',this.user.userRole);
                localStorage.setItem('memberNumber',this.user.memberNumber);  
                localStorage.setItem('pageName',"memberhome");
                localStorage.setItem('userloginPrimaryKeyString',this.user.userloginPrimaryKeyString);  
                localStorage.setItem('firstName',this.user.memberID);
                this.router.navigate(['/memberhome']);
            } 

            else {
                this.loading = false;
                this.errordialog = 'block';
                this.errorStatus = this.user.status;
            }

        },
        error => {
            console.log('Login page Network issue');
            this.serverissuedialog = 'block';
            this.loading = false;
        });
    }

    onCloseHandled(){
        this.serverissuedialog = 'none';
        this.errordialog = 'none';
        this.successDialog = 'none';
        this.failuredialog = 'none';
        this.errorpasswordCheck = 'none';
        this.networkissue = 'none';
        this.invalidotpdialog = 'none';
        this.invaliduserdialog = 'none';
        this.registersuccessdialog = 'none';
        this.userExsistdialog = 'none';
        this.memberIDNotValiddialog = 'none';
        this.accTypeissue = 'none';
        this.paymentDialog = "none";
        this.paymentSuccess = 'none';
    }

    Signupdialouge(){
        this.signupdialog='block';
        this.viewMode='tab1';
        this.debitdiv = false;
        this.creditdiv = false;
    }

    nextButton(){
        this.viewMode='tab2';
         this.debitdiv = false;
        this.creditdiv = false;
    }
    nextnxtButton(){
        if(this.model.actType=="" || this.model.actType==null){
            this.accTypeissue = "block";
        }else{
            this.viewMode='tab3';
            this.paymentdiv = true;
            this.debitdiv = false;
            this.creditdiv = false;
            this.paymentBack = true;
            this.creditback = false;
            this.finishdiv = true;
        }
        
    }

    backtosignup(){
        this.viewMode='tab1'; 
        this.debitdiv = false;
        this.creditdiv = false;
        this.paymentBack = true;
        this.creditback = false;
        this.finishdiv = true;
    }
    backtosignup1(){
        this.viewMode='tab2'; 
        this.debitdiv = false;
        this.creditdiv = false;
        this.paymentBack = true;
        this.creditback = false;
        this.finishdiv = true;
    }

    passwordCheck(){
        if(this.model.password == this.model.repwd){
            
        }else{
            this.errorpasswordCheck = 'block';
        }
    }

    getMemberIDValidate() {
        this.userService.getMemberIDValidate(this.model.refmemberID)
        .subscribe(
        memberResponse => {
            this.user = memberResponse;
            if(this.user.status=="Valid")
            {
                this.successDialog = 'block';
            } 
            
            if(this.user.status=="InValid")
            {
                this.failuredialog = 'block';
            }                  
        },
        
        error => {
            this.networkissue = 'block';
            this.loading = false;
        });  
    }

    register() {
        this.loading1 = true;
        console.log("Admin Bank Name -->"+this.model.adminbankName);
        console.log("Transfer Bank Name -->"+this.model.banktransfer);
        console.log("Transfer Account Name -->"+this.model.transferAcctName);
        console.log("Transfer Account Number -->"+this.model.transferBankAcctNumber);
        if(this.model.adminbankName == "CIMB NIAGA"){
            this.model.adminacctNumber = "800077326600";
            this.model.adminacctName = "Blue Print Nusantara Indonesia";
        }else if(this.model.adminbankName == "DBS BANK"){
            this.model.adminacctNumber = "003-932398-0";
            this.model.adminacctName = "Global Gains Limited";
        }
        console.log("Admin Account Name -->"+this.model.adminacctName);
        console.log("Admin Account Number -->"+this.model.adminacctNumber);
        this.model.memberID = localStorage.getItem("memberNumber");
        this.userService.create(this.model)
        .subscribe(
        data => {
            this.user=data;
            console.log('return value -->',this.user.status);
            console.log("New Member Number ---->"+this.user.memberNumber);
            if(this.user.status=="userexits") {
                console.log('If User Exits');
                this.userExsistdialog = 'block';
                this.loading1 = false;
            }

            if(this.user.status=="success") {
                console.log('If Success');
                this.registersuccessdialog = 'block';
                this.signupdialog = 'none';
            }

            if(this.user.status=="otherError") {
                this.accTypeissue = 'block';
                this.loading1 = false;

            }
            if(this.user.status=="memberIDNotValid") {
                this.memberIDNotValiddialog = 'block';
                this.loading1 = false;
            }     
            
        },
        error => {
            this.networkissue = 'block';
            this.loading1 = false;
        });
    }

    closeDialog(){
        this.signupdialog = 'none';
    }

    paydebitcard(){
        this.creditdiv = false;
        this.debitdiv = true;
        this.paymentdiv = true;
        this.nextdetails = false;
        this.bankdetails2 = false;
        this.buttondiv = false;
        this.paymentBack = true;
        this.creditback = false;
        this.finishdiv = true;
        this.dbsbankdetails = false;
    }

    paycreditcard(){
        this.creditdiv = true;
        this.debitdiv = false;
        this.paymentdiv = false;
        this.nextdetails = false;
        this.bankdetails2 = false;
        this.buttondiv = false;
        this.paymentBack = false;
        this.creditback = true;
        this.finishdiv = false;
        this.dbsbankdetails = false;

        this.model.bankName = '';
        this.model.banktransfer = '';
    }
    
    creditBack(){
        this.paymentdiv = true;
        this.debitdiv = false;
        this.creditdiv = false;
        this.nextdetails = false;
        this.bankdetails2 = false;
        this.buttondiv = false;
        this.paymentBack = true;
        this.creditback = false;
        this.finishdiv = true;
        this.dbsbankdetails = false;

        this.model.bankName = '';
        this.model.banktransfer = '';
    }

    afterselect(adminbankName:string){
        this.model.transferAcctName = '';
        this.model.transferBankAcctNumber = '';
        this.creditdiv = false;
        this.debitdiv = true;
        this.paymentdiv = true;
        if(adminbankName == "CIMB NIAGA"){
            this.nextdetails = true;
            this.dbsbankdetails = false;
        }else if(adminbankName == "DBS BANK"){
            this.dbsbankdetails = true;
            this.nextdetails = false;
        }
        this.bankdetails2 = false;
        this.buttondiv = false;
        this.userService.getBankTransferName()
        .subscribe(
            data => {
                this.bankTransferList = data;
            },
            error => {
                this.networkissue = 'block';
            }
        );
    }
    
    afterselect1(){
        this.model.transferAcctName = '';
        this.model.transferBankAcctNumber = '';

        this.creditdiv = false;
        this.debitdiv = true;
        this.paymentdiv = true;
        this.nextdetails = false;
        this.dbsbankdetails = true;
        this.bankdetails2 = true;
        this.buttondiv = true;
    }

    afterselect2(){
        this.model.transferAcctName = '';
        this.model.transferBankAcctNumber = '';
        
        this.creditdiv = false;
        this.debitdiv = true;
        this.paymentdiv = true;
        this.nextdetails = true;
        this.bankdetails2 = true;
        this.buttondiv = true;
        this.dbsbankdetails = false;
    }
    
    uploadPayment(event:any){
        this.userService.getrandomNumber()
        .subscribe(
        data => {
            this.user = data;  
            console.log("RandomNumber ----->"+this.user.memberID2);
            var newRandomNumber = +this.user.memberID2 + +1;  
            console.log("New RandomNumber ----->"+newRandomNumber);
            if(this.model.actType == "silver"){
                this.memberID3 = "GLGS"+newRandomNumber;
            }else if(this.model.actType == "gold"){
                this.memberID3 = "GLGG"+newRandomNumber;
            }else if(this.model.actType == "platinum"){
                this.memberID3 = "GLGP"+newRandomNumber;
            }
            console.log("Member ID ---->"+this.memberID3);
            const file = event.target.files.item(0);
            if (file.type.match('image.*')) {
                this.selectedFiles = event.target.files;
                this.progress.percentage = 0;
                this.currentFileUpload = this.selectedFiles.item(0);
                
                this.authenticationService.pushFileToStorage(this.currentFileUpload,this.memberID3).subscribe(event => {
                    if (event.type === HttpEventType.UploadProgress) {       
                        this.progress.percentage = Math.round(100 * event.loaded / event.total);
                    } else if (event instanceof HttpResponse) {
                        console.log('File is completely uploaded!'+event.status);
                    }   
                });
                this.selectedFiles = undefined; 
            } else {
                alert('invalid format!');
            }
        },
        error => {

        });     
    }

    uploadYourPayment(){
        this.paymentDialog = "block";
        this.payUpload=true;
        this.selectedFiles=undefined;
        this.currentFileUpload=undefined;
        this.model.memberID = '';
        this.model.banktransfer = '';
    }

    selectFile(event:any) {
        const file = event.target.files.item(0);
    
        if (file.type.match('image.*')) {
          this.selectedFiles = event.target.files;
        } else {
          alert('invalid format!');
        }
      }
    
      upload() {
        this.authenticationService.getMemberIDValidate(this.model.memberID)
        .subscribe(
          memberResponse => {
            this.user = memberResponse;
            console.log("Response message -------------------->", this.user.status); 
            if(this.user.status=="Valid"){
              console.log('Member ID -->'+this.model.memberID);
              this.progress.percentage = 0;
              this.memberID = this.model.memberID;
              this.currentFileUpload = this.selectedFiles.item(0);
    
              this.authenticationService.pushFileToStorage(this.currentFileUpload,this.memberID).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {       
                  this.progress.percentage = Math.round(100 * event.loaded / event.total);
                  console.log('---------Inside If--------------');
        
                } else if (event instanceof HttpResponse) {
                  console.log('File is completely uploaded!'+event.status);
                  if(event.status==200){
                    this.selectedFiles=undefined;// FileList;
                    this.currentFileUpload=undefined;//: File;
                    this.memberID='';//: string;
                    this.paymenyUpload();
                  }
                  else {
                    this.memberIDNonValiddialog ='block';
                  }
                }
                else if(event instanceof HttpErrorResponse){
                    this.memberIDNonValiddialog ='block';
        
                }
              });
              this.selectedFiles = undefined;
    
          } 
            if(this.user.status=="InValid"){
               this.memberIDNonValiddialog = 'block';
            }                    
          },
          error => {
            this.networkissue = 'block';
          }); 
    
      }
      onClosedDialog(){
          this.memberIDNonValiddialog = 'none';
      }

      paymenyUpload(){
        this.userService.memberPayment(this.model)
        .subscribe(
          data => {
            this.user = data;
            if(this.user.status=='success'){
                this.paymentSuccess ='block';
            }else if(this.user.status=='failure'){
              this.errordialog = "block";
            }
          },
          error => {
              this.networkissue = "block";
          }); 
      }
    

}
