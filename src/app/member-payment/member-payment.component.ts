import { Component, OnInit } from '@angular/core';
import { User } from '../_models/index';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { AlertService, AuthenticationService, UserService } from '../_services/index';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-member-payment',
  templateUrl: './member-payment.component.html',
  styleUrls: ['./member-payment.component.css']
})
export class MemberPaymentComponent implements OnInit {
  model: any = {};
  user:User;
  bankList: any = {};  
  bankTransferList:  any ={};

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  successDialog = 'none';
  networkissue = 'none';
  failuredialog = 'none';
  public paymentdiv = false;
  public debitdiv = false;
  public creditdiv =  false;
  public nextdetails = false;
  public bankdetails2 = false;
  public buttondiv = false;
  public dbsbankdetails = false;

  constructor(
    private uploadService: AuthenticationService , 
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService : UserService,
    private alertService: AlertService) {

  }

  ngOnInit() {
    this.paymentdiv = true;
    this.userService.getBankName()
    .subscribe(
        data => {
            this.bankList = data;
        },
        error => {
            this.networkissue = 'block';
        }
    );
  }

  paydebitcard(){
    this.creditdiv = false;
    this.debitdiv = true;
    this.paymentdiv = true;
    this.nextdetails = false;
    this.bankdetails2 = false;
    this.buttondiv = false;
    this.dbsbankdetails = false;
  }

  paycreditcard(){
    this.creditdiv = true;
    this.debitdiv = false;
    this.paymentdiv = false;
    this.nextdetails = false;
    this.bankdetails2 = false;
    this.buttondiv = false;
    this.dbsbankdetails = false;
  }

  creditBack(){
    this.paymentdiv = true;
    this.debitdiv = false;
    this.creditdiv = false;
    this.nextdetails = false;
    this.bankdetails2 = false;
    this.buttondiv = false;
    this.dbsbankdetails = false;
    
    this.model.bankName = '';
    this.model.banktransfer = '';
  }

  onCloseHandled(){
    this.successDialog = 'none';
    this.networkissue = 'none';
    this.failuredialog = 'none';
  }

  afterselect(adminbankName:string){
    this.model.username = '';
    this.model.bankAcctNumber = '';
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
    this.creditdiv = false;
    this.debitdiv = true;
    this.paymentdiv = true;
    this.nextdetails = false;
    this.bankdetails2 = true;
    this.buttondiv = true;
    this.dbsbankdetails = true;
    this.model.username = '';
    this.model.bankAcctNumber = '';
  }

  afterselect2(){
    this.creditdiv = false;
    this.debitdiv = true;
    this.paymentdiv = true;
    this.nextdetails = true;
    this.bankdetails2 = true;
    this.buttondiv = true;
    this.dbsbankdetails = false;
    this.model.username = '';
    this.model.bankAcctNumber = '';
  }

  uploadPayment(event:any){
    const file = event.target.files.item(0);
    if (file.type.match('image.*')) {
      this.selectedFiles = event.target.files;
      this.progress.percentage = 0;
      this.currentFileUpload = this.selectedFiles.item(0);
      var memberID = localStorage.getItem("memberNumber");
      this.uploadService.pushFileToStorage(this.currentFileUpload,memberID).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {       
            this.progress.percentage = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
            console.log('File is completely uploaded!'+event.status);
        }   
      });
      this.selectedFiles = undefined; 
    } else {
      alert('Invalid format!');
    }

  }

  payment(){
    console.log("Admin Bank Name -->"+this.model.bankName);
    console.log("Transfer Bank Name -->"+this.model.banktransfer);
    console.log("Transfer Account Name -->"+this.model.username);
    console.log("Transfer Account Number -->"+this.model.bankAcctNumber);
    if(this.model.bankName == "CIMB NIAGA"){
      this.model.adminacctNumber = "800077326600";
      this.model.adminacctName = "Blue Print Nusantara Indonesia";
    }else if(this.model.bankName == "DBS BANK"){
        this.model.adminacctNumber = "003-932398-0";
        this.model.adminacctName = "Global Gains Limited";
    }
    console.log("Admin Account Name -->"+this.model.adminacctNumber);
    console.log("Admin Account Number -->"+this.model.adminacctName);
    this.model.memberID = localStorage.getItem("memberNumber");
    this.userService.memberPayment(this.model)
    .subscribe(
      data => {
        this.user = data;
        if(this.user.status=='success'){
          this.successDialog = "block";
        }else if(this.user.status=='failure'){
          this.failuredialog = "block";
        }
      },
      error => {
          this.networkissue = "block";
      });  
  }

}
