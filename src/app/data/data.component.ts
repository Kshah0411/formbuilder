import { Component, OnInit } from '@angular/core';
import { FetcherService } from '../fetcher.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  constructor(private fetchService:FetcherService) { }

  ngOnInit(): void { 
    this.getScreens();
  }

  screens = [];
  forms = [];
  columns = [];
  tooltips = [];
  keys = {};
  screenID = '';
  formID = '';
  showForms = false;
  showColumns = false;

  getScreens()
  {
    this.fetchService.getScreens()
    .subscribe((data) => {	
      this.screens = data;
      
    });
  }

  screenClick(s)
  {
    this.screenID = s["ScreenID"];
    this.forms = [];
    this.keys = {"columns":[],"keys":[],"tooltips":[]};
    this.fetchService.getForm(s["ScreenID"])
    .subscribe((forms) => {
      this.forms = forms;
      this.showForms = true;
    });	
      
  }

  formClick(f)
  {
    this.formID = f["FormID"];
    var formIDs = [];
    formIDs.push(this.formID);
    var screenIDs = [];
    screenIDs.push(this.screenID);
    this.fetchService.joinTables(screenIDs,formIDs)
        .subscribe((res) => {
          
          this.columns = [];
          this.tooltips = [];
          var keys = [];
          console.log(res)
          res.map((obj) => {
            var arr = obj.split("_");
            this.columns.push(arr[2]);
            this.tooltips.push(arr[0]+" / "+arr[1]);
            // this.tooltips.push(arr[1]);  
          })
          keys = res;
          this.keys = {"columns":this.columns,"keys":keys,"tooltips":this.tooltips};
          this.showColumns = true;
      });
  }


}
