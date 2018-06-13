import React from 'react';
import {observer} from "mobx-react";
import ListPaneHeader from "./UIComponents/ListPaneHeader";

// Displays cards for all the users
const CardWindow = observer(({featureStore, appState}) => {

  const featureAttrs = featureStore.filteredAttributes;
  const attachMap = featureStore.featureAttachments;

  // Iterates over all features to create a new card for each
  const cards = featureAttrs.map(fa => {
    const objId = fa.ObjectId;
    const att = attachMap.get(objId);
    return (
      <div key={objId} className="card block trailer-1">
        <figure className="card-image-wrap">
          <img className="card-image" src={att} alt="Bridge Club, 1954"/>
          <figcaption className="card-image-caption">
            {fa.field_3}
          </figcaption>
        </figure>
        <div className="card-content">
          <h5><a href="#">{fa.field_0}</a></h5>
        </div>
      </div>
    )
  })
  
  return (
    <div>
      {/* <ListPaneHeader featureStore={featureStore} appState={appState}/> */}
      <div className="block-group block-group-3-up tablet-block-group-2-up phone-block-group-1-up">
        {cards}
      </div>
    </div>
  )
});

export default CardWindow;