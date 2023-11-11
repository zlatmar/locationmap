import { Layer } from "leaflet";

export interface LayersControl {
	baseLayers: Record<string, Layer>;
	overlays: Record<string, Layer>;
}
