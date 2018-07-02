const mapConfig = {
  webmapid: '6d18e208b2354bb29969a6db0fb8c09d',
  layerTitle: 'Out of Office Hours'
}

const layerConfig = {
  fieldTypes: {
    'name': 'name',
    'email': 'email',
    'date': 'CreationDate',
    'start': 'EditDate',
    'end': 'EditDate',
    'years': 'start_date',
    'oid': 'objectid'
  },
  filters: {
    'communities': 'interests',
    'tech': 'interests',
    'free_time': 'interests',
    'other': 'interests',
    'start_date': 'num'
  },
  labels: {
    'communities': 'Communities',
    'tech': 'Tech',
    'free_time': 'Free Time',
    'start_date': 'Years @ Esri',
    'other': 'Other'
  }
}

const cardConfig = {
  description: {
    badges: ["communities", "tech", "free_time", "other"]
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

export {mapConfig, layerConfig, loaderOptions, cardConfig}