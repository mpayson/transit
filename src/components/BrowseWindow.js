import React from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  Row,
  Col
} from 'reactstrap';

const BrowseWindow = ({appState, featureStore}) => (
    <Container className="mt-3">
      <Row style={{marginBottom: '5px'}}>
        <Col>
          <Button outline color="secondary">secondary</Button>
          &nbsp;&nbsp;&nbsp;
          <Button outline color="secondary">secondary</Button>
        </Col>
        <Col>
          <ButtonGroup className="float-right">
            <Button outline color="secondary">secondary</Button>
            <Button outline color="secondary">secondary</Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
)

export default BrowseWindow;