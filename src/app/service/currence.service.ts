import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { catchError, map, mergeMap, retry, shareReplay, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrenceService {

  private SERVER_URL_UTIL_API = `${environment.backendServer}/util`;
  constructor(private httpClient: HttpClient) { }

  currencyBC: any = undefined;
  getCurrencyBC() {

    if (this.currencyBC)
      return this.currencyBC
    this.currencyBC = this.httpClient.get(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?%40dataInicial='${moment().add(-1, 'week').format('MM-DD-YYYY')}'&%40dataFinalCotacao='${moment().format('MM-DD-YYYY')}'&%24format=json&%24orderby=dataHoraCotacao%20desc`)
      .pipe(
        shareReplay(1, 1000 * 60 * 60 * 6),
        retry(2),
        catchError(this.handleError),
        map((bc: any) => bc.value[0].cotacaoCompra),
      )

    return this.currencyBC;
  }
  currencyFree: any = undefined;
  getCurrencyFree() {
    if (this.currencyFree)
      return this.currencyFree
    this.currencyFree = this.httpClient.get(`${this.SERVER_URL_UTIL_API}/get`)
      .pipe(
        shareReplay(1, 1000 * 60 * 60 * 6),
        retry(2),
        catchError(this.handleError),

        map((x: any) => x.result.currencies),
        mergeMap((x: any) =>
          this.getCurrencyBC()
            .pipe(
              map((bc: any) => x.map((c: any) => {
                c['real'] = c.exchange_rate * parseFloat(bc)
                return c
              }))
            ))
      )


    return this.currencyFree;
  }

  /*
  x.map((c: any) => {
            c['real'] = c.exchange_rate * parseFloat(realdolar.cotacaoCompra)
            return c
          })
  */

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };
}
