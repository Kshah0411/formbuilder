import { Component, OnInit,  Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FetcherService } from '../fetcher.service';
import {SignaturePad} from 'ngx-signaturepad';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-screen',
  templateUrl: './add-screen.component.html',
  styleUrls: ['./add-screen.component.css']
})
export class AddScreenComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter();	
  @Input('popup') popup: boolean = false;

  constructor(private router:Router,
    private fetchService:FetcherService) { }

  model: any = {
    'ScreenName': '',
    'ScreenID': '',
    'AdminID': '',
    'existForm':false,
    'existTable':false,
    'formName':'',
    'formNames':[],
    'forms':[]
  };
  formModel: any = {
    name: "Form name...",
    description: "Form Description...",
    theme: {
      bgColor: "ffffff",
      textColor: "555555",
      bannerImage: "",
    },
    attributes: '',
  };

  prevScreenID = ""
  ngOnInit(): void {
    if(JSON.stringify(this.fetchService.screenData) !== '{}')
    {
      this.model.AdminID = this.fetchService.screenData["AdminID"];
    }
  }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL('img/png'));
  }

  FormTemplates():void
  {
    if(this.prevScreenID !== this.model.ScreenID && this.model.ScreenID !== '')
    {
      this.model.formNames = [];
      this.fetchService.getForm(this.model.ScreenID)
      .subscribe((res) => {
        
        res.map((data) => {
          this.model.formNames.push(data.FormName);
          this.model.forms.push(data);
        })

      });
    }
    if(this.model.ScreenID === '')
    {
      this.model.formNames = [];
      this.model.forms = [];
    }
      
    this.prevScreenID = this.model.ScreenID;
  }

  
  async nextPage(screenForm:NgForm) {
    this.fetchService.screenData = this.model;
    this.fetchService.res = {"form":this.formModel,"screen":this.model};
    if(this.popup) {	
      this.newItemEvent.emit('close');	
    } else {	
      this.router.navigateByUrl('/createform');	
    }
    this.fetchService.screenData["existForm"] = false;
    swal("Please Add a Form")
    
    this.fetchService.sendAddScreenEvent(this.model.ScreenName);
  }

}
