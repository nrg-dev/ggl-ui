import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/index';
import { User } from '../_models/index';
import { AlertService, AuthenticationService } from '../_services/index';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-member-purchaseunit',
  templateUrl: './member-purchaseunit.component.html',
  styleUrls: ['./member-purchaseunit.component.css']
})
export class MemberPurchaseunitComponent implements OnInit {
  
  model: any = {};
  user:User;
  invoiceList: any={};
  uniteList: any={};
  miniunitList: any={};

  viewMode: any = {};

  public div1 = true;
  public div2 = true;
  public div3 = true;
  public div4 = true;
  public div6 = false;
  public div7 = false;
  public div8 = false;
  public div9 = false;

  networkissue = 'none';
  unitSuccessDialog = 'none';
  OwnTreeSuccessDialog = 'none';
  privateSuccessDialog = 'none';
  miniSuccessDialog = 'none';
  failuredialog = 'none';

 
  constructor(
    private userService: UserService,
    private alertService: AlertService 
  ) {     

  }

  ngOnInit() {
    this.firstTabShow();
    this.uniteList  = [1, 2, 3, 4, 5 ];
    this.miniunitList = [1,2,3];
  }

  firstTabShow(){
    this.viewMode = 'tab1';
  }

  getPrice(numberofUnit : number){
    if(numberofUnit == 1){
      this.model.price =  100;
    }else if(numberofUnit == 2){
      this.model.price = 200;
    }else if(numberofUnit == 3){
      this.model.price = 300;
    }else if(numberofUnit == 4){
      this.model.price = 400;
    }else if(numberofUnit == 5){
      this.model.price = 500;
    }

  }
  
  createPublicUnit(numberofUnit: number){
    this.model.numberofUnit=numberofUnit;
    var primaryKey = localStorage.getItem("userloginPrimaryKeyString");
    this.model.userLoginPrimaryKey=primaryKey;
    this.userService.publicUnitSave(this.model)
    .subscribe(
      data => { 
          this.invoiceList =   data;   
          this.model.totalAmount=this.invoiceList[0].totalAmount;
          this.unitSuccessDialog = 'block';      
      },
      error => {
          this.networkissue = 'block';
      }
    );
  }

  onCloseHandled(){
    this.unitSuccessDialog = 'none';
    this.div1=false;
    this.div2=false;
    this.div3=false;
    this.div4=false;
    this.div6=true;
    this.div7=false;
    this.div8=false;
    this.div9=false;
  }

  onCloseHandled2(){
    this.OwnTreeSuccessDialog = 'none';
    this.div1=false;
    this.div2=false;
    this.div3=false;
    this.div4=false;
    this.div6=false;
    this.div7=true;
    this.div8=false;
    this.div9=false;
  }

  onCloseHandled3(){
    this.privateSuccessDialog = 'none';
    this.div1=false;
    this.div2=false;
    this.div3=false;
    this.div4=false;
    this.div6=false;
    this.div7=false;
    this.div8=true;
    this.div9=false;
  }

  onCloseHandled4(){
    this.networkissue = 'none';
    this.failuredialog = 'none';
    this.div1 = true;
    this.div2 = true;
    this.div3 = true;
    this.div4 = true;
  }

  createOwnTree(numberofUnit: number){
    console.log("Own Tree Number of Units--->"+numberofUnit);
    this.model.numberofUnit=numberofUnit;
    var primaryKey = localStorage.getItem("userloginPrimaryKeyString");
    this.model.userLoginPrimaryKey=primaryKey;
    this.userService.createOwnTree(this.model)
    .subscribe(
      data => { 
          this.invoiceList =   data; 
          console.log("List:"+this.invoiceList); 
          this.model.treeName=this.invoiceList[0].treeName;
          this.model.totalAmount=this.invoiceList[0].totalAmount;
          console.log("Tree Name -->"+this.model.treeName);
          this.OwnTreeSuccessDialog = 'block';               
      },
      error => {
          this.networkissue = 'block';
     }
    );
  }

  privateTree(){
    console.log("Ref ID-->"+this.model.refmemberID);
    console.log("Number of Unit-->"+this.model.numberofUnit);
    this.userService.getOwnTreeNameValidate(this.model.refmemberID)
    .subscribe(
      memberResponse => {
        this.user = memberResponse;
        if(this.user.status=="Valid") {
          var primaryKey = localStorage.getItem("userloginPrimaryKeyString");
          this.model.userLoginPrimaryKey=primaryKey;
          this.userService.privateUnitSave(this.model)
          .subscribe(
          data => { 
            this.invoiceList =   data;   
            this.model.totalAmount=this.invoiceList[0].totalAmount;
            this.privateSuccessDialog='block';               
          },
          error => {
            this.networkissue = 'block';
          }
        );
      } 
           
      if(this.user.status=="InValid") {
        this.failuredialog = 'block';
      }                  
    },
    error => {
        this.alertService.error(error);
    }); 
  }
  
  selectPublic(){
    this.div1 = true;
    this.div2 = true;
    this.div3 = true;
    this.div4 = true;
    this.div6 = false;
    this.div7 = false;
    this.div8 = false;
    this.div9 = false;
    this.model.numberofUnit = '';
    this.model.price = '';
  }

  selectOwnTree(){
    this.div1 = true;
    this.div2 = true;
    this.div3 = true;
    this.div4 = true;
    this.div6 = false;
    this.div7 = false;
    this.div8 = false;
    this.div9 = false;
    this.model.numberofUnit='';
    this.model.price = '';
  }
  
  selectPrivate(){
    this.model.refmemberID='';
    this.model.numberofUnit='';
    this.model.price = '';

    this.div1 = true;
    this.div2 = true;
    this.div3 = true;
    this.div4 = true;
    this.div6 = false;
    this.div7 = false;
    this.div8 = false;
    this.div9 = false;
  }

  onCloseHandled1(){
    this.miniSuccessDialog = 'none';
    this.div1=false;
    this.div2=false;
    this.div3=false;
    this.div4=false;
    this.div6=false;
    this.div7=false;
    this.div8=false;
    this.div9=true;
  }

  createMiniUnit(numberofUnit: number){
    this.model.numberofUnit=numberofUnit;
    var primaryKey = localStorage.getItem("userloginPrimaryKeyString");
    this.model.userLoginPrimaryKey=primaryKey;
    this.userService.miniUnitSave(this.model)
    .subscribe(
      data => { 
          this.invoiceList =   data;   
          this.model.totalAmount=this.invoiceList[0].totalAmount;
          this.miniSuccessDialog = 'block';      
      },
      error => {
          this.networkissue = 'block';
      }
    );
  }

  selectMini(){
    this.div1 = true;
    this.div2 = true;
    this.div3 = true;
    this.div4 = true;
    this.div6 = false;
    this.div7 = false;
    this.div8 = false;
    this.div9 = false;
    this.model.numberofUnit = '';
    this.model.price = '';
  }

}
