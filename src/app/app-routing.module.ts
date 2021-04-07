import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddScreenComponent } from './add-screen/add-screen.component';
import { EditAppComponent } from './edit-app/edit-app.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { TestViewComponent } from './test-view/test-view.component';
import { ViewDataComponent } from './view-data/view-data.component';
import { ViewFormComponent } from './view-form/view-form.component';


const routes: Routes = [
  {path: '', component: EditAppComponent},
  {path: 'viewform', component: ViewFormComponent},
  {path: 'createform', component: EditAppComponent},
  {path: 'test', component: TestViewComponent},
  {path: 'data', component:ViewDataComponent},
  {path: '404', component:NotfoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponent = ViewFormComponent
