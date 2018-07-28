import esriLoader from 'esri-loader';
import {loaderOptions} from '../config/config';


class ArcService {
  static getMap(mapId){
    return esriLoader.loadModules(['esri/WebMap'], loaderOptions)
      .then(([WebMap]) => {
        const map = new WebMap({
          portalItem: {
            id: mapId
          }
        });
        return map;
      });
  }

  static loadMap(map){
    return map.load();
  }

  static queryAllLayerFeatures(layer, where){
    return layer.queryFeatures();
  }

  static fetchAttachMap(layer, features, oid='objectid'){
    
    const promises = features.map(f => 
      layer.queryFeatureAttachments(f).then(res => {
        if(res.length < 1){
          return []
        }
        const firstObj = res[0];
        const id = f.attributes[oid];
        const url = firstObj.url;
        return [id, url];
      })
    )
    return Promise.all(promises).then(res => {
      return res.reduce((acc, cur) => {
        if(cur.length < 1){
          return acc;
        }
        acc.set(cur[0], cur[1]);
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