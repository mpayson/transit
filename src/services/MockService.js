import maxImg from '../resources/max.png';
import beauImg from '../resources/beau.png';
import danImg from '../resources/dan.png';

import {mapConfig} from '../config/config';

let data = [
  {
    attributes: {
      ObjectId: 1,
      field_0: 'Max Payson',
      field_3: 'javascript, community, startups',
      field_5: 1529119335165,
      field_6: '10:00',
      field_7: '12:00',
      field_12: 2
    }
  },
  {
    attributes: {
      ObjectId: 2,
      field_0: 'Beau Ryck',
      field_3: 'geography, community, workplace',
      field_5: 1529219335165,
      field_6: '10:00',
      field_7: '12:00',
      field_12: 1
    }
  },
  {
    attributes: {
      ObjectId: 3,
      field_0: 'Dan Barnes',
      field_3: 'geography, defense, pro',
      field_5: 1529219335165,
      field_6: '10:00',
      field_7: '12:00',
      field_12: 1
    }
  }
]
let attachmentPaths = [
  {
    id: 1,
    url: maxImg
  },
  {
    id: 2,
    url: beauImg
  },
  {
    id: 3,
    url: danImg
  }
]

class MockService{

  static loadMap(mapId){
    return Promise.resolve({
      layers: [{
        title: mapConfig.layerTitle
      }]
    })
  }


  static queryAllLayerFeatures(layer){
    return Promise.resolve({features: data});
  }
  static queryFeatureAttachments(layer, feature){
    const id = feature.attributes.ObjectId;
    return Promise.resolve([
      attachmentPaths[id-1]
    ])
  }
}

export default MockService