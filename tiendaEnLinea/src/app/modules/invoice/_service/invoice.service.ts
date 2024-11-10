import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api_dwb_uri } from '../../../shared/api-dwb-uri';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private source = "/invoice";
  constructor(
    private http: HttpClient
  ) { }
  getInvoice(id: number): Observable<any> {
    return this.http.get(api_dwb_uri + this.source + "/" + id);
  }
  getInvoices(): Observable<any> {
    return this.http.get(api_dwb_uri + this.source);
  }
  /* REQUERIMIENTO 4. Implementar servicio Invoice - función generateInvoice() */
  generateInvoice() {}
}