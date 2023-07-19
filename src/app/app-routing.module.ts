import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './component/project/project.component';
import { FollowComponent } from './component/follow/follow.component';

const routes: Routes = [

  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: '',
    component: ProjectComponent
  },
  {
    path: 'follow',
    component: FollowComponent
  },
  {
    path: '**',
    component: ProjectComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
