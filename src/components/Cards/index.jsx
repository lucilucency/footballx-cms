import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
/* data */
import strings from 'lang';
import { isEmpty } from 'lodash';
import queryString from 'querystring';
/* components */
import TabBar from 'components/TabBar';
// import Header from './Header';
import FilterForm from './Forms/FilterForm';

import PackagesPage from './Pages/Packages';
import LabelsPage from './Pages/Labels';
import IssuesPage from './Pages/Issues';

const eventTabs = [
  {
    name: strings.tab_cards_issues,
    key: 'issues',
    content: (events, routeParams, location) => (<IssuesPage routeParams={routeParams} location={location} />),
    route: '/cards/issues',
  },
  {
    name: strings.tab_cards_labels,
    key: 'labels',
    content: (events, routeParams, location) => (<LabelsPage routeParams={routeParams} location={location} />),
    route: '/cards/labels',
  },
  {
    name: strings.tab_cards_packages,
    key: 'packages',
    content: (events, routeParams, location) => (<PackagesPage routeParams={routeParams} location={location} />),
    route: '/cards/packages',
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
    if (!isEmpty(filter)) {
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
    const route = match.params.info || 'labels';

    const tab = eventTabs.find(el => el.key === route);
    return (<div>
      <Helmet title={strings.title_events} />

      {route !== 'add' && <div>
        {/* <Header location={location} events={events} /> */}
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
