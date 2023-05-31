import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject, Subscription, map, merge, scan, switchMap } from 'rxjs';
import { Project } from 'src/app/entity/Project';
import { DatabackendService } from 'src/app/service/databackend.service';

import * as moment from 'moment-timezone';
import { CurrenceService } from 'src/app/service/currence.service';
import { FormGroup } from '@angular/forms';
import { filterService } from 'src/app/service/filterService';
import { WebsocketService } from 'src/app/service/websocket.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less']
})
export class ProjectComponent implements OnInit, OnDestroy {

  projectDetail: any;
  currencyObj: any;

  // @ViewChild("jobnameregex") jobnameregex: any;

  @Input("filter")
  filters!: FormGroup;
  private _prjSub!: Subscription;


  projects!: Observable<Project>[];
  mapProjects = new Map<number, Observable<Project>>();
  loading: boolean = true;

  constructor(private filter: filterService, private backend: DatabackendService, private currency: CurrenceService, private ws: WebsocketService,
    private cookieService: CookieService
  ) {
    this.currency.getCurrencyFree()
      .subscribe((x: any) => this.currencyObj = x);
    this.filter.onGetData.subscribe(res => {
      this.filters = res
      this.search()
    })
    if (this.filter.filters)
      this.filters = this.filter.filters


  }

  ngOnInit(): void {
    this.getProjs()
    this._prjSub = this.ws.alterProject.subscribe((doc: any) => this.manipulateLocalObserver(doc));

  }
  manipulateLocalObserver(doc: any): void {


    switch (doc.operationType) {
      case 'insert': this.insert(doc.fullDocument); break;
      case 'update': this.update(doc.updateDescription.updatedFields, doc.documentKey._id); break;
      case 'delete': this.remove(doc.documentKey._id); break;

    }

  }
  remove(id: number) {
    this.update({ ignore: new Date }, id)
  }
  update(doc: any, id: number) {

    const odoc = this.mapProjects.get(id);
    odoc?.subscribe(obj => {
      Object.entries(doc).forEach(
        obs => (obj as any)[obs[0]] = obs[1]
      )
    })

  }
  insert(doc: any) {

    let valFilter = this.filters.get('jobnameregex')?.value.toLowerCase()
    let odoc = doc
    if (valFilter) {
      let sameFitler = odoc.jobs.filter((x: any) => x).map((x: { name: string; }) => x.name.toLowerCase()).find((x: string) => x.includes(valFilter))
      if (sameFitler && sameFitler.length > 0) {
        this.insertVal(odoc)
      }
    }
    else
      this.insertVal(odoc)

    //fullDocument
  }

  insertVal(ddoc: any) {
    let odoc: Observable<Project> = new Observable<Project>(x => x.next(ddoc));
    this.mapProjects.set(ddoc.id, odoc)
    this.projects.unshift(odoc);
  }

  ngOnDestroy(): void {

    this._prjSub.unsubscribe();
  }

  search() {
    this.getProjs()
  }

  getProjs() {
    this.loading = true;
    this.projects = []

    this.callNewProjects()


  }
  callNewProjects() {
    this.backend.getProjs(this.filters).subscribe(doclist => {
      let temp = doclist.slice(0, 20000)
      // temp.sort(function (a, b) { return a.time_updated - b.time_updated });
      temp.reverse();
      temp.forEach(doc => this.insert(doc))
    })
  }
  ignore(prj: Project) {
    this.backend.ignore(prj)
    // this.projects = this.projects.pipe(
    //   map(prjs => prjs.filter(pr => pr._id != prj._id))
    // )
    prj.ignore = new Date()

    this.mapProjects.delete(prj.id)
    if (this.mapProjects.size < 5) {
      this.callNewProjects()
    }
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
    if (prj.jobs)
      return prj.jobs.filter(x => x).map(m => m.name).join(" ")
    else
      return ""
  }

  number2date(timestamp: number) {
    return moment.unix(timestamp).tz('America/Sao_Paulo').format('DD/MM HH:mm')
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