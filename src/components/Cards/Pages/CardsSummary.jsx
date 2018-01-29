import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'components/Container/index';
// import PropTypes from 'prop-types';
/* data & helpers */
import strings from 'lang';
import { sum, abbreviateNumber } from 'utils';
import { formatSeconds } from 'utils/time';
/* css */
import styled from 'styled-components';
import constants from 'components/constants';

const SummaryContainer = styled(Container)`
  width: 100%;

  & ul {
    margin: 0;
    padding: 0;

    & li {
      list-style: none;
      display: inline-block;
      margin-bottom: 10px;
      margin-right: 15px;

      & p {
        margin: 0;
        padding: 0;
        font-size: 24px;
      }

      & span {
        font-size: ${constants.fontSizeSmall};
        color: ${constants.colorMutedLight};

        &:first-child {
          text-transform: uppercase;
        }
      }

      & img {
        height: 20px;
        width: auto;
        vertical-align: text-bottom;
        transition: ${constants.normalTransition};
        margin-left: 6px;

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
`;

export const EventsSummary = (propsVar) => {
  const { events } = propsVar;
  const data = {
    checkin_total: [],
    register_total: [],
    // seats: [],
    // price: [],
    revenue: [],
  };
  const computed = {};
  const dataKeys = Object.keys(data);

  events.forEach((event) => {
    dataKeys.forEach((key) => {
      switch (key) {
        case 'register_total':
          data[key].push(event[key] + event.checkin_total);
          break;
        case 'revenue':
          data[key].push(event.price * (100 - (event.discount || 0)) / 100 * event.checkin_total);
          break;
        default:
          data[key].push(event[key]);
          break;
      }
    });
  });


  dataKeys.forEach((key) => {
    const total = data[key].reduce(sum, 0);
    const avg = total / events.length;
    const max = Math.max(...data[key]);
    const maxEvent = events.find(o => o[key] === max) || {};

    let color;
    switch (key) {
      case 'register_total':
        color = 'lightGray';
        break;
      case 'checkin_total':
        color = 'green';
        break;
      case 'price':
        color = 'golden';
        break;
      case 'revenue':
        color = 'golden';
        break;
      case 'seats':
        color = 'lightGray';
        break;
      default:
        color = false;
    }

    computed[key] = {
      total,
      avg,
      color,
      max: {
        value: max,
        eventId: maxEvent.event_id,
        hotspotName: maxEvent.hotspot_name,
      },
    };
  });

  return (<SummaryContainer
    title={strings.heading_summary}
    titleTo={'/events/records'}
    subtitle={strings.events_stats_subtitle}
  >
    <ul>
      {Object.keys(computed).map((key) => {
        const c = computed[key];

        if (c.avg) {
          return (
            <li key={key}>
              <span>{strings[`events_heading_${key}`]}</span>
              <p style={{ color: constants[c.color] }}>
                {key === 'duration' ? formatSeconds(c.avg) : abbreviateNumber(c.avg)}
                                &nbsp;
                <span>/ &nbsp;{key === 'duration' ? formatSeconds(c.total) : abbreviateNumber(c.total)}</span>
                {null && <span title={c.max.hotspotName}>
                  <Link to={`/events/${c.max.eventId}`}>
                                        / &nbsp;{key === 'duration' ? formatSeconds(c.max.value) : abbreviateNumber(c.max.value)}
                  </Link>
                </span>}
              </p>
            </li>
          );
        }

        return null;
      })}
    </ul>
  </SummaryContainer>);
};

EventsSummary.propTypes = {
  // events: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.shape([])]),
};

export default EventsSummary;
