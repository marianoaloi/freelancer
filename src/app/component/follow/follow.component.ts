import { Component, Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment-timezone';
import { Observable, map } from 'rxjs';
import { Project } from 'src/app/entity/Project';
import { CurrenceService } from 'src/app/service/currence.service';
import { DatabackendService } from 'src/app/service/databackend.service';


@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.less']
})
export class FollowComponent implements OnInit {

  projects!: Observable<Project[]>;
  currencyObj: any;
  constructor(private backend: DatabackendService, private currency: CurrenceService) {
    this.currency.getCurrencyFree()
      .subscribe((x: any) => this.currencyObj = x);
  }

  ngOnInit(): void {
    this.getProjs()
  }

  getProjs() {
    this.projects = this.backend.getFollow()
  }

  getbubbleFromChart(prj: Project): BubbleMaloy {
    return {} as BubbleMaloy
  }

  open(prj: Project) {
    window.open(`https://www.freelancer.com/projects/${prj.seo_url}`, "blank")
  }

  refresh(prj: Project) {
    this.backend.projectRefresh(prj).subscribe(
      result => {
        Object.entries(prj).forEach(
          field => {
            let name: string = field[0]
            prj = result
          }
        )
      }
    )


  }
  getBids(prj: Project) {
    throw new Error('Method not implemented.');
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

export interface BubbleMaloy {
  bubbleChartOptions: ChartConfiguration
  bubbleChartLegend: boolean
  bubbleChartData: ChartConfiguration
}

@Directive({ selector: '[bubbleChart]' })

export class bubbleChart {

  private isViewCreated = false;
  private readonly context = new bubbleChartContext();

  @Input('bubbleChart') set bubble(prj: Project) {
    if (!prj || !prj.bids)
      return

    let bidsamount = prj.bids.map(b => b.amount)
    let maxamount = bidsamount.reduce((a, b) => a > b ? a : b, 0)
    let minamount = bidsamount.reduce((a, b) => a < b ? a : b, 0)

    let bidsperiod = prj.bids.map(b => b.period)
    let maxperiod = bidsperiod.reduce((a, b) => a > b ? a : b, 0)
    let minperiod = bidsperiod.reduce((a, b) => a < b ? a : b, 0)

    let bidsGroup = prj.bids.filter(b => b.amount > 0 && b.period > 0).reduce((counter: any, b) => {
      let name = `${b.amount}_${b.period}`
      if (!counter.hasOwnProperty(name)) {
        counter[name] = 0;
      }

      counter[name]++
      return counter
    }, {})

    let dataChart = Object.entries(bidsGroup).map(v => {
      let x, y, r = 0
      let nParts = v[0].split("_")
      x = parseInt(nParts[0])
      y = parseInt(nParts[1])
      r = parseInt(`${v[1]}`)
      return { x: x, y: y, r: r };
    })

    this.context.bubble = {
      bubbleChartOptions: {
        responsive: false,

        scales: {
          x: {
            min: minamount,
            max: maxamount,
          },
          y: {
            min: minperiod,
            max: maxperiod,
          }
        }
      } as ChartConfiguration<'bubble'>['options'],
      bubbleChartLegend: true,
      bubbleChartData: [
        {
          data: dataChart,
          label: 'Proposals',
        },
      ] as ChartConfiguration<'bubble'>['data']['datasets']
    } as unknown as BubbleMaloy

    if (!this.isViewCreated) {
      this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
      this.isViewCreated = true;
    }
  }
  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<bubbleChartContext>
  ) { }
}

class bubbleChartContext {
  bubble = {} as BubbleMaloy
}