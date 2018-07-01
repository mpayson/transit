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
    return layer.queryFeatures();
  }

  static fetchAttachMap(layer, features){
    const promises = features.map(f => 
      layer.queryFeatureAttachments(f)
    )
    return Promise.all(promises)
      .then(res => {
        return res.reduce((acc, cur) => {
          if(cur.length < 1){
            return acc;
          }
          const firstObj = cur[0];
          acc.set(firstObj.id, firstObj.url);
          return acc;
        }, new Map())
      })
  }

  static queryRelatedRecords(layer){
    return esriLoader.loadModules(["esri/tasks/QueryTask", "esri/tasks/support/RelationshipQuery"], loaderOptions)
      .then(([QueryTask, RelationshipQuery]) => {
        const queryTask = new QueryTask({
          url: layer.parsedUrl.path
        });
        let relQuery = new RelationshipQuery()
        relQuery.relationshipId = layer.relationships[0].id;
        relQuery.returnGeometry = true;
        relQuery.outFields = ["*"];
        relQuery.definitionExpression = "1=1";
        return queryTask.executeRelationshipQuery(relQuery);
      })
      .then(res => {
        const relMap = new Map();
        for(let id in res){
          relMap.set(id, res[id].features)
        }
        return relMap;
      })
  }

}

export default ArcService;