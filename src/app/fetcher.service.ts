import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetcherService {
  public url = "http://localhost:3000/api";

  public screenData = {}
  public dropArr = [1]
  public model = {}
  public existingForms = false;
  public formNameFromAddScreen = "";
  public formsFromAddScreen = [];
  public formData: any;
  public formFields = [];

  constructor(private httpClient: HttpClient) { }

  private subject = new Subject<any>();
  private subject1 = new Subject<any>();
  sendFormClickEvent(form,screen) {
    this.subject1.next({form:form,screen:screen});
  }
  getFormClickEvent(): Observable<any>{ 
    return this.subject1.asObservable();
  }
  
  sendAddScreenEvent(screenName){
    this.subject.next(screenName);
  }
  getAddScreenEvent(): Observable<any>{ 
    return this.subject.asObservable();
  }

  //----------------------------- OLD SERVICES  -----------------

  // createDB(name)
  // {
  //   const body = {"orgName":name}
  //   return this.httpClient.post<any>(this.url+"/createDB",body)
  //       .pipe(retry(1), catchError(this.handleError));
  // }

  // async createScreen()
  // {
  //   const body={}
  //   return await this.httpClient.post<any>(this.url+"/createScreen",body)
  //     .pipe(retry(1), catchError(this.handleError));
  // }

  // public version = 1;
  // async postScreen(data)
  // {
  //   const body = {"version": this.version,"orgName":data.orgname,"orgID":data.adminid,"screenName":data.screenname,"screenID":data.screenid};
  //   return await this.httpClient.post<any>(this.url+"/postScreen",body)
  //       .pipe(retry(1),catchError(this.handleError));
  // }


  // async createMeta(formName)
  // {
  //   const body = {"formName":formName}
  //   return await this.httpClient.post<any>(this.url+"/createMeta",body)
  //     .pipe(retry(1),catchError(this.handleError));
  // }
  // async postMeta(formName,formVersion,formID,formJSON,screenID)
  // {
  //   const body = {"formName": formName,"formVersion":formVersion,"formID":formID,"formJSON":formJSON,"screenID":screenID};
  //   return await this.httpClient.post<any>(this.url+"/postMeta",body)
  //       .pipe(retry(1), catchError(this.handleError));
  // }

  // putMeta(dbName,formName,formID,formJSON)
  // {
  //   const body = {"dbName":dbName,"formName": formName,"formID":formID,"formJSON":formJSON};
  //   return this.httpClient.put<any>(this.url+"/putMeta",body)
  //       .pipe(retry(1), catchError(this.handleError));
  // }

  // getMeta(dbName,formName,screenID)
  // {
  //   return this.httpClient.get<any>(this.url+"/getMeta/"+dbName+"&"+formName+"&"+screenID)
  //       .pipe(retry(1), catchError(this.handleError));
  // }


  // async createForm(body)
  // {
  //   return await this.httpClient.post<any>(this.url+"/createForm",body)
  //     .pipe(retry(1),catchError(this.handleError));
  // }

  // postForm(body)
  // {
  //   return this.httpClient.post<any>(this.url+"/postForm",body)
  //     .pipe(catchError(this.handleError));
  // }

  // alterForm(body)
  // {
  //   return this.httpClient.post<any>(this.url+"/putCols",body)
  //     .pipe(catchError(this.handleError));
  // }
  
  // getForms(): Observable< any > {
  //   return new Observable(observer => {
  //     this.httpClient.get(this.url+"/getMeta")
  //       .subscribe(res => {
  //         observer.next( res);
  //       }, err => {
  //         observer.error(err);
  //       });
  //   });
  // }

  // putForms(model): Observable< any > {
    
  //   return new Observable(observer => {
  //     this.httpClient.post(this.url+"/postMeta/",model)
  //       .subscribe(res => {
  //         observer.next( res);
  //       }, err => {
  //         observer.error(err);
  //       });
  //   });
  // }




  //------------------- NEW Services for NEW Schema -----------------

  postScreen(data, Display, Modified)
  {
    const body = {"ScreenID":data.screenid,"ScreenName":data.screenname,
      "CreatedBy":data.adminid, "Display":Display, "Modified":Modified, "OrderNo":data.OrderNo};
    return this.httpClient.post<any>(this.url+"/postScreen",body)
        .pipe(catchError(this.handleError));
  }

  getScreens()
  {
    return this.httpClient.get<any>(this.url+"/getScreens")
    .pipe(catchError(this.handleError));
  }

  setScreenOrder(OrderNo,ScreenID)	
  {	
    const body = {"OrderNo":OrderNo,"ScreenID":ScreenID};	
    return this.httpClient.post<any>(this.url+"/setScreenOrder",body)
    .pipe(catchError(this.handleError));	
  }

  postScreenForm(ScreenFormID,ScreenID, FormName,FormDesc)
  {
    const body = {"ScreenFormID":ScreenFormID,"ScreenID":ScreenID,"FormName":FormName, "FormDesc":FormDesc};
    return this.httpClient.post<any>(this.url+"/postScreenForm",body)
        .pipe(catchError(this.handleError));
  }

  getScreenForms(ScreenID)
  {
    const body = {"ScreenID":ScreenID};
    return this.httpClient.post<any>(this.url+"/getScreenForms",body)
        .pipe(catchError(this.handleError));
  }

  postScreenFormMod(ScreenID,FormIDAdded, FormIDDeleted,ScreenIDOriginal)
  {
    const body = {"ScreenID":ScreenID,"FormIDAdded":FormIDAdded,
      "FormIDDeleted":FormIDDeleted,"ScreenIDOriginal":ScreenIDOriginal };
    return this.httpClient.post<any>(this.url+"/postScreenFormMod",body)
        .pipe(catchError(this.handleError));
  }

  postForm(FormID,FormName,AdminID,Display,Modified)
  {
    const body = {"FormID":FormID,"FormName":FormName, "AdminID":AdminID,
      "Display":Display,"Modified":Modified};
    return this.httpClient.post<any>(this.url+"/postForm",body)
        .pipe(catchError(this.handleError));
  }

  modifyForm(FormID,Modified)
  {
    const body = {"FormID":FormID,"Modified":Modified};
    return this.httpClient.post<any>(this.url+"/modifyForm",body)
        .pipe(catchError(this.handleError));
  }

  getForm(ScreenID)
  {
    const body = {"ScreenID":ScreenID};
    return this.httpClient.post<any>(this.url+"/getForm",body)
        .pipe(catchError(this.handleError));
  }

  postFormField(FieldID, Label,FormID, FieldJSON,Row)
  {
    const body = {"FieldID":FieldID, "Label":Label,"FormID":FormID,"FieldJSON":FieldJSON,"Row":Row};
    return this.httpClient.post<any>(this.url+"/postFormField",body)
        .pipe(catchError(this.handleError));
  }

  getFormFields(FormID)
  {
    const body = {"FormID":FormID};
    return this.httpClient.post<any>(this.url+"/getFormFields",body)
        .pipe(catchError(this.handleError));
  }

  
  updateFormField(FormID,FieldID,FieldJSON)
  {
    const body = {"FieldID":FieldID,"FormID":FormID,"FieldJSON":FieldJSON};
    //console.log(body);
    return this.httpClient.post<any>(this.url+"/updateFormField",body)
        .pipe(catchError(this.handleError));
  }

  postFormFieldMod(FormID, FormFieldIDAdded, FormFieldIDDeleted, FormIDOriginal)
  {
    const body = {"FormID":FormID,"FormFieldIDAdded":FormFieldIDAdded,
      "FormFieldIDDeleted":FormFieldIDDeleted, "FormIDOriginal":FormIDOriginal};
    return this.httpClient.post<any>(this.url+"/postFormFieldMod",body)
        .pipe(catchError(this.handleError));
  }

  postFormDSD(FormID, DSDName)
  {
    const body = {"FormID":FormID,"DSDName":DSDName};
    return this.httpClient.post<any>(this.url+"/postFormDSD",body)
        .pipe(catchError(this.handleError));
  }

  getFormDSD(FormID)
  {
    const body = {"FormID":FormID};
    return this.httpClient.post<any>(this.url+"/getFormDSD",body)
        .pipe(catchError(this.handleError));
  }

  createDynamicTable(TableName,Labels)
  {
    const body = {"TableName":TableName,"Labels":Labels};
    return this.httpClient.post<any>(this.url+"/createDynamicTable",body)
      .pipe(catchError(this.handleError));
  }

  postDynamicTable(TableName,Labels,Values)
  {
    const body = {"TableName":TableName,"Labels":Labels,"Values" :Values};
    return this.httpClient.post<any>(this.url+"/postDynamicTable",body)
      .pipe(catchError(this.handleError));
  }

  alterDynamicTable(TableName,Labels)
  {
    const body = {"TableName":TableName,"Labels":Labels};
    return this.httpClient.post<any>(this.url+"/alterDynamicTable",body)
      .pipe(catchError(this.handleError));
  }

  getDSDData(TableName)
  {
    const body = {"TableName":TableName};
    return this.httpClient.post<any>(this.url+"/getDSDData",body)
      .pipe(catchError(this.handleError));
  }

  joinTables(ScreenID,FormID)
  {
    const body = {"ScreenID":ScreenID,"FormID":FormID};
    return this.httpClient.post<any>(this.url+"/joinTables",body)
      .pipe(catchError(this.handleError));
  }

  postArchived(ScreenID,FormID,DSDName)
  {
    const body = {"ScreenID":ScreenID,"FormID":FormID,"DSDName":DSDName};
    return this.httpClient.post<any>(this.url+"/postArchived",body)
      .pipe(catchError(this.handleError));
  }

  getArchived()
  {
    return this.httpClient.get<any>(this.url+"/getArchived")
      .pipe(catchError(this.handleError));
  }

  // deleteFormID(FormID)
  // {
  //   const body = {"FormID":FormID};
  //   return this.httpClient.post<any>(this.url+"/deleteFormID",body)
  //       .pipe(catchError(this.handleError)); 
  // }

  DropTable(TableName)
  {
    const body = {"TableName":TableName};
    return this.httpClient.post<any>(this.url+"/DropTable",body)
      .pipe(catchError(this.handleError));
  }

  //---------------------------- Handle errors for API calls -----------------
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
 }
}
