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


  projects!: Observable<Project[]>;
  private readonly itemInsertedSource$ = new Subject<Project>();
  private readonly itemInserted$ = this.itemInsertedSource$.asObservable();
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
    // this._prjSub = this.ws.newprojects.subscribe((doc: any) => this.manipulateLocalObserver(doc));
    this._prjSub = this.ws.alterProject.subscribe((doc: any) => this.manipulateLocalObserver(doc));
    // this.projects.subscribe(prjs => console.log("PRJ", prjs.map(x => x._id).sort().join("\n")))
    // this.itemInsertedSource$.subscribe(prjs => console.log("itemInsertedSource", prjs, "\n"))
    // this.itemInserted$.subscribe(prjs => console.log("itemInserted", prjs, "\n"))
  }
  manipulateLocalObserver(doc: any): void {
    // this.projects.subscribe(prjs => console.log(prjs.filter(x => x._id == 24242424).map(x => x._id + x.title.substring(0, 7)).sort().join("\n")))


    switch (doc.operationType) {
      case 'insert': this.insert(doc); break;
      case 'update': this.update(doc); break;
      case 'remove': this.remove(doc); break;

    }
    // console.log(doc);

  }
  remove(doc: any) {
    // this.projects =
    this.projects.pipe(
      switchMap(prjs => {
        const prjaux = prjs.filter(prj => prj._id == doc.documentKey._id).find(x => x)
        if (prjaux)
          prjaux.ignore = new Date()
        return prjs
      }
      )
    )
  }
  update(doc: any) {
    // this.projects.subscribe(prjs => console.log(prjs.map(x => x._id + x.title.substring(0, 7)).sort().join("\n")))
    // this.projects =

    //   this.projects.pipe(
    //     map(prjs => {
    //       const prjaux = prjs.filter(prj => prj._id == doc.documentKey._id).find(x => x);
    //       if (prjaux) {
    //         Object.entries(doc.updateDescription.updatedFields).forEach(
    //           obs => (prjaux as any)[obs[0]] = obs[1]
    //         );
    //       }
    //       return prjs;
    //     }
    //     )
    //   )

    // this.projects.subscribe(prjs => {
    //   if (!prjs)
    //     return;
    //   const prjaux = prjs.filter(prj => prj._id == doc.documentKey._id).find(x => x)
    //   if (prjaux) {
    //     prjaux.ignore = new Date()
    //     // Object.entries(doc.updateDescription.updatedFields).forEach(
    //     //   obs => (prjaux as any)[obs[0]] = obs[1]
    //     // )
    //   }
    // })

    // this.projects.subscribe(prjs => console.log(prjs.map(x => x._id + x.title.substring(0, 7)).sort().join("\n")))


  }
  insert(doc: any) {
    let valFilter = this.filters.get('jobnameregex')?.value.toLowerCase()
    if (valFilter) {
      let sameFitler = doc.fullDocument.jobs.filter((x: any) => x).map((x: { name: string; }) => x.name.toLowerCase()).find((x: string) => x.includes(valFilter))
      if (sameFitler && sameFitler.length > 0) {
        this.itemInsertedSource$.next(doc.fullDocument)
      }
    }
    else
      this.itemInsertedSource$.next(doc.fullDocument)

    //fullDocument
  }

  ngOnDestroy(): void {

    this._prjSub.unsubscribe();
  }

  search() {
    this.getProjs()
  }

  getProjs() {
    this.loading = true;
    this.projects =
      merge(
        this.itemInserted$,
        this.backend.getProjs(this.filters),
      ).pipe(scan((acc, value) => [(value as Project)].concat((acc as Project[])))) as Observable<Project[]>

    // this.projects.subscribe(x => this.loading = false)
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