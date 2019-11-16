import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/index';
import { User } from '../_models';

@Component({
  selector: 'app-memberunitstatus',
  templateUrl: './memberunitstatus.component.html',
  styleUrls: ['./memberunitstatus.component.css']
})
export class MemberunitstatusComponent implements OnInit {
  model: any = {};
  user:User;
  memberUnitList: any = {};
  memberMiniUnitList: any = {};
  treeList: any = {};
  viewMode: any = {};

  public div2 = false;
  public userStatusPending = false;
  public userStatusClosed = false;

  nopublicdataFound = 'none';
  noprivatedataFound = 'none';
  nominidataFound = 'none';
  networkissue = 'none';

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.statusOfPublicTree();
    this.div2=false;
  }

  statusOfPublicTree(){
    this.memberUnitList="";
    this.viewMode = 'tab1';
    this.div2=false;
    var primaryKey = localStorage.getItem("userloginPrimaryKeyString");
    console.log("status Of Public Tree PK-->"+primaryKey);
    this.userService.getSingleUnitInfo(primaryKey) 
    .subscribe(
      data => {
        this.memberUnitList = data;
        console.log("statusOfPublicTree List Size-------------->"+Object.keys(this.memberUnitList).length);
        if(Object.keys(this.memberUnitList).length > 0){
          this.viewMode = 'tab1';
        }
        else {
          this.nopublicdataFound='block';
        }
      },
      error => {
        this.networkissue = 'block';
      }
    );
  }

  chooseTreeName(){
    this.viewMode = 'tab2';
    this.model.treeName = '';
    this.treeList='';
    this.div2=false;
    this.userService.loadTreeName() 
    .subscribe(
      data => {
        this.treeList = data;
        console.log("Tree Name--->"+this.treeList[1]);
        console.log("statusOfPrivateTree List Size-------------->"+Object.keys(this.treeList).length);
      },
      error => {
        this.networkissue = 'block';
      }
    );
  }
  statusOfPrivateTree(){
    this.memberUnitList="";
    var primaryKey = localStorage.getItem("userloginPrimaryKeyString");
    this.userService.getSinglePrivateUnitInfo(primaryKey,this.model.treeName) 
    .subscribe(
      data => {
        this.memberUnitList = data;
        console.log("statusOfPrivateTree List Size-------------->"+Object.keys(this.memberUnitList).length);
        if(Object.keys(this.memberUnitList).length > 0){
          this.div2=true;
        }
        else {
          this.noprivatedataFound='block';
        }
      },
      error => {
        this.networkissue = 'block';
      }
    );
  }

  onCloseHandled(){
    this.networkissue = 'none';
    this.nopublicdataFound = 'none';
    this.noprivatedataFound = 'none';
    this.nominidataFound = 'none';
  }

  statusOfMiniTree(){
    this.memberMiniUnitList="";
    this.viewMode = 'tab3';
    this.div2=false;
    var primaryKey = localStorage.getItem("userloginPrimaryKeyString");
    console.log("status Of Mini Tree PK-->"+primaryKey);
    this.userService.getSingleMiniUnitInfo(primaryKey) 
    .subscribe(
      data => {
        this.memberMiniUnitList = data;
        console.log("statusOfMiniTree List Size-------------->"+Object.keys(this.memberMiniUnitList).length);
        if(Object.keys(this.memberMiniUnitList).length > 0){
          this.viewMode = 'tab3';
        }
        else {
          this.nominidataFound='block';
        }
      },
      error => {
        this.networkissue = 'block';
      }
    );
  }

}
