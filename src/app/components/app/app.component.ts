import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-leaflet-solution';

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
    this.configService.initConfig();
  }
}
