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
    'end': 'field_7',
    'years': 'field_12'
  },
  filters: {
    'field_3': 'interests',
    'field_12': 'num'
  },
  labels: {
    'field_3': 'Interests',
    'field_12': 'Years @ Esri'
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