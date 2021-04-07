import { Component, OnInit } from '@angular/core';
import { FetcherService } from '../fetcher.service';

@Component({
  selector: 'app-test-view',
  templateUrl: './test-view.component.html',
  styleUrls: ['./test-view.component.css']
})
export class TestViewComponent implements OnInit {

  constructor(private fetchService:FetcherService) { }

  screens = [];
  forms = [];
  isLinear = true;

  ngOnInit(): void {
    this.fetchService.getScreens()
    .subscribe((data) => {	
      this.screens = data;	
      var tempArray = [];	
      this.screens.forEach(obj => {	
        this.fetchService.getForm(obj.ScreenID).subscribe((forms) => {	
          forms.forEach(childobj => {	
            tempArray.push(childobj);	
          });
          this.forms = tempArray;
          	
        });	
      });		
    });	
  }

  consent = false;
  showFirstPage = true;
  signConsent()
  {
    this.consent = true;
    this.showFirstPage = false;
  }

}
