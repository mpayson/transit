const mapConfig = {
  webmapid: '6d18e208b2354bb29969a6db0fb8c09d',
  layerTitle: 'transit'
}

const layerConfig = {
  fieldTypes: {
    'name': 'field_0',
    'tags': 'field_3',
    'date': 'field_5',
    'start': 'field_6',
    'end': 'field_7'
  }
}

const loaderOptions = {
  // tell Dojo where to load other packages
  dojoConfig: {
    has: {
      "esri-featurelayer-webgl": 1
    }
  }
};

export {mapConfig, layerConfig, loaderOptions}