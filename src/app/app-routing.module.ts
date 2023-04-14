import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectComponent } from './component/project/project.component';
import { FollowComponent } from './component/follow/follow.component';

const routes: Routes = [
  {
    path: 'proj',
    component: ProjectComponent
  },
  {
    path: 'follow',
    component: FollowComponent
  },

  { path: '', redirectTo: '/proj', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
