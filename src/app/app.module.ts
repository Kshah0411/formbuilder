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
import { DragDropModule } from '@angular/cdk/drag-drop';

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
    TestViewComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    SweetAlert2Module.forRoot(),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DndModule,
    HttpClientModule,
    SignaturePadModule,
    NgbModule,
    NoopAnimationsModule,
    MatStepperModule,
    DragDropModule
  ],
  providers: [FetcherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
