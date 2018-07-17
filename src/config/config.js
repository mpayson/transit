const mapConfig = {
  webmapid: '6d18e208b2354bb29969a6db0fb8c09d',
  layerTitle: 'Out of Office Hours'
}

const layerConfig = {
  fieldTypes: {
    'name': 'name',
    'email': 'email',
    'date': 'CreationDate',
    'start': 'start_oooh',
    'end': 'end_oooh',
    'years': 'start_date',
    'oid': 'objectid',
    'linkedin': 'linkedin',
    'relateemail': 'repeat_email'
  },
  filters: {
    'interests': [
      {name: 'communities', type: 'multi-split'},
      {name: 'tech', type: 'multi-split'},
      {name: 'free_time', type: 'multi-split'},
      {name: 'other', type: 'multi-split'}
    ],
    // 'tech': 'multi-split',
    'start_date': 'time-since'
  },
  labels: {
    'communities': 'Communities',
    'tech': 'Tech',
    'free_time': 'Free Time',
    'start_date': 'Years @ Esri',
    'other': 'Other',
    'interests': 'Interests'
  },
  search: ['name', 'communities', 'tech', 'free_time', 'other']
}

const cardConfig = {
  description: {
    badges: ["communities", "tech", "free_time", "other"]
  },
  tabs: ["communities", "tech", "free_time", "other"]
}

const loaderOptions = {
  // tell Dojo where to load other packages
  dojoConfig: {
    has: {
      "esri-featurelayer-webgl": 1
    }
  },
  url: "https://js.arcgis.com/4.8/"
};

export {mapConfig, layerConfig, loaderOptions, cardConfig}