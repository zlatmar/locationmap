import { Component, OnInit } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer, control } from 'leaflet';
import { WMSLayerInfo } from 'src/app/interfaces/wmslayer-info';
import { LayersService } from 'src/app/services/layers.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    layers: WMSLayerInfo[] = [];

    constructor(private layersService: LayersService) { }

    ngOnInit(): void {
        // this.getLayersInfo();
    }

    getLayersInfo() {
        this.layersService.all().subscribe(layers => this.layers = layers);
    }

    streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        detectRetina: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
        detectRetina: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    topography = tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'TOPO-WMS'
    });

    places = tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'OSM-Overlay-WMS'
    });

    layersControl = {
        baseLayers: {
            'Street Maps': this.streetMaps,
            'Wikimedia Maps': this.wMaps,
            'Topography': this.topography,
            'Places': this.places
        },
        overlays: {
        }
    } as any;

    options = {
        layers: [this.streetMaps],
        zoom: 7,
        center: latLng([46.879966, -121.726909])
    };

    onMapReady(map: Map) {
        this.layersService.all().subscribe(layers => this.loadLayers(layers, map));
    }

    loadLayers(layers: WMSLayerInfo[], map: Map) {
        layers.forEach(wmsInfo => {
            wmsInfo.layers.forEach(l => {
                const wmsLayer = tileLayer.wms(wmsInfo.serviceUrl, {
                    layers: l.layerId
                });
                wmsLayer.addTo(map);
                this.layersControl.overlays[l.layerName] = wmsLayer;
            })
        })
    }
}
