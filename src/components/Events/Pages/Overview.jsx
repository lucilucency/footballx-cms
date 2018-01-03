import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';

/* actions & helpers */
import { getEvents } from 'actions';
import { transformations } from 'utility';
import { toDateString, toTimeString, fromNow } from 'utility/time';
import queryString from 'query-string';
import _ from 'lodash';
/* components */
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container/index';
import EventsSummary from './EventsSummary';
/* data */
import strings from 'lang';
/* css */
import subTextStyle from 'components/Visualizations/Table/subText.css';
import constants from 'components/constants';
import { colors } from 'material-ui/styles';

const tableEventsColumns = browser => [browser.greaterThan.medium && {
  displayName: strings.th_event_id,
  field: 'event_id',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/events/${field}`}>{field}</TableLink>
  </div>),
}, {
  displayName: strings.th_event,
  field: 'event_id',
  displayFn: transformations.th_event_club_vs_club_image,
  sortFn: true,
  sortClick: 'home',
}, {
  displayName: strings.th_hotspot,
  field: 'hotspot_id',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/hotspot/${field}`}>{row.hotspot_name}</TableLink>
    {browser.greaterThan.medium &&
    <span className={subTextStyle.subText} style={{ display: 'block', marginTop: 1 }} title={row.hotspot_address}>
      {row.hotspot_address}
    </span>}
  </div>),
}, {
  displayName: strings.th_date,
  field: 'match_date',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <span className="ellipsis" style={{ display: 'block', fontSize: '1.25em' }}>{toTimeString(field * 1000)}</span>
    <span style={{ display: 'block', color: constants.colorMutedLight }}>{toDateString(field * 1000)}</span>
  </div>),
}, browser.greaterThan.medium && {
  displayName: strings.th_price,
  tooltip: strings.tooltip_price,
  field: 'price',
  sortFn: true,
  displayFn: (row, col, field) => (<div style={{ float: 'left', textAlign: 'left' }}>
    <span className="ellipsis" style={{ display: 'block', fontSize: '1.25em' }}>{field}</span>
    {row.discount && <span style={{ display: 'block', color: colors.green600, float: 'left' }}>-{row.discount}%</span>}
  </div>),
}, browser.greaterThan.small && {
  displayName: strings.th_status,
  field: 'status',
  displayFn: (row, col, field) => {
    let color;
    switch (field) {
      case 0:
        color = constants.colorDanger;
        break;
      case 1:
        color = constants.colorGreen;
        break;
      case 2:
        color = constants.colorMuted;
        break;
      case 3:
        color = constants.colorMutedLight;
        break;
    }
    return (<div>
      <span style={{ color }}>{strings[`event_status_${field}`]}</span>
      <span className={subTextStyle.subText} style={{ display: 'block', marginTop: 1 }}>
        {fromNow(row.match_date)}
      </span>
    </div>);
  },
}, {
  displayName: strings.th_xusers,
  field: 'checkin_total',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <span className="subText ellipsis" style={{ display: 'block', marginTop: 1 }}>
      {row.checkin_total} / {row.checkin_total + row.register_total}
    </span>
  </div>),
}];


const TableEvents = ({
  events,
  browser,
}) => (
  <Container title={strings.heading_events_all}>
    <Table paginated columns={tableEventsColumns(browser)} data={events} pageLength={30} />
  </Container>
);

const getData = (props) => {
  props.dispatchEvents(props.location.search);
};

class RequestLayer extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.playerId !== nextProps.playerId || this.props.location.key !== nextProps.location.key) {
      getData(nextProps);
    }
  }

  render() {
    const { events } = this.props;

    return (<div>
      <EventsSummary {...this.props} events={events} loading={false} error={false} />
      <TableEvents {...this.props} events={events} loading={false} error={false} />
    </div>);
  }
}

RequestLayer.propTypes = {
  location: PropTypes.shape({
    key: PropTypes.string,
  }),
};

const defaultOptions = {
  limit: null,
};

const mapStateToProps = state => ({
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  dispatchEvents: (options = defaultOptions) => dispatch(getEvents(options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
