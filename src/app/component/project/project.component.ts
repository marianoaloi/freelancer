import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject, Subscription, map, merge, scan, switchMap } from 'rxjs';
import { Project } from 'src/app/entity/Project';
import { DatabackendService } from 'src/app/service/databackend.service';

import * as moment from 'moment-timezone';
import { CurrenceService } from 'src/app/service/currence.service';
import { FormGroup } from '@angular/forms';
import { filterService } from 'src/app/service/filterService';
import { WebsocketService } from 'src/app/service/websocket.service';
import { CookieService } from 'ngx-cookie-service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BidComponent } from '../bid/bid.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.less']
})
export class ProjectComponent implements OnInit, OnDestroy {

  currencyObj: any;

  // @ViewChild("jobnameregex") jobnameregex: any;

  @Input("filter")
  filters!: FormGroup;
  private _prjSub!: Subscription;


  projects!: Observable<Project>[];
  mapProjects = new Map<number, Observable<Project>>();
  loading: boolean = true;


  constructor(private filter: filterService, private backend: DatabackendService, private currency: CurrenceService, private ws: WebsocketService,
    private cookieService: CookieService, public dialog: MatDialog
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
    // this.update({ ignore: new Date }, id)
    const odoc = this.mapProjects.get(id);
    if (odoc) {

      let index = this.projects.indexOf(odoc)
      this.projects.splice(index, 1)
    }
  }
  update(doc: any, id: number) {

    const odoc = this.mapProjects.get(id);
    odoc?.subscribe(obj => {
      Object.entries(doc).forEach(
        obs => (obj as any)[obs[0]] = obs[1]
      )
    })


    if (doc.ignore) {
      console.log(this.mapProjects.size);

      this.mapProjects.delete(id)
      if (this.mapProjects.size < 5) {
        this.callNewProjects()
      }
    }

  }
  insert(doc: any) {

    let valFilter = this.filters.get('jobnameregex')?.value.toLowerCase()
    let odoc = doc
    if (this.mapProjects.has(doc.id)) {
      this.update(doc, doc.id);
      return
    }
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
    this.mapProjects = new Map()
    this.projects = []
    this.getProjs()
  }

  getProjs() {

    this.callNewProjects()


  }
  callNewProjects() {
    this.loading = true;
    this.projects = []
    this.backend.getProjs(this.filters).subscribe(doclist => {
      let temp = doclist.slice(0, 20000)
      // temp.sort(function (a, b) { return a.time_updated - b.time_updated });
      temp.reverse();
      temp.forEach(doc => this.insert(doc))

      this.loading = false;
    })
  }
  ignore(prj: Project) {
    if (prj.ignore)
      delete prj.ignore;
    else
      prj.ignore = new Date()
    this.backend.ignore(prj)


  }


  follow(prj: Project) {

    if (prj.follow)
      delete prj.follow;
    else
      prj.follow = new Date()
    this.backend.follow(prj)
  }


  open(prj: Project) {
    openGlobal(prj)
  }

  closeAll: Function = () => {
    const ids: Project[] = []
    this.projects.map((p) => {
      p.subscribe(
        ip => {
          if (!ip.follow) {
            // this.ignore(ip)
            ids.push({ _id: ip._id } as Project)
          }

        }
      )
    })
      .filter(x => x)

    this.backend.ignoreAll(ids)
    this.projects = []
  };


  bid(prj: Project) {
    const dialogRef = this.dialog.open(BidComponent, { data: prj })
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  details(prj: Project) {
    const dialogRef = this.dialog.open(ProjDetail, { data: prj })
    dialogRef.afterClosed().subscribe(result => {
      console.log('The detail was closed');
    });

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

  prj!: Project
  @Output("closeDetailResource") closeDetailResource: EventEmitter<any> = new EventEmitter();
  jsonResource: any;
  constructor(

    public dialogRef: MatDialogRef<ProjDetail>,
    @Inject(MAT_DIALOG_DATA) public data: Project,

  ) {
    this.prj = data;
  }

  ngOnInit(): void {

  }

  close() {
    this.dialogRef.close();
  }

  open(prj: Project) {
    openGlobal(prj)
  }
}


function openGlobal(prj: Project) {
  window.open(`https://www.freelancer.com/projects/${prj.seo_url}`, "blank")
}