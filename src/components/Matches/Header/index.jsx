import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import constants from 'components/constants';
// import { EventsHeaderStats } from './HeaderStats';
import EventsHeaderButtons from './Buttons';

const HeaderStyled = styled.div`
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hotspotAddress {
  color: rgba(245, 245, 245, 0.870588);
  font-size: 18px;
  text-align: center;
}

.titleNameButtons {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
}

.stats {
  align-self: flex-end;
}

.imageContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.icon {
  fill: ${constants.colorMutedLight} !important;
}

.topContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.eventInfo {
  //padding-bottom: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
`;

const EventsHeader = () => (<HeaderStyled>
  <div className={'container'}>
    <div className={'topContainer'}>
      <div className={'eventInfo'}>
        <EventsHeaderButtons compact />
      </div>
    </div>
  </div>
</HeaderStyled>);

const mapStateToProps = state => ({
  small: state.browser.greaterThan.small,
  extraSmall: state.browser.greaterThan.extraSmall,
});

export default connect(mapStateToProps)(EventsHeader);
