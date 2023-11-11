import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WMSLayerInfo } from 'src/app/interfaces/wmslayer-info';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class LayersService {

    constructor(private http: HttpClient, private configService: ConfigService) { }

    all(): Observable<WMSLayerInfo[]> {
        return this.http.get<WMSLayerInfo[]>(this.getUrl());
    }

    private getUrl() {
        return this.configService.apiUrl;
    }
}
