import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
/* data */
import strings from 'lang';
import _ from 'lodash';
import queryString from 'querystring';
/* components */
import Event from 'components/Event';
import TabBar from 'components/TabBar';
import CreateEventsForm from './Forms/CreateEventsForm';
import EventsHeader from './Header';
import FilterForm from './Forms/FilterForm';
import Overview from './Pages/Overview';


const eventTabs = [
  {
    name: strings.tab_events_all,
    key: 'all',
    content: (events, routeParams, location) => (<Overview routeParams={routeParams} location={location} events={events} />),
    route: '/events/all',
  },
  {
    name: strings.tab_events_add,
    key: 'add',
    content: () => (<CreateEventsForm />),
    route: '/events/add',
  },
];

class RequestLayer extends React.Component {
  static propTypes = {
    location: PropTypes.shape({}),
    match: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
    events: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
    user: PropTypes.shape({
      user_type: PropTypes.number,
    }),
  };

  render() {
    const { location, match } = this.props;
    let { events } = this.props;
    // filter local
    const filter = queryString.parse(location.search.replace('?', ''));
    if (!_.isEmpty(filter)) {
      const keys = Object.keys(filter);
      keys.forEach((key) => {
        let value = filter[key];

        if (typeof value !== 'object') {
          value = [value];
        }

        events = events.filter((event) => {
          if (key === 'place') {
            return event.hotspot_address.indexOf(filter[key]) !== -1;
          }

          if (typeof event[key] !== 'object') {
            return value.indexOf(event[key].toString()) !== -1;
          }
          return value.some(o => event[key].indexOf(o) !== -1);
        });
      });
    }

    if (!this.props.user) {
      this.props.history.push('/login');
      return false;
    }

    const route = match.params.eventId || 'all';
    if (Number.isInteger(Number(route))) {
      return <Event {...this.props} eventId={route} />;
    }

    if (this.props.user.user_type !== 1 && location.pathname !== '/events/add') {
      this.props.history.push('/');
      return false;
    }

    const tab = eventTabs.find(el => el.key === route);
    return (<div>
      <Helmet title={strings.title_events} />

      {route !== 'add' && <div>
        <EventsHeader location={location} events={events} />
        <FilterForm />
      </div>}
      <div>
        <TabBar
          info={route}
          tabs={eventTabs}
        />
        {tab && tab.content(events, match.params, location)}
      </div>
    </div>);
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  events: state.app.events.data.sort((a, b) => {
    const aDate = (a.match_date * 1000) - Date.now();
    const bDate = (b.match_date * 1000) - Date.now();

    if (aDate > 0 && bDate > 0) {
      return a.match_date - b.match_date;
    }
    return b.match_date - a.match_date;
  }),
});

// const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, null)(RequestLayer);
