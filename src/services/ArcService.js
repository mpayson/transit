import esriLoader from 'esri-loader';
import {layerConfig, loaderOptions} from '../config/config';


class ArcService {
  static loadMap(mapId){
    let map;
    return esriLoader.loadModules(['esri/WebMap'], loaderOptions)
      .then(([WebMap]) => {
        map = new WebMap({
          portalItem: {
            id: mapId
          }
        });
        return map.load()
      })
      .then(() => map);
  }

  static queryAllLayerFeatures(layer, where){
    // const dField = layerConfig.fieldTypes.date;
    // const queryParams = layer.createQuery();
    // const d = new Date();
    // queryParams.where = ;
    // console.log(queryParams.where);
    return layer.queryFeatures();
  }

  static queryFeatureAttachments(layer, feature){
    return layer.queryFeatureAttachments(feature);
  }
}

export default ArcService;