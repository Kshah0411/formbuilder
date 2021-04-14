import { Component, OnInit, Injectable,ViewChild } from '@angular/core';
import { FetcherService } from '../fetcher.service';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: "app-data-view",
  templateUrl: "./data-view.component.html",
  styleUrls: ["./data-view.component.css"],
})
export class DataViewComponent implements OnInit {
  constructor(private fetchService: FetcherService) {}

  ngOnInit(): void {
    //On Loading, get and generate Tree of both Active & Archived Tables
    this.getScreens();
    this.getArchived();
  }

  screens = [];
  activeTree = [];
  archiveTree = [];

  tabClicked(str) {
    //Sending Active or Archive Data to the Tree View Component, to refresh the Tree
    if(str === "active")
    {
      this.treeData = this.activeTree;
      this.fetchService.sendRefreshTree(this.activeTree);
    }
    else
    {
      this.treeData = this.archiveTree;
      this.fetchService.sendRefreshTree(this.archiveTree);
    }
    this.dataSource = new MatTableDataSource<any>();
    this.patientsData = [];
    this.selected = new Map();
    this.formsinMap = new Set();
    this.selectAll = false;
  }

  
  //Filter Search Box
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getScreens() {
    this.fetchService.getScreens().subscribe((data) => {
      this.screens = data;
      this.getForms();
    });
  }

  keysObj = {};
  columns = [];
  tooltips = [];

  dynamicData = [];
  treeData = [];
  show = false;

  async getForms()
  {
    try
    {
      await Promise.all(this.screens.map(async (screen) => {
          return new Promise((resolve, reject) => {
            this.fetchService.getForm(screen["ScreenID"])
              .subscribe(async (forms) => {
                var obj = {ID: screen["ScreenID"], NAME: screen["ScreenName"] };
                this.treeData.push(obj);
                var screenID = screen["ScreenID"];
                await Promise.all(forms.map(async (form) => {
                    var objj = {ID: form["FormID"],NAME: form["FormName"],PARENT_ID: screenID };
                    this.treeData.push(objj);

                    return new Promise((resolve, reject) => {
                      this.fetchService.getColumnNames(form["FormID"])
                        .subscribe(async (res) => {
                          var keys = [];

                          keys = res;

                          await Promise.all(keys.map(async (k) => {
                              if(k !== "Patient_ID_ID"){
                                var objj = {ID: k, NAME: k.split("_")[2], PARENT_ID: form["FormID"] };
                                this.treeData.push(objj);
                              }
                            })
                          );
                          resolve(this.treeData);
                        });
                    });
                  })
                );
                resolve(this.treeData);
              });
          });
        })
      ).then((res) => {
        this.show = true;
        this.activeTree = this.treeData;
      });
    }
    catch (error)
    {
      console.log(error);
    }
  }

  public collapseAll=true;
  public selectAll: boolean;

  click(node: any) {
    //console.log(node);
  }



  selected = new Map();
  formsinMap = new Set();

  async onChange(data)
  {
    var forms = data["CHILDREN"];
    //console.log(forms);

    await Promise.all(forms.map(async (f) => {
      return new Promise(async (resolve,reject) => {
        var cols = f["CHILDREN"];
        if(this.formsinMap.has(f["ID"]))
        {
            this.selected.delete(f["ID"]);
        }
        await Promise.all(cols.map(async (col) => {
          return new Promise((resolve,reject) => {
            
            if(col["isSelected"])
            {
              var temp = [];
  
              if(!this.selected.has(col["PARENT_ID"]))
              {
                temp.push(col["ID"]);
                this.selected.set(col["PARENT_ID"],temp);
                this.formsinMap.add(col["PARENT_ID"]);
              }
              else
              {
                temp = this.selected.get(col["PARENT_ID"]);
                temp.push(col["ID"]);
                this.selected.set(col["PARENT_ID"],temp);
              }
            }
            resolve(this.selected)
          })
          
        })) 

        resolve(this.selected)
      })
            
    })).then((res) => {
      console.log(this.selected);
    })
    
  }


  archived = [];
  getArchived()
  {
    this.fetchService.getArchived()
      .subscribe(async (res) => {

        this.archived = res;
        this.archiveTree = []; //Reset Tree

        await Promise.all(this.archived.map(async (arch) => {
          return new Promise(async (resolve,reject) => {
            var obj = {ID: arch["ScreenID"], NAME: arch["ScreenName"] };
            this.archiveTree.push(obj);
            resolve(this.archiveTree);
          })
        }))
        .then(async (res) => {
          await Promise.all(this.archived.map(async (arch) => {
            return new Promise(async (resolve,reject) => {
  
              var obj = {ID: arch["FormID"], NAME: arch["FormName"],PARENT_ID: arch["ScreenID"] };
              this.archiveTree.push(obj);

              resolve(this.archiveTree)
            })
          }))
          
          await Promise.all(this.archived.map(async (arch) => {
              return new Promise((resolve, reject) => {
                this.fetchService.getColumnNames(arch["FormID"])
                  .subscribe(async (ress) => {
                    var keys = [];
                    keys = ress;

                    await Promise.all(keys.map(async (k) => {
                        if(k !== "Patient_ID_ID"){
                          var objj = {ID: k, NAME: k.split("_")[2], PARENT_ID: arch["FormID"] };
                          this.archiveTree.push(objj);
                        }
                      })
                    );

                  });
                  resolve(this.archiveTree);
              })
            }))
            .then((res) => {
              console.log(this.archiveTree)
            })

        })

      });
  }





  results = {}; //For column names and Full Names
  patientsData = [];  //For Real Data

  dataSource = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  showTable()
  {
    try{
      if(this.selected.size > 0){
        this.patientsData = [];
        var strMap = JSON.stringify(Array.from(this.selected.entries()));
        this.fetchService.getTablesData(strMap)
        .subscribe((res) => {

        this.columns = [];
        this.tooltips = [];
        var keys = [];
              
        keys = Object.keys(res[0]);
        console.log(keys);
        keys.map((k) => {
          var arr = k.split("_");
          this.columns.push(arr[2]);
          this.tooltips.push(arr[0]+" / "+arr[1]); 
        })
        
        this.patientsData = res;

        this.dataSource = new MatTableDataSource<any>(this.patientsData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.results = {"columns":this.columns,"keys":keys,"tooltips":this.tooltips};
      });
    }
    else{
      this.dataSource = new MatTableDataSource<any>();
    }
    }
    catch(error)
    {
      alert(error);
    }
  }
}
