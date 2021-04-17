import { Component, OnInit, Input, ViewChild, Output, EventEmitter} from "@angular/core";
import { DndDropEvent, DropEffect } from "ngx-drag-drop";
import { field, value } from "../global.model";
import swal from "sweetalert2";
import { FetcherService } from "../fetcher.service";
import { SignaturePad } from "ngx-signaturepad";
import * as _ from 'lodash/fp';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-drop-area",
  templateUrl: "./drop-area.component.html",
  styleUrls: ["./drop-area.component.css"],
})
export class DropAreaComponent implements OnInit {
  
  clickFormViewsubscription:Subscription;
  clickAddScreensubscription:Subscription;

  breadCrumbScreen = ''
  breadCrumbForm = ''

  constructor(private fetchService: FetcherService) 
  {
    this.clickAddScreensubscription = this.fetchService.getAddScreenEvent()
    .subscribe((res) => {
      this.breadCrumbScreen = res;
      this.ngOnInit();
    })
    
    this.clickFormViewsubscription = this.fetchService.getFormClickEvent()
    .subscribe((res)=>{

      if(JSON.stringify(res["form"]) !== "{}"){
        this.breadCrumbScreen = res["screen"]["ScreenName"];
        this.breadCrumbForm = res["form"]["FormName"];

        this.fetchService.screenData["existForm"] = true;
        this.formDisplay(res["form"],res["screen"]);
      }
      else{
        this.breadCrumbScreen = '';
        this.breadCrumbForm = '';
        this.model.name = "Form name...";
        this.model.description = "Form Description...";
        this.model.attributes = [];
        this.fetchService.screenData["existForm"] = false;
      }
    })
  }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  private signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 500,
    canvasHeight: 100,
    backgroundColor: "#FFFF88",
  };

  ngAfterViewInit() {
    // this.signaturePad is now available
    // this.signaturePad.set("minWidth", 5); // set szimek/signature_pad options at runtime
    // this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL("image/png"));
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log("begin drawing");
  }

  @Input() indexval: number;
  @Input() viewForm: boolean;
  @Output() newItemEvent = new EventEmitter();

  value: value = {
    label: "",
    value: "",
  };
  success = false;
  report: boolean = false;
  fieldModels: Array<field> = [
    {
      type: "text",
      icon: "fa-font",
      label: "Text",
      description: "Enter your name",
      placeholder: "Enter your name",
      className: "form-control",
      subtype: "text",
      regex: "",
      handle: true,
    },
    {
      type: "email",
      icon: "fa-envelope",
      required: true,
      label: "Email",
      description: "Enter your email",
      placeholder: "Enter your email",
      className: "form-control",
      subtype: "text",
      regex: "^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+).([a-zA-Z]{2,5})$",
      errorText: "Please enter a valid email",
      handle: true,
    },
    {
      type: "phone",
      icon: "fa-phone",
      label: "Phone",
      description: "Enter your phone",
      placeholder: "Enter your phone",
      className: "form-control",
      subtype: "text",
      regex: "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$",
      errorText: "Please enter a valid phone number",
      handle: true,
    },
    {
      type: "number",
      label: "Number",
      icon: "fa-html5",
      description: "Age",
      placeholder: "Enter your age",
      className: "form-control",
      value: "20",
      min: 12,
      max: 90,
    },
    {
      type: "date",
      icon: "fa-calendar",
      label: "Date",
      placeholder: "Date",
      className: "form-control",
    },
    {
      type: "datetime-local",
      icon: "fa-calendar",
      label: "DateTime",
      placeholder: "Date Time",
      className: "form-control",
    },
    {
      type: "textarea",
      icon: "fa-text-width",
      label: "Textarea",
    },
    {
      type: "paragraph",
      icon: "fa-paragraph",
      label: "Paragraph",
      placeholder: "Type your text to display here only",
    },
    {
      type: "checkbox",
      required: true,
      label: "Checkbox",
      icon: "fa-list",
      description: "Checkbox",
      inline: true,
      values: [
        {
          label: "Option 1",
          value: "option-1",
        },
        {
          label: "Option 2",
          value: "option-2",
        },
      ],
    },
    {
      type: "radio",
      icon: "fa-list-ul",
      label: "Radio",
      description: "Radio boxes",
      values: [
        {
          label: "Option 1",
          value: "option-1",
        },
        {
          label: "Option 2",
          value: "option-2",
        },
      ],
    },
    {
      type: "autocomplete",
      icon: "fa-bars",
      label: "Select",
      description: "Select",
      placeholder: "Select",
      className: "form-control",
      values: [
        {
          label: "Option 1",
          value: "option-1",
        },
        {
          label: "Option 2",
          value: "option-2",
        },
        {
          label: "Option 3",
          value: "option-3",
        },
      ],
    },
    {
      type: "file",
      icon: "fa-file",
      label: "File Upload",
      className: "form-control",
      subtype: "file",
    },
    {
      type: "button",
      icon: "fa-paper-plane",
      subtype: "submit",
      label: "Submit",
    },
    {
      type: "signature",
      icon: "fa-signature",
      label: "Signature",
    },
  ];
  modelFields: Array<field> = [];
  model: any = {
    name: "Form name...",
    description: "Form Description...",
    theme: {
      bgColor: "ffffff",
      textColor: "555555",
      bannerImage: "",
    },
    attributes: this.modelFields,
  };

  onDragover(event: DragEvent) {
    console.log("dragover", JSON.stringify(event, null, 2));
  }

  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === "copy" || event.dropEffect === "move")) {
      if (event.dropEffect === "copy")
        event.data.name = event.data.type + "-" + new Date().getTime();
      let index = event.index;
      if (typeof index === "undefined") {
        index = list.length;
      }
      list.splice(index, 0, event.data);
    }
  }
  onDragStart(event: DragEvent) {
    console.log("drag started", JSON.stringify(event, null, 2));
  }

  onDragEnd(event: DragEvent) {
    console.log("drag ended", JSON.stringify(event, null, 2));
  }

  onDraggableCopied(event: DragEvent) {
    console.log("draggable copied", JSON.stringify(event, null, 2));
  }

  onDraggableLinked(event: DragEvent) {
    console.log("draggable linked", JSON.stringify(event, null, 2));
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    if (effect === "move") {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDragCanceled(event: DragEvent) {
    console.log("drag cancelled", JSON.stringify(event, null, 2));
  }

  removeField(i) {
    swal({
      title: "Are you sure?",
      text: "Do you want to remove this field?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00B96F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove!",
    }).then((result) => {
      if (result.value) {
        this.model.attributes.splice(i, 1);
      }
    });
  }

  //@Input() sendIndex:number;

  deleteForm(i) {
    console.log(this.fetchService.dropArr);
    this.fetchService.dropArr.splice(i - 1, 1);
    if (this.fetchService.dropArr.length == 1) this.fetchService.dropArr = [];
  }

  updateForm() {
    let input = new FormData();
    input.append("id", this.model._id);
    input.append("name", this.model.name);
    input.append("description", this.model.description);
    input.append("bannerImage", this.model.theme.bannerImage);
    input.append("bgColor", this.model.theme.bgColor);
    input.append("textColor", this.model.theme.textColor);
    input.append("attributes", JSON.stringify(this.model.attributes));
  }

  initReport() {
    this.report = true;
    let input = {
      id: this.model._id,
    };
  }

  ngOnDestroy(){
    this.clickFormViewsubscription.unsubscribe();
  }

  ngOnInit() {
    console.log("in ngOnINit");

    // if (this.fetchService.res["screen"].existForm) {
    //   this.fetchService.model = this.model;
    // }
    // else{
    //   this.model = this.fetchService.res["form"];
    // }
    if(JSON.stringify(this.fetchService.res["form"]) !== "{}"){
      this.breadCrumbScreen = this.fetchService.res["screen"]["ScreenName"];
      this.breadCrumbForm = this.fetchService.res["form"]["FormName"];

      this.fetchService.screenData["existForm"] = true;
      this.formDisplay(this.fetchService.res["form"],this.fetchService.res["screen"]);
    }
    else{
      this.breadCrumbScreen = '';
      this.breadCrumbForm = '';
      this.model.name = "Form name...";
      this.model.description = "Form Description...";
      this.model.attributes = [];
      this.fetchService.screenData["existForm"] = false;
    }

    if(this.fetchService.formFields.length > 0)
      this.model.attributes = this.fetchService.formFields;
    
  }


  //Getting called from Edit Component & getting click event in this constructor using Subscription
  formDisplay(form, screen) {	
    var model = {	
      'ScreenName': screen.ScreenName,	
      'ScreenID': screen.ScreenID,	
      'AdminID': screen.CreatedBy,	
      'existForm': true,	
      'existTable': true,	
      'formName': form.FormName,	
      'formNames': [],	
      'forms': [form]	
    };
    //console.log(model)
    this.fetchService.formData = form;	
    this.fetchService.screenData = model;	
    var fieldsArr = []
    this.fetchService.getFormFields(form["FormID"])
      .subscribe((fields) =>
      {
        for (var i = 0; i < fields.length; i++)
        {
          fieldsArr.push(JSON.parse(fields[i].FieldJSON));
        }
        this.model.attributes = fieldsArr;
      });
      this.model.name = model["formName"];
      this.model.description = form["FormDesc"];
  }	

  editForm()
  {
    this.viewForm = false;
    this.newItemEvent.emit(this.viewForm);
  }

  toggleValue(item) {
    item.selected = !item.selected;
  }

  deleteOption() {
    swal({
      title: "Delete Form?",
      text: "Do you want to Remove this Form from this Page?",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#00B96F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.value) {

          for (var i = 0;i < this.fetchService.screenData["forms"].length;i++)
              {
                if (this.fetchService.screenData["formName"] === 
                this.fetchService.screenData["forms"][i].FormName) 
                {
                  this.fetchService.getFormDSD(this.fetchService.screenData["forms"][i].ScreenFormID)
                    .subscribe((ress) => {

                      this.fetchService.postArchived(this.fetchService.screenData["ScreenID"],this.fetchService.screenData["forms"][i].ScreenFormID,ress[0].DSDName)
                      .subscribe((res) => {
                        console.log(res);

                        this.fetchService.modifyForm(this.fetchService.screenData["forms"][i].ScreenFormID,"Yes")
                           .subscribe((res) => {
                            console.log(res);
                          });
                      })

                    });
                    break;
                }
              }
              swal('Deleted!','Your Form has been Removed.','success');

          this.model.name = "Form name...";
          this.model.description = "Form Description...";
          this.model.attributes = [];
      }
    });
  }

  submit() {
    let valid = true;
    let validationArray = JSON.parse(JSON.stringify(this.model.attributes));
    validationArray.reverse().forEach((field) => {
      console.log(field.label + "=>" + field.required + "=>" + field.value);
      if (field.required && !field.value && field.type != "checkbox") {
        swal("Error", "Please enter " + field.label, "error");
        valid = false;
        return false;
      }
      if (field.required && field.regex) {
        let regex = new RegExp(field.regex);
        if (regex.test(field.value) == false) {
          swal("Error", field.errorText, "error");
          valid = false;
          return false;
        }
      }
      if (field.required && field.type == "checkbox") {
        if (field.values.filter((r) => r.selected).length == 0) {
          swal("Error", "Please enterrr " + field.label, "error");
          valid = false;
          return false;
        }
      }
    });
    if (!valid) {
      return false;
    }
    console.log("Save", this.model);
    let input = new FormData();
    input.append("formId", this.model._id);
    input.append("attributes", JSON.stringify(this.model.attributes));

  }

  addValue(values) {
    values.push(this.value);
    this.value = { label: "", value: "" };
  }
  
  fieldsArr = [];
  existingFormid:string = '';
  formFieldsOnly:boolean = false;
  newFormID:string = '';


  async saveForm() {

    if(JSON.stringify(this.fetchService.res["form"]) !== "{}" && this.fetchService.screenData["existForm"]){
      this.fetchService.screenData["existForm"] = true;
      await swal({
        title: "Do you want to use the Existing Dynamic Table to Store Form Data?",
        text: "Select an option",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00B96F",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText:"No",
      }).then((res) => {
        if(res.value)
        {
          this.fetchService.screenData["existTable"] = true;
        }
        else
        {
          this.fetchService.screenData["existTable"] = false;
        }
      });
    }

    //Form ID generator
    var date = new Date();
    this.newFormID =
      ("00" + (date.getMonth() + 1)).slice(-2) + "" +
      ("00" + date.getDate()).slice(-2) + "" + date.getFullYear() + "_" +
      ("00" + date.getHours()).slice(-2) + "" +
      ("00" + date.getMinutes()).slice(-2) + "" +
      ("00" + date.getSeconds()).slice(-2);
    
    console.log(this.newFormID);

    //If not existing form, then post screen data
    if (this.fetchService.screenData["existForm"])
    {
          for (var i = 0; i < this.fetchService.screenData["forms"].length; i++) {
          if (this.fetchService.screenData["formName"] === this.fetchService.screenData["forms"][i].FormName)
          {
            this.existingFormid = this.fetchService.screenData["forms"][i].ScreenFormID;
              console.log(this.existingFormid);
              this.fetchService.getFormFields(this.existingFormid)
              .subscribe((fields) => {
                
                for(var i=0;i<fields.length;i++)
                {
                  this.fieldsArr.push(JSON.parse(fields[i].FieldJSON));
                }

                //To check if we add extra fields by removing old fields
                var fieldsCountOnScreen = 0;
                for(var i=0;i<this.fieldsArr.length;i++)
                {
                  for(var j = 0;j<this.model.attributes.length;j++)
                  {
                    if(this.model.attributes[j].name === this.fieldsArr[i].name)
                    {
                      fieldsCountOnScreen++;
                    }
                  }
                }
                
                if(this.fieldsArr.length === this.model.attributes.length && 
                  fieldsCountOnScreen === this.model.attributes.length)
                {
                  this.formFieldsOnly = true;
                }
                console.log(this.formFieldsOnly);
                     
                //If Form Fields Only modified, Update JSON only in Form Field Table
                if(this.formFieldsOnly)
                {
                  console.log(this.formFieldsOnly);
                  for(var i=0;i<this.fieldsArr.length;i++)
                  {
                    for(var j = 0;j<this.model.attributes.length;j++)
                    {
                      if(this.model.attributes[j].name === this.fieldsArr[i].name)
                      {
                        if(_.equals(this.model.attributes[i],this.fieldsArr[i]) === false)
                        {
                          this.fetchService.updateFormField(this.existingFormid,this.model.attributes[i].name,JSON.stringify(this.model.attributes[i]))
                          .subscribe((res) => {
                            console.log(res);
                            swal({
                              title: "Saving Form Fields Modifications",
                              type: "info",
                              showCancelButton: false,
                              confirmButtonColor: "#00B96F",
                              confirmButtonText: "OK",
                            }).then((res) => {
                              setTimeout(function () {
                                //location.reload();
                              }, 1500);
                            })
                          });
                        }
                      }
                    }
                  }
                }
                else
                {
                  this.postForm();
                }
              });
            break;
          }
        }
         
    }
    else
    {
      this.fetchService.getScreens().subscribe((data) => {
        var screens = []	
        data.forEach(obj => {	
          screens.push(obj.ScreenID);
        });	

        if(screens.includes(this.fetchService.screenData["ScreenID"]))
        {
          this.postForm();
        }
        else
        {
          this.fetchService.screenData["OrderNo"] = screens.length + 1;
          console.log(this.fetchService.res)
          this.fetchService.postScreen(this.fetchService.screenData, "Yes", "No")
            .subscribe((data: {}) => {
              console.log(data);

              this.postForm();
          });
        }
      });
           
    }
    this.viewForm = true;
  }

  async postForm()
  {
    //Post Screen Form and Form Fields
    if (this.fetchService.screenData["existForm"])
    {
      this.fetchService.modifyForm(this.existingFormid,"Yes")
          .subscribe((res) => {
            console.log(res);
      });
    }
    this.fetchService.postScreenForm(this.newFormID,this.fetchService.screenData["ScreenID"],this.model.name,this.model.description)
    .subscribe((data: {}) => {
      console.log(data);

      this.fetchService.postForm(this.newFormID,this.model.name,this.fetchService.screenData["AdminID"],"Yes","No")
        .subscribe((data: {}) => {
          console.log(data);

          for (var i = 0; i < this.model.attributes.length; i++)
          {
            this.fetchService.postFormField(this.model.attributes[i].name,this.model.attributes[i].label,this.newFormID,JSON.stringify(this.model.attributes[i]),i)
              .subscribe((data: {}) => {
                console.log(data);
              });
          }

          var attr = this.model.attributes;
          var labels = [];
          for (var i = 0; i < attr.length; i++)
          {
            if (!this.model.attributes[i].name.includes("button"))
              labels.push(this.model.attributes[i].label.replace(/\s+/g, "_"));
          }

          //If Existing Table, then Update < NewFormID, DynamicTable > Mapping and Alter Table

          if (this.fetchService.screenData["existTable"])
          {
            this.fetchService.getFormDSD(this.existingFormid)
            .subscribe((ress) => {

              this.fetchService.postFormDSD(this.newFormID, ress[0].DSDName)
                .subscribe((data: {}) => {
                  console.log(data);
              });

              for(var i=0;i<labels.length;i++){
                labels[i] = this.fetchService.screenData["ScreenName"]+"_"+this.model.name.replace(/\s+/g, "_")+"_"+labels[i];
              }

              this.fetchService.alterDynamicTable(ress[0].DSDName, labels)
                .subscribe((res) => {
                  swal({
                    title: "Form is Saving",
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#00B96F",
                    confirmButtonText: "OK",
                  }).then((res) => {
                      setTimeout(function () {
                        //location.reload();
                      },1500);
                  })
                  
                  console.log(res);
              });

            });
          }
          else
          {
            //Else create New Dynamic table name and mapping
            var dynamictable = "D_" + this.model.name.replace(/\s+/g, "_") + "_" + this.newFormID;

            this.fetchService.postFormDSD(this.newFormID, dynamictable)
              .subscribe((data: {}) => {
                console.log(data);
              });

              for(var i=0;i<labels.length;i++){
                labels[i] = this.fetchService.screenData["ScreenName"]+"_"+this.model.name.replace(/\s+/g, "_")+"_"+labels[i];
              }

            this.fetchService.createDynamicTable(dynamictable, labels)
              .subscribe((data: {}) => {
                console.log(data);

                swal({
                  title: "Form is Saving",
                  type: "info",
                  showCancelButton: false,
                  confirmButtonColor: "#00B96F",
                  confirmButtonText: "OK",
                }).then((res) => {
                    setTimeout(function () {
                      //location.reload();
                    }, 1500);
                })
              });
          }

          this.fetchService.model = this.model;
          

        });
    }); 

  }

}
