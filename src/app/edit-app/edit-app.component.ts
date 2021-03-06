import { Component, ElementRef, Input, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { field, value } from '../global.model';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import {FetcherService} from '../fetcher.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class EditAppComponent implements OnInit {
  report: boolean = false;
  value:value={
    label:"",
    value:""
  };
  success = false;
  dropArr = [1];
  step : number = 1;
  step1class : string = '';
  step2class : string = '';
  step3class : string = '';
  step4class : string = 'col-2';
  screen: any;
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  goBack()
  {
    this.step = 1;
  }
  
  fieldModels:Array<field>=[
    {
      "type": "text",
      "icon": "fa-font",
      "label": "Text",
      "description": "Enter your name",
      "placeholder": "Enter your name",
      "className": "form-control",
      "subtype": "text",
      "regex" : "",
      "handle":true
    },
    {
      "type": "email",
      "icon": "fa-envelope",
      "required": true,
      "label": "Email",
      "description": "Enter your email",
      "placeholder": "Enter your email",
      "className": "form-control",
      "subtype": "text",
      "regex" : "^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\.([a-zA-Z]{2,5})$",
      "errorText": "Please enter a valid email",
      "handle":true
    },
    {
      "type": "phone",
      "icon": "fa-phone",
      "label": "Phone",
      "description": "Enter your phone",
      "placeholder": "Enter your phone",
      "className": "form-control",
      "subtype": "text",
      "regex" : "^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$",
      "errorText": "Please enter a valid phone number",
      "handle":true
    },
    {
      "type": "number",
      "label": "Number",
      "icon": "fa-html5",
      "description": "Age",
      "placeholder": "Enter your age",
      "className": "form-control",
      "value": "20",
      "min": 12,
      "max": 90
    },
    {
      "type": "date",
      "icon":"fa-calendar",
      "label": "Date",
      "placeholder": "Date",
      "className": "form-control"
    },
    {
      "type": "datetime-local",
      "icon":"fa-calendar",
      "label": "DateTime",
      "placeholder": "Date Time",
      "className": "form-control"
    },
    {
      "type": "textarea",
      "icon":"fa-text-width",
      "label": "Textarea" 
    },
    {
      "type": "paragraph",
      "icon": "fa-paragraph",
      "label": "Paragraph",
      "placeholder": "Type your text to display here only" 
    },
    {
      "type": "checkbox",
      "required": true,
      "label": "Checkbox",
      "icon":"fa-list",
      "description": "Checkbox",
      "inline": true,
      "values": [
        {
          "label": "Option 1",
          "value": "option-1"
        },
        {
          "label": "Option 2",
          "value": "option-2"
        }
      ]
    },
    {
      "type": "radio",
      "icon":"fa-list-ul",
      "label": "Radio",
      "description": "Radio boxes",
      "values": [
        {
          "label": "Option 1",
          "value": "option-1"
        },
        {
          "label": "Option 2",
          "value": "option-2"
        }
      ]
    },
    {
      "type": "autocomplete",
      "icon":"fa-bars",
      "label": "Select",
      "description": "Select",
      "placeholder": "Select",
      "className": "form-control",
      "values": [
        {
          "label": "Option 1",
          "value": "option-1"
        },
        {
          "label": "Option 2",
          "value": "option-2"
        },
        {
          "label": "Option 3",
          "value": "option-3"
        }
      ]
    },
    {
      "type": "file",
      "icon":"fa-file",
      "label": "File Upload",
      "className": "form-control",
      "subtype": "file"
    },
    {
      "type": "button",
      "icon":"fa-paper-plane",
      "subtype": "submit",
      "label": "Submit"
    },
    {
      "type": "signature",
      "icon": "fa-pencil",
      "label": "Signature",
    }
  ];

  modelFields:Array<field>=[];
  model:any = {
    name:'Form name...',
    description:'Form Description...',
    theme:{
      bgColor:"ffffff",
      textColor:"555555",
      bannerImage:""
    },
    attributes:this.modelFields
  };

  @ViewChild('content', { static: true }) myModal: ElementRef;	
  getScreens: any;	
  getForms: any;	
  viewForm: boolean = true;	
  formFields: any;	
  editForm: any;	
  popup: boolean = false;

  constructor(
    private route:ActivatedRoute, private fetchService: FetcherService,
    private router:Router,config: NgbModalConfig, private modalService: NgbModal
  )
  {	
    config.backdrop = 'static';	
    config.keyboard = false;	
  }	
  openPopup(content) {	
    this.popup = true;	
    this.modalService.open(content);	
  }	
  closePopup(data) {	
    this.modalService.dismissAll();	
    this.getForms = [];
    this.screen = this.fetchService.screenData;
    this.showStep2(this.screen);
  }

 
  addForm() {
      this.dropArr.push(this.dropArr.length + 1);
      this.fetchService.dropArr = this.dropArr;
  }

  onDragover(event:DragEvent) {
    console.log("dragover", JSON.stringify(event, null, 2));
  }
  
   // onDrop( event:DndDropEvent, list?:any[] ) {	
    // const index = this.getScreens.findIndex(item => {	
    //   return (item.ScreenID == event.data.ScreenID && item.Date == event.data.Date)	
    // });	
    // this.getScreens.splice(index, 1);	
    // this.getScreens = this.getScreens;	
  // }

  onDragStart(event:DragEvent) {
    console.log("drag started", JSON.stringify(event, null, 2));
  }
  
  onDragEnd(event:DragEvent) {
    console.log("drag ended", JSON.stringify(event, null, 2));
  }
  
  onDraggableCopied(event:DragEvent) {
    console.log("draggable copied", JSON.stringify(event, null, 2));
  }
  
  onDraggableLinked(event:DragEvent) {
    console.log("draggable linked", JSON.stringify(event, null, 2));
  }
    
   //  onDragged( item:any, list:any[], effect:DropEffect ) {	
  //   if( effect === "move" ) {	
  //     const index = list.indexOf( item );	
  //     list.splice( index, 1 );	
  //   }	
  // }
      
  onDragCanceled(event:DragEvent) {
    console.log("drag cancelled", JSON.stringify(event, null, 2));
  }

  removeField(i){
    swal({
      title: 'Are you sure?',
      text: "Do you want to remove this field?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then((result) => {
      if (result.value) {
        this.model.attributes.splice(i,1);
      }
    });
  }

  ngOnInit() {
    this.fetchService.dropArr = this.dropArr;
    this.getScreensData();
  }

  getScreensData() {	
    this.fetchService.getScreens().subscribe((data) => {	
      this.getScreens = data;	
      		
    });	
    
  }	


  getFormData(screen){
    this.getForms = [];
    this.fetchService.getForm(screen.ScreenID).subscribe((forms) => {
      var tempArray = [];		
      forms.forEach(childobj => {	
        tempArray.push(childobj);	
      });
      this.getForms = tempArray;
      this.showStep2(screen);
    });	
  }

  showStep2(screen){
    this.step = 2;
    this.screen = [];
    this.screen = screen;
    // this.step1class = 'col-4';
    // this.step2class = 'col-3';
    this.step3class = '';
    this.step4class = '';
  }
  	
  formStatus(status){	
    this.viewForm = status;	
    // this.showStep4();
  }

  // showStep4(){	
  //   this.step = 4;
  //   // this.step1class = 'col-2';
  //   this.step2class = 'col-3';
  //   this.step3class = 'col-7';
  //   this.step4class = 'col-2';
  // }

  formDisplay(form, screen) {	
    this.fetchService.sendFormClickEvent(form,screen);
    this.viewForm = true;
    this.fetchService.res = {"form":form,"screen":screen};
    this.showStep3();
  }	
	
  showStep3(){
    this.step = 3;
    // this.step1class = 'col-2';
    // this.step2class = 'col-3';
    // this.step3class = 'col-9';
  }

  addScreenForm() {	
    swal("New Form in the '"+this.screen.ScreenID+"' Page");
    var model = {	
      'ScreenName': this.screen.ScreenName,	
      'ScreenID': this.screen.ScreenID,	
      'existForm': false,	
      'existTable': false,	
      'formName': '',	
      'formNames': [],	
      'forms': []	
    };	

    //If it comes from New Screen button, it will have AdminID property, or else CreatedBy property
    if(Object.prototype.hasOwnProperty.call(this.screen, "AdminID"))
    {
      model['AdminID'] = this.screen.AdminID;
    }
    else
    {
      model['AdminID'] = this.screen.CreatedBy;
    }

    this.fetchService.screenData = model;	
    this.fetchService.res = {"form":{},"screen":{}};
    this.fetchService.sendFormClickEvent({},{});
    this.viewForm = false;
    this.showStep3();
    // this.showStep4();
  }
  
  
  onDragged( item:any, list:any[] ) {	
    const index = list.indexOf( item );	
    list.splice( index, 1 );	
  }	
  onDrop( event:DndDropEvent, list:any[] ) {	
    let index = event.index;	
    if( typeof index === "undefined" ) {	
      index = list.length;	
    }	
    list.splice( index, 0, event.data );	
    //console.log(this.getScreens);	
    this.fetchService.setScreenOrder((index+1), event.data.ScreenID).subscribe((res) => {	
      console.log(res);	
    });		
  }
  

}
