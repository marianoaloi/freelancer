import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { Project } from 'src/app/entity/Project';
import { DatabackendService } from 'src/app/service/databackend.service';

import * as moment from 'moment-timezone';
import { CurrenceService } from 'src/app/service/currence.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less']
})
export class ProjectComponent implements OnInit {
  projects!: Observable<Project[]>;
  projectDetail: any;
  currencyObj: any;

  constructor(private backend: DatabackendService, private currency: CurrenceService) {
    this.currency.getCurrencyFree()
      .subscribe((x: any) => this.currencyObj = x);
  }

  ngOnInit(): void {
    this.getProjs()
  }

  getProjs() {
    this.projects = this.backend.getProjs()
  }

  ignore(prj: Project) {
    this.backend.ignore(prj)
    // this.projects = this.projects.pipe(
    //   map(prjs => prjs.filter(pr => pr._id != prj._id))
    // )
    prj.ignore = new Date()

  }


  follow(prj: Project) {

    this.backend.follow(prj)
    prj.follow = new Date()
  }


  open(prj: Project) {
    openGlobal(prj)
  }


  bid(prj: Project) {
    throw new Error('Method not implemented.');
  }

  details(prj: Project) {
    this.projectDetail = prj
  }
  closeDetailResource() {
    this.projectDetail = undefined
  }


  jobs(prj: Project): string {
    return prj.jobs.map(m => m.name).join(" ")
  }

  number2date(timestamp: number) {
    return moment.unix(timestamp).tz('America/Sao_Paulo').format('DD/MM h:mm')
  }


  realCurrency(value: number | undefined, currencyCode: string) {
    if (!value || !this.currencyObj)
      return 0
    // console.log(this.currencyObj.find((x: { code: string; }) => x.code == currencyCode))
    return this.currencyObj.find((x: { code: string; }) => x.code == currencyCode).real * value
  }
}

@Component({
  selector: 'detail',
  templateUrl: 'detail.html',
  styleUrls: ['./detail.css']

})
export class ProjDetail implements OnInit {

  @Input() prj!: Project
  @Output("closeDetailResource") closeDetailResource: EventEmitter<any> = new EventEmitter();
  jsonResource: any;
  constructor() {
  }

  ngOnInit(): void {

  }

  close() {
    this.closeDetailResource.emit();
  }

  open(prj: Project) {
    openGlobal(prj)
  }
}


function openGlobal(prj: Project) {
  window.open(`https://www.freelancer.com/projects/${prj.seo_url}`, "blank")
}