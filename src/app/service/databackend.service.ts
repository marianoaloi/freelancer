import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, map, retry, throwError } from 'rxjs';
import { Project } from '../entity/Project';
import { Bid } from '../entity/Bid';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DatabackendService {
  private SERVER_URL_PROJECT_API = `${environment.backendServer}/proj`;
  private SERVER_URL_BID_API = `${environment.backendServer}/bid`;
  constructor(private httpClient: HttpClient) { }


  getProjs(jobnameregex: FormGroup): Observable<readonly Project[]> {
    let jobname;
    if (jobnameregex)
      jobname = jobnameregex.value;
    return this.httpClient.post<Project[]>(this.SERVER_URL_PROJECT_API + `/get`, jobname)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }


  ignore(prj: Project): any {
    let result = this.httpClient.put(`${this.SERVER_URL_PROJECT_API}/ignore`, prj)
      .pipe(
        retry(2),
        catchError(this.handleError))

    return result.subscribe();

  }

  bid(bid: Bid): any {

  }


  ignoreAll(prj: Project[]): any {
    let result = this.httpClient.put(`${this.SERVER_URL_PROJECT_API}/ignore`, prj)
      .pipe(
        retry(2),
        catchError(this.handleError))

    return result.subscribe();

  }


  follow(prj: Project): any {
    let result = this.httpClient.put(`${this.SERVER_URL_PROJECT_API}/follow`, prj)
      .pipe(
        retry(2),
        catchError(this.handleError))

    return result.subscribe();

  }

  getFollow(): Observable<Project[]> {

    return this.httpClient.get<Project[]>(this.SERVER_URL_PROJECT_API + `/follow`)
      .pipe(

        map(prjs => prjs.map(x => {

          this.getProjectBids(x).subscribe(bd => x.bids = bd);
          return x
        })),

        retry(2),
        catchError(this.handleError))
  }


  projectRefresh(prj: Project): Observable<Project> {
    let result = this.httpClient.put<Project>(`${this.SERVER_URL_PROJECT_API}/projectRefresh`, { 'id': prj._id })
      .pipe(
        retry(2),
        catchError(this.handleError))

    return result;
  }


  getProjectBids(prj: Project): Observable<Bid[]> {
    return this.httpClient.get<Bid[]>(this.SERVER_URL_BID_API + `/projectBids?projectId=${prj._id}`)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

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
