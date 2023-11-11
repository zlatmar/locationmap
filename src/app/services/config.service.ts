import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../interfaces/config';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    apiUrl: string = '';
    apiKey: string = '';
    private configUrl = 'assets/config.json';

    constructor(private http: HttpClient) { }

    initConfig() {
        return this.http.get<Config>(this.configUrl)
            .toPromise()
            .then(configData => {
                this.apiUrl = configData?.API_URL || '';
                this.apiKey = configData?.API_KEY || '';
            });
    }
}
