/* eslint-disable import/no-unresolved,import/no-webpack-loader-syntax */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { getMatches } from 'actions';
import strings from 'lang';
import queryString from 'querystring';
import moment from 'moment';
import { isEmpty } from 'lodash';
import Clubs from 'fxconstants/clubsObj.json';
import BigCalendar from 'components/Calendar';
import CalendarMatch from 'components/Visualizations/Match/CalendarView';
import Header from './Header';
import FilterForm from './Forms/FilterForm';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

const getData = (props) => {
  const route = props.match.params.matchId || 'league';
  if (!Number.isInteger(Number(route))) {
    const now = parseInt(Date.now() / 1000);

    props.dispatchMatches({
      start_time: now,
      end_time: now + 5184000,
    });
  }
};

class RequestLayer extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.match.params.matchId !== nextProps.match.params.matchId) {
      getData(nextProps);
    }
  }

  render() {
    if (!this.props.user) {
      window.location.href = '/login';
    }

    // filter local
    let { matches } = this.props;
    const filter = queryString.parse(location.search.replace('?', ''));
    if (!isEmpty(filter)) {
      const keys = Object.keys(filter);
      keys.forEach((key) => {
        let value = filter[key];

        if (typeof value !== 'object') {
          value = [value];
        }

        matches = matches.filter((match) => {
          if (match && match[key]) {
            if (key === 'place') {
              return match.hotspot_address.indexOf(filter[key]) !== -1;
            }
            if (typeof match[key] !== 'object') {
              return value.indexOf(match[key].toString()) !== -1;
            }
            return value.some(o => match[key].indexOf(o) !== -1);
          }
          return false;
        });
      });
    }

    return (<div>
      <Helmet title={strings.title_matches} />
      <div>
        <Header location={location} matches={matches} />
        <FilterForm />
      </div>
      <div style={{ marginTop: 20 }}>
        <div>
          <BigCalendar
            selectable
            events={matches && matches.length ? matches.map((row) => {
              const startDate = new Date(row.date * 1000);
              const endDate = new Date((row.date * 1000) + 5400000);
              const title = (<CalendarMatch
                home={row.home}
                away={row.away}
              />);
              const tooltip = `${Clubs[row.home] && Clubs[row.home].name} vs ${Clubs[row.away] && Clubs[row.away].name}`;

              return {
                id: row.id,
                title,
                tooltip,
                start: startDate,
                end: endDate,
              };
            }) : []}
            defaultView="month"
            views={['month', 'day', 'agenda']}
            // step={60}
            showMultiDayTimes
            scrollToTime={new Date()}
            defaultDate={new Date()}
            // onSelectEvent={event => console.log(event)}
            // onSelectSlot={(slotInfo) => {
            //   console.log(slotInfo);
            // }}
          />
        </div>
        {/* <TabBar info={route} tabs={matchTabs} /> */}
        {/* {tab && tab.content({ matches, loading: this.props.loading })} */}
      </div>
    </div>);
  }
}

RequestLayer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      matchId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  }),
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  matches: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
  loading: state.app.matches.loading,
  matches: state.app.matches.data || [],
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  dispatchMatches: params => dispatch(getMatches(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
