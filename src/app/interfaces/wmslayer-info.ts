import { LayerInfo } from "./layer-info";

export interface WMSLayerInfo {
  serviceUrl: string;
  layers: LayerInfo[];
}
