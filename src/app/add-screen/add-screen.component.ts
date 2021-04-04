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
    'screenname': '',
    'screenid': '',
    'adminid': '',
    'existForm':false,
    'existTable':false,
    'formName':'',
    'formNames':[],
    'forms':[]
  };

  prevScreenID = ""
  ngOnInit(): void {
    if(JSON.stringify(this.fetchService.screenData) !== '{}')
    {
      this.model.adminid = this.fetchService.screenData["adminid"];
    }
  }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL('img/png'));
  }

  FormTemplates():void
  {
    if(this.prevScreenID !== this.model.screenid && this.model.screenid !== '')
    {
      this.model.formNames = [];
      this.fetchService.getForm(this.model.screenid)
      .subscribe((res) => {
        
        res.map((data) => {
          this.model.formNames.push(data.FormName);
          this.model.forms.push(data);
        })

      });
    }
    if(this.model.screenid === '')
    {
      this.model.formNames = [];
      this.model.forms = [];
    }
      
    this.prevScreenID = this.model.screenid;
  }

  
  async nextPage(screenForm:NgForm) {
    this.fetchService.screenData = this.model;
    if(this.popup) {	
      this.newItemEvent.emit('close');	
    } else {	
      this.router.navigateByUrl('/createform');	
    }
    this.fetchService.screenData["existForm"] = false;
    swal("Please Add a Form")
    this.fetchService.sendAddScreenEvent(this.model["screenname"]);
  }

}
