import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { filterService } from './service/filterService';
import { CurrenceService } from './service/currence.service';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  filtervisible = true
  closeOptions() {
    this.filtervisible = !this.filtervisible
    this.cookieService.set('filtervisible', String(this.filtervisible));
  }
  title = 'Maloi Freelancer';
  menu: any;

  filters = this.fb.group({
    jobnameregex: [""],
    titleregex: [""],
    minimum: [""],
    maximum: [""]
  })
  bestJob: Observable<any[]>;
  bestFollow: Observable<any[]>;
  bestMoney: Observable<any[]>;

  constructor(private fb: FormBuilder, private filter: filterService, private util: CurrenceService,
    private cookieService: CookieService) {
    // this.util.getbestJob().subscribe(val => this.bestJob = val.map(x => x._id).join(" + "))
    // this.util.getbestFollowed().subscribe(val => this.bestFollow = val.map(x => x._id).join(" + "))






    this.bestJob = this.util.getbestJob();
    this.bestFollow = this.util.getbestFollowed();
    this.bestMoney = this.util.getbestPrice();




  }
  ngOnInit(): void {
    this.filtervisible = this.cookieService.get('filtervisible') == 'true'
    Object.entries(this.filters.controls).forEach(element => {

      element[1].setValue(this.cookieService.get(element[0]))

    });
    this.filter.setFilter(this.filters)
  }



  callBest(job: string) {
    this.filters.get("jobnameregex")?.setValue(job)
    // this.filter.setFilter(this.filters)
    this.search()
  }

  search() {
    Object.entries(this.filters.controls).forEach(element => {
      let el = element[1]
      if (!element || !el)
        return
      let val = el.value
      if (val)
        this.cookieService.set(element[0], val);
      // element[1].setValue(this.cookieService.get(element[0]))

    });
    this.filter.setFilter(this.filters)
  }


  getBest(): Observable<any> {
    return this.bestJob;
  }
  getBestFollow(): Observable<any> {
    return this.bestFollow;
  }
  getBestMoney(): Observable<any> {
    return this.bestMoney;
  }
}
