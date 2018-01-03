import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import {
  CardTitle,
} from 'material-ui/Card';
import Spinner from 'components/Spinner';
import { Link } from 'react-router-dom';
import Container from 'components/Container';
/* data & helpers */
import strings from 'lang';
import { sum, abbreviateNumber } from 'utility';
import { formatSeconds } from 'utility/time';
import EventsHeaderButtons from './EventsHeaderButtons';
/* css */
import styled from 'styled-components';
import constants from 'components/constants';

const CompactContainer = styled.div`
    composes: container;
    flex-direction: column;
    align-items: center;
    width: 100%;
    
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;

    & .eventStats {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 5px;
        margin-right: 5px;

    &:first-child {
        margin-left: 10px;
        margin-right: 5px;
    }

    &:last-child {
        margin-left: 5px;
        margin-right: 10px;
    }

    /* Override material-ui style */
    & > span,
        & > span > div {
            text-align: center;
        }
    }
`;

const EventStat = styled(CardTitle)`
    display: inline-block;
    padding: 0 !important;
    margin-right: 25px;
    margin-left: 25px;
    margin-top: 15px;

    & span:last-child {
        font-size: 24px !important;
        color: rgba(255, 255, 255, 0.87) !important;
        line-height: 36px !important;
    }

    & span:first-child {
        font-size: 14px !important;
        text-align: center;
        color: rgba(255, 255, 255, 0.54) !important;
        white-space: nowrap;
        line-height: 1 !important;
        text-transform: uppercase;
    }
`;

export const EventsHeaderStats = ({
  events = [],
}) => {
  const totalEvents = events.length;
  const upComingEvents = events.filter(o => o.status === 1).length;

  return (<div>
    <CompactContainer>
      <Row>
        <EventStat
          subtitle={<div style={{ color: constants.colorMutedLight, textAlign: 'center' }}>{totalEvents}</div>}
          title={strings.events_heading_total}
        />
        <EventStat
          subtitle={<div style={{ color: constants.colorGreen, textAlign: 'center' }}>{upComingEvents}</div>}
          title={strings.events_heading_on_going}
        />
      </Row>
    </CompactContainer>
    <EventsHeaderButtons compact />
  </div>);
};

const { number, bool, shape, string } = PropTypes;

EventsHeaderStats.propTypes = {
  loading: bool,
  error: bool,
  compact: bool,
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(EventsHeaderStats);
