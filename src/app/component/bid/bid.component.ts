import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/entity/Project';
import { CurrenceService } from 'src/app/service/currence.service';

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

  ) {
    this.prj = data;


    this.currency.getCurrencyFree()
      .subscribe((x: any) => this.currencyObj = x);

    this.bidForm.controls.amount.setValue((data.budget.maximum || 100).toString());
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
    throw new Error('Method not implemented.');
  }


  realCurrency(value: any, currencyCode: string) {
    if (!value || !this.currencyObj)
      return 0
    // console.log(this.currencyObj.find((x: { code: string; }) => x.code == currencyCode))
    return this.currencyObj.find((x: { code: string; }) => x.code == currencyCode).real * value
  }


}
