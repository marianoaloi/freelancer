import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/entity/Project';
import { Bid } from 'src/app/entity/Bid';
import { CurrenceService } from 'src/app/service/currence.service';
import { DatabackendService } from 'src/app/service/databackend.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.less']
})
export class BidComponent {

  currencyObj: any;
  prj!: Project
  @Output("closeDetailResource") closeDetailResource: EventEmitter<any> = new EventEmitter();
  jsonResource: any;
  constructor(

    public dialogRef: MatDialogRef<BidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private fb: FormBuilder,
    private currency: CurrenceService,
    private backend: DatabackendService,

  ) {
    this.prj = data;


    this.currency.getCurrencyFree()
      .subscribe((x: any) => this.currencyObj = x);

    this.bidForm.controls.amount.setValue((data.budget.maximum || 100).toString());
    this.bidForm.controls.period.setValue((data.bidperiod || 1).toString());

    this.bidForm.controls.description.setValue(`Hi Client,
    I am Software Engineer with 20+ years expertice in develop business software, and since 2015 working with containers for frontend, backend and nosql database. in 2018 began organize the conteiners with kubernates vanilla , today I work well with (Azure AKA, AKS, ACI) , AWS ECS and Clustes Kubernetes of GCP;
    
    `);
  }

  close() {
    this.dialogRef.close();
  }
  open(prj: Project) {
    window.open(`https://www.freelancer.com/projects/${prj.seo_url}`, "blank")
  }

  bidForm = this.fb.group({
    amount: ['', Validators.required],
    period: ['', Validators.required],
    milestone_percentage: ['100', Validators.required],
    description: ['', Validators.required],
  })

  onFormSubmit() {
    let bid = {
      amount: Number.parseFloat(this.bidForm.controls.amount.value || "0"),
      period: Number.parseFloat(this.bidForm.controls.period.value || "0"),
      milestone_percentage: Number.parseFloat(this.bidForm.controls.milestone_percentage.value || "0"),
      description: this.bidForm.controls.description.value,
      project_id: this.prj.id,
      bidder_id: environment.bidder_id,
    } as Bid;
    this.backend.bid(bid);
  }


  realCurrency(value: any, currencyCode: string) {
    if (!value || !this.currencyObj)
      return 0
    // console.log(this.currencyObj.find((x: { code: string; }) => x.code == currencyCode))
    return this.currencyObj.find((x: { code: string; }) => x.code == currencyCode).real * value
  }


}
