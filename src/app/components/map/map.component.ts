import { Component, OnDestroy } from '@angular/core';
import { latLng, Map, marker, tileLayer, layerGroup, Marker, icon, MarkerOptions, MapOptions } from 'leaflet';
import { WMSLayerInfo } from 'src/app/interfaces/wmslayer-info';
import { LayersService } from 'src/app/services/layers.service';
import * as ELG from 'esri-leaflet-geocoder';
import { LayersControl } from 'src/app/interfaces/layers-control';
import { ConfigService } from 'src/app/services/config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnDestroy {
  layers: WMSLayerInfo[] = [];
  iconOptions: MarkerOptions;
  layersControl: LayersControl;
  options: MapOptions;
  pinPoint?: Marker;
  private subscribtion?: Subscription;

  constructor(private layersService: LayersService, private configService: ConfigService) {
    this.iconOptions = {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'leaflet/marker-icon.png',
        iconRetinaUrl: 'leaflet/marker-icon-2x.png',
      })
    };
    const baseLayers = {
      'Street Maps': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        detectRetina: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      'Wikimedia Maps': tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
        detectRetina: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      'Topography': tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'TOPO-WMS'
      }),
      'Places': tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'OSM-Overlay-WMS'
      })
    }

    this.layersControl = {
      baseLayers,
      overlays: {}
    };

    this.options = {
      layers: [baseLayers['Street Maps']],
      zoom: 5,
      center: latLng([46.879966, 22.45])
    };
  }

  ngOnDestroy() {
    if (this.subscribtion) {
      this.subscribtion.unsubscribe();
    }
  }

  onMapReady(map: Map) {
    this.loadLayers(map);
    this.initGeocode(map);
    this.initReverseGeocode(map);
  }

  private loadLayers(map: Map) {
    this.subscribtion = this.layersService.all().subscribe(layers => this.addLayers(layers, map));
  }

  private addLayers(layers: WMSLayerInfo[], map: Map) {
    layers.forEach(wmsInfo => {
      wmsInfo.layers.forEach(l => {
        const wmsLayer = tileLayer.wms(wmsInfo.serviceUrl, {
          layers: l.layerId
        });
        wmsLayer.addTo(map);
        this.layersControl.overlays[l.layerName] = wmsLayer;
      });
    });
  }

  private initGeocode(map: Map) {
    const searchControl = new (ELG as any).Geosearch({
      providers: [
        new (ELG as any).arcgisOnlineProvider({
          apikey: this.configService.apiKey
        })
      ],
      expanded: true,
      useMapBounds: false
    }).addTo(map);

    const results = layerGroup().addTo(map);

    searchControl.on("results", (data: any) => {
      results.clearLayers();
      for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(marker(data.results[i].latlng, this.iconOptions));
      }
    });
  }

  private initReverseGeocode(map: Map) {
    map.on("click", (e) => {
      new (ELG as any).ReverseGeocode({
        apikey: this.configService.apiKey
      }).latlng(e.latlng).run((error: Error, result: any) => {
        if (error) {
          return;
        }
        if (this.pinPoint && map.hasLayer(this.pinPoint)) {
          map.removeLayer(this.pinPoint);
        }

        this.pinPoint = marker(result.latlng, this.iconOptions)
          .addTo(map)
          .bindPopup(result.address.Match_addr)
          .openPopup();
      });
    });
  }
}
