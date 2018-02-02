import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import constants from 'components/constants';

import { EventsHeaderStats } from './HeaderStats';

const HeaderWrapper = styled.div`
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.playerName {
  color: rgba(245, 245, 245, 0.870588);
  font-size: 28px;
  text-align: center;
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

.row {
  display: flex;
  flex-direction: row;
}

.topContainer {
  flex-direction: column;
  align-items: center;
}

.topButtons {
  margin-left: auto;
}

.eventInfo {
  padding-top: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
`;

const EventsHeader = (propsVar) => {
  const {
    // isOwner,
    // small,
    // extraSmall,
    events } = propsVar;
  return (<HeaderWrapper>
    <div className={'container'}>
      <div className={'row topContainer'}>
        <div className={'eventInfo'}>
          <EventsHeaderStats
            loading={false}
            error={false}
            events={events}
          />
        </div>
      </div>
    </div>
  </HeaderWrapper>);
};

const mapStateToProps = state => ({
  small: state.browser.greaterThan.small,
  extraSmall: state.browser.greaterThan.extraSmall,
});

export default connect(mapStateToProps)(EventsHeader);
