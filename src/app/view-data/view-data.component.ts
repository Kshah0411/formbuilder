import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FetcherService } from '../fetcher.service';
import {map, startWith} from 'rxjs/operators';
import {MatTableDataSource} from '@angular/material/table';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import swal from 'sweetalert2';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.css']
})
export class ViewDataComponent implements OnInit {

    formControl = new FormControl();
    screenControl = new FormControl();
    archivedControl = new FormControl();
    forms: string[];
    screens: string[];
    archived: string[];
    formOptions: Observable<string[]>;
    screenOptions: Observable<string[]>;
    archivedOptions: Observable<string[]>;
    includeArchive = false;
    c_value: string;
    chipValues: string[] = [];
    visible = true;
    selectable = true;
    removable = true;
    data=[];

  dataSource = new MatTableDataSource<any>(this.data);

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private fetchService:FetcherService) {     }
  
  ngOnInit(): void {
    this.getScreens();
  }

  showArchived(event:MatCheckboxChange):void
  {
    if(event.checked)
    {
      this.getArchived();
      this.screenControl.setValue('');
      this.formControl.setValue('');
    }
  }

  getScreens()
  {
    this.fetchService.getScreens()
    .subscribe((data) => {	
      this.screens = data;	
      //console.log(this.screens)
      this.screenOptions = this.screenControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value,'S'))
      );
      
    });	
  }

  getForms(value)
  {
    //console.log(value)
    this.screens.map((s) => {
      if(s["ScreenName"] === value)
      {
        //Get forms from selected screen
        this.fetchService.getForm(s["ScreenID"]).subscribe((forms) => {
          this.forms = forms;

          this.formOptions = this.formControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value,'F'))
          );
        });	
      }
    });
    
  }

  tabClick(tab) {
    this.screenControl.setValue('');
    this.formControl.setValue(''); 
    this.data = [];
    this.keys = {};
    this.screenID = [];
    this.formID = [];
    this.dataSource = new MatTableDataSource<any>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  //To get only archived tables
    if(tab.index === 1)
    {
      this.getArchived();
    }
  }

  getArchived()
  {
    this.fetchService.getArchived()
      .subscribe((res) => {

        this.archived = res;
        //console.log(this.archived)

        this.archivedOptions = this.archivedControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value,'A'))
        );
  
      });
  }
  

  
  //Filtering DropDown values
  private _filter(value: string, key: string): string[] {
    const filterValue = value.toLowerCase();
    if (key === 'S') {
      return this.screens.filter(screen => screen["ScreenName"].toLowerCase().indexOf(filterValue) === 0);
    } else if(key === 'F'){
      return this.forms.filter(form => form["FormName"].toLowerCase().indexOf(filterValue) === 0);
    }
    else if(key === 'A'){
      return this.archived.filter(table => table["ScreenName"].toLowerCase().indexOf(filterValue) === 0);
    }
  }


  screenID = [];
  formID = [];
  
  keys = {};
  generateTable()
  {
    // console.log(this.screenID);
    // console.log(this.formID);
    
    var columns = [];
    var tooltips = [];
    var keys = [];
    if(this.formID.length > 0){
      this.fetchService.joinTables(this.screenID,this.formID)
        .subscribe((res) => {
          this.data = []
          this.keys = []
          res.map((obj) => {

          for(var i=0;i<Object.keys(obj).length;i++)
          {
            var arr = Object.keys(obj)[i].split("_");
            columns.push(arr[2]);
            tooltips.push(arr[0]+"/"+arr[1]);
          }

          keys = Object.keys(obj);
          this.data.push(obj);
          //console.log(this.keys)
          
          this.dataSource = new MatTableDataSource<any>(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
        
        this.keys = {"columns":columns,"keys":keys,"tooltips":tooltips};
      });
    }
  }

  //Filter Search Box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  //Adding to Chips
  addTable(){
    if(this.screenControl.value !== '' || this.formControl.value !== '')
    {
      this.c_value = this.screenControl.value+"/"+this.formControl.value
      //console.log(this.c_value)
      if(!this.chipValues.includes(this.c_value))
      {
        this.chipValues.push(this.c_value)
        var val = this.c_value.split('/');
          //console.log(val);
          this.screens.map((s) => {
            if(s["ScreenName"] == val[0])
            {
              this.screenID.push(s["ScreenID"]);
            }
          })
          this.forms.map((f) => {
            if(f["FormName"] == val[1])
            {
              this.formID.push(f["FormID"]);
            }
          })
      }
      else
      {
        console.log("Combination Already exists")
      }
    }

    // To include Archived tables
    if(this.archivedControl.value !== null || this.archivedControl.value !== '')
    {
        var temp = [];
        if(typeof this.archived !== "undefined"){
          this.archived.map((table) => {
            if(table["FormName"] === this.archivedControl.value)
            {
              this.c_value = table["ScreenName"]+"/"+table["FormName"];
              temp.push(table["ScreenID"]);
              temp.push(table["FormID"]);
            }
          })
          
          if(!this.chipValues.includes(this.c_value))
          {
            this.chipValues.push(this.c_value);
            this.screenID.push(temp[0]);
            this.formID.push(temp[1]);
          }
        } 
    }
    //Reset input
    this.screenControl.setValue('');
    this.formControl.setValue(''); 
    this.archivedControl.setValue('');

  }

  remove(chipValue: string): void {
    const index = this.chipValues.indexOf(chipValue);

    if (index >= 0) {
      this.chipValues.splice(index, 1);
      this.screenID.splice(index,1);
      this.formID.splice(index,1);
    }
  }

  showActiveTable()
  {
    var columns = [];
    var tooltips = [];
    var keys = [];
    this.screenID = [];
    this.formID = [];
    this.screens.map((s) => {
      if(s["ScreenName"] == this.screenControl.value)
      {
        this.screenID.push(s["ScreenID"]);
      }
    })
    this.forms.map((f) => {
      if(f["FormName"] == this.formControl.value)
      {
        this.formID.push(f["FormID"]);
      }
    })

    if(this.formID.length > 0){
      this.fetchService.joinTables(this.screenID,this.formID)
        .subscribe((res) => {
          this.data = []
          this.keys = []
          res.map((obj) => {

          for(var i=0;i<Object.keys(obj).length;i++)
          {
            var arr = Object.keys(obj)[i].split("_");
            columns.push(arr[2]);
            tooltips.push(arr[0]+"/"+arr[1]);
          }

          keys = Object.keys(obj);
          this.data.push(obj);
          
          this.dataSource = new MatTableDataSource<any>(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
        
        this.keys = {"columns":columns,"keys":keys,"tooltips":tooltips};
      });
    }
  }


  showArchivedTables()
  {
    var columns = [];
    var tooltips = [];
    var keys = [];
    this.screenID = [];
    this.formID = [];
    this.archived.map((table) => {
      if(table["FormName"] === this.archivedControl.value)
      {
        this.screenID.push(table["ScreenID"]);
        this.formID.push(table["FormID"]);
      }
    })

    if(this.formID.length > 0){
      //join table API can also show one table 
      this.fetchService.joinTables(this.screenID,this.formID)
        .subscribe((res) => {
          console.log(res);
          this.data = []
          this.keys = []

          res.map((obj) => {
          for(var i=0;i<Object.keys(obj).length;i++)
          {
            var arr = Object.keys(obj)[i].split("_");
            columns.push(arr[2]);
            tooltips.push(arr[0]+"/"+arr[1]);
          }

          keys = Object.keys(obj);
          this.data.push(obj);
          
          this.dataSource = new MatTableDataSource<any>(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
        
        this.keys = {"columns":columns,"keys":keys,"tooltips":tooltips};
      });
    }
  }

}
