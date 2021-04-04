import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.css']
})
export class ViewDataComponent implements OnInit {

  formControl = new FormControl();
  screenControl = new FormControl();
  forms: string[] = ['form1', 'form2', 'form3'];
  screens: string[] = ['screen1', 'screen2', 'screen3'];
  filteredOptions: Observable<string[]>;
  screenOptions: Observable<string[]>;
  checked = false;
  c_value: string;
  chipValues: string[] = [];
  visible = true;
  selectable = true;
  removable = true;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value,'F'))
    );
    this.screenOptions = this.screenControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value,'S'))
    );
  }

  private _filter(value: string, key: string): string[] {
    const filterValue = value.toLowerCase();
    if (key === 'S') {
      return this.screens.filter(screen => screen.toLowerCase().indexOf(filterValue) === 0);
    } else {
      return this.forms.filter(form => form.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  addTable(){
    this.c_value = this.screenControl.value+"/"+this.formControl.value
    console.log(this.c_value)

    // Add our chip
    this.chipValues.push(this.c_value)

    //Reset input 
    this.screenControl.setValue('');
    this.formControl.setValue('');
  }
  constructor() {
    
  }

  remove(chipValue: string): void {
    const index = this.chipValues.indexOf(chipValue);

    if (index >= 0) {
      this.chipValues.splice(index, 1);
    }
  }
}
