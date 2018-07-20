/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'querystring';
import {
  connect,
} from 'react-redux';
import { getEvents } from 'actions';
import { transformations } from 'utils';
import { toDateString, toTimeString, fromNow } from 'utils/time';
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container/index';
import strings from 'lang';
import constants from 'components/constants';
import { colors } from 'material-ui/styles';
import { subTextStyle } from 'utils/style';
import { EventsSummary } from './EventsSummary';

const tableEventsColumns = browser => [browser.greaterThan.medium && {
  displayName: strings.th_event_id,
  field: 'match_id',
  sortFn: true,
  displayFn: row => (<div>
    <TableLink to={`/event/${row.event_id}`}><span title={strings.th_event_id}>{row.event_id}</span></TableLink>
    {browser.greaterThan.small &&
    <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} title={strings.th_match_id}>
      {row.match_id}
    </span>}
  </div>),
}, {
  displayName: strings.th_match,
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
    {browser.greaterThan.small &&
    <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} title={row.hotspot_address}>
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
      default:
        color = constants.colorMutedLight;
    }
    return (<div>
      <span style={{ color }}>{strings[`event_status_${field}`]}</span>
      <span className={subTextStyle.subText} style={{ display: 'block', marginTop: 1 }}>
        {fromNow(row.match_date)}
      </span>
    </div>);
  },
}, browser.greaterThan.small && {
  displayName: strings.th_xusers_checkin,
  field: 'checkin_total',
  tooltip: strings.tooltip_xuser_register_checkin,
  sortFn: true,
  displayFn: (row) => {
    const { checkin_total = 0, register_total = 0 } = row;
    return (<div>
      <span className="subText ellipsis" style={{ display: 'block', marginTop: 1 }}>
        {checkin_total} / {checkin_total + register_total}
      </span>
    </div>);
  },
  relativeBars: true,
}];


const TableEvents = propsVar => (
  <Container title={strings.heading_events_all}>
    <Table paginated columns={tableEventsColumns(propsVar.browser)} data={propsVar.events} pageLength={30} />
  </Container>
);

const getData = (props) => {
  const { search } = props.location;
  const params = { ...queryString.parse(search.substring(1)) };
  const defaultStartTime = parseInt(Date.now() / 1000, 10) - (12 * 2592000); /* 1m */
  const defaultEndTime = parseInt(Date.now() / 1000, 10) + 2592000; /* 1m */
  params.start_time = params.start_time || defaultStartTime;
  params.end_time = params.end_time || defaultEndTime;
  props.dispatchEvents(params);
};

class Overview extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  render() {
    const { events } = this.props;

    return (<div>
      <EventsSummary {...this.props} events={events} loading={false} error={false} />
      <TableEvents {...this.props} events={events} loading={false} error={false} />
    </div>);
  }
}

Overview.propTypes = {
  location: PropTypes.shape({
    key: PropTypes.string,
  }),
  events: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  browser: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
  browser: state.browser,
});

const mapDispatchToProps = dispatch => ({
  dispatchEvents: options => dispatch(getEvents(options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
