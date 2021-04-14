import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import { AppRoutingModule, routingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditAppComponent } from './edit-app/edit-app.component';
import { DndModule } from 'ngx-drag-drop';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { DropAreaComponent } from './drop-area/drop-area.component';
import {FetcherService} from './fetcher.service'
import { HttpClientModule } from '@angular/common/http';
import { ViewFormComponent } from './view-form/view-form.component';
import { AddScreenComponent } from './add-screen/add-screen.component';
import { NotfoundComponent } from './notfound/notfound.component';
import {SignaturePadModule} from 'ngx-signaturepad';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestViewComponent } from './test-view/test-view.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatStepperModule} from '@angular/material/stepper';
import { ViewDataComponent } from './view-data/view-data.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatTableExporterModule } from 'mat-table-exporter';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTreeModule} from '@angular/material/tree';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';

import { DataComponent } from './data/data.component';
import { DataViewComponent } from './data-view/data-view.component';
import { TreeViewComponent } from './tree-view/tree-view.component';


const appRoutes: Routes = [
  { path: '', component: EditAppComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    EditAppComponent,
    DropAreaComponent,
    ViewFormComponent,
    routingComponent,
    AddScreenComponent,
    NotfoundComponent,
    TestViewComponent,
    ViewDataComponent,
    DataComponent,
    DataViewComponent,
    TreeViewComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    SweetAlert2Module.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DndModule,
    HttpClientModule,
    SignaturePadModule,
    NgbModule,
    NoopAnimationsModule,
    DragDropModule,
    MatStepperModule,MatTabsModule,MatButtonModule,MatAutocompleteModule, MatTableModule,
    MatSelectModule,MatFormFieldModule, MatPaginatorModule, MatInputModule, MatCheckboxModule,
    MatChipsModule,MatIconModule,MatSortModule, MatTooltipModule,MatTableExporterModule,MatMenuModule,
    MatSidenavModule,MatGridListModule, MatTreeModule,MatToolbarModule, MatExpansionModule,
  ],
  providers: [FetcherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
