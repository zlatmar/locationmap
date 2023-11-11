import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Config } from '../interfaces/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  apiUrl: string = '';
  apiKey: string = '';
  private configUrl = 'assets/config.json';

  constructor(private http: HttpClient) { }

  async initConfig() {
    const req = this.http.get<Config>(this.configUrl);
    const configData = await lastValueFrom(req);
    this.apiUrl = configData?.API_URL || '';
    this.apiKey = configData?.API_KEY || '';
  }
}
