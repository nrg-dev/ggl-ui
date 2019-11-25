import { Component, OnInit } from '@angular/core';
import { User } from '../_models/index';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpEventType, HttpErrorResponse } from '@angular/common/http';
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
  invoiceList : any = {};

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  invoiceNumber: string;
  treeName: string;

  successDialog = 'none';
  networkissue = 'none';
  failuredialog = 'none';
  errordialog = 'none';
  
  public paymentdiv = false;
  public debitdiv = false;
  public creditdiv =  false;
  public nextdetails = false;
  public bankdetails2 = false;
  public buttondiv = false;
  public dbsbankdetails = false;
  public uploaddiv = false;

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
    this.uploaddiv = false;
  }

  paycreditcard(){
    this.creditdiv = true;
    this.debitdiv = false;
    this.paymentdiv = false;
    this.nextdetails = false;
    this.bankdetails2 = false;
    this.buttondiv = false;
    this.dbsbankdetails = false;
    this.uploaddiv = false;
  }

  creditBack(){
    this.paymentdiv = true;
    this.debitdiv = false;
    this.creditdiv = false;
    this.nextdetails = false;
    this.bankdetails2 = false;
    this.buttondiv = false;
    this.dbsbankdetails = false;
    this.uploaddiv = false;
    
    this.model.bankName = '';
    this.model.banktransfer = '';
  }

  onCloseHandled(){
    this.successDialog = 'none';
    this.networkissue = 'none';
    this.failuredialog = 'none';
    this.errordialog = 'none';
  }

  afterselect(adminbankName:string){
    this.model.username = '';
    this.model.bankAcctNumber = '';
    this.creditdiv = false;
    this.debitdiv = true;
    this.paymentdiv = true;
    this.uploaddiv = false;
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
    this.uploaddiv = false;
    this.model.username = '';
    this.model.bankAcctNumber = '';
    this.model.treeName = '';
    this.model.invoiceNumber = '';
  }

  afterselect2(){
    this.creditdiv = false;
    this.debitdiv = true;
    this.paymentdiv = true;
    this.nextdetails = true;
    this.bankdetails2 = true;
    this.buttondiv = true;
    this.dbsbankdetails = false;
    this.uploaddiv = false;
    this.model.username = '';
    this.model.bankAcctNumber = '';
  }

  selectFile(event:any) {
    const file = event.target.files.item(0);

    if (file.type.match('image.*')) {
      this.selectedFiles = event.target.files;
    } else {
      alert('invalid format!');
    }
  }

  uploadPayment(){
    console.log('Invoice Number -->'+this.model.invoiceNumber);
    console.log('Tree Name -->'+this.model.treeName);
    this.uploadService.getValidateTempTree(this.model.invoiceNumber,this.model.treeName)
    .subscribe(
      memberResponse => {
        this.user = memberResponse;
        console.log("Response message -------------------->", this.user.status); 
        if(this.user.status=="Valid"){
          console.log('Invoice Number -->'+this.model.invoiceNumber);
          console.log('Tree Name -->'+this.model.treeName);
          this.progress.percentage = 0;
          this.invoiceNumber = this.model.invoiceNumber;
          this.treeName = this.model.treeName;
          this.currentFileUpload = this.selectedFiles.item(0);

          this.uploadService.storeImage(this.currentFileUpload,this.invoiceNumber,this.treeName).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {       
              this.progress.percentage = Math.round(100 * event.loaded / event.total);
              console.log('--------- Inside If--------------');
    
            } else if (event instanceof HttpResponse) {
              console.log('File is completely uploaded!'+event.status);
              if(event.status==200){
                this.selectedFiles=undefined;
                this.currentFileUpload=undefined;
                this.invoiceNumber='';
                this.treeName='';
                this.successDialog ='block';
                this.payment();
              }
              else {
                this.failuredialog ='block';
              }
            }
            
            else if(event instanceof HttpErrorResponse){
                this.failuredialog ='block';
            }
          });
          this.selectedFiles = undefined;
        } 
        if(this.user.status=="InValid"){
            this.errordialog = 'block';
        }                    
      },
      error => {
        this.networkissue = 'block';
      }); 
  }

  payment(){
    console.log("Admin Bank Name -->"+this.model.bankName);
    console.log("Transfer Bank Name -->"+this.model.banktransfer);
    console.log("Transfer Account Name -->"+this.model.username);
    console.log("Transfer Account Number -->"+this.model.bankAcctNumber);
    console.log("Tree Name -->"+this.model.treeName);
    console.log("Invoice Number -->"+this.model.invoiceNumber);
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

  uploaddivcall(){
    this.uploaddiv = true;
  }

  /*treechange(){
    this.userService.getInvoiceNumber(this.model.treeName)
    .subscribe(
      data => {
          this.invoiceList = data;
          if(this.invoiceList.length==0){
            alert("------ No Invoice Number ------")
          }else{
            alert("--------- Got InvoiceNuber -------")
          }
      },
      error => {
          this.networkissue = "block";
      }
    );
  }*/

}
