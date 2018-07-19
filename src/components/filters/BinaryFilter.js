import React from 'react';
import {observer} from 'mobx-react';
import {Button} from 'reactstrap';

const BinaryFilter = observer(({filterObj, dark, className}) => {
  const isActive = filterObj.isActive;
  const darkCol = dark ? "secondary" : "light";
  const color = isActive ? "success" : darkCol;
  return (
    <Button color={color} outline={!isActive} onClick={filterObj.toggleIsActive}>
      {filterObj.label}
    </Button>
  )
});

export default BinaryFilter;