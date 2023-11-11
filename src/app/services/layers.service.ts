import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WMSLayerInfo } from 'src/app/interfaces/wmslayer-info';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:4000'

@Injectable({
  providedIn: 'root'
})
export class LayersService {

  constructor(private http: HttpClient) { }

  all(): Observable<WMSLayerInfo[]> {
    return this.http.get<WMSLayerInfo[]>(this.getUrl());
  }

  private getUrl() {
    return `${BASE_URL}`;
  }
}
