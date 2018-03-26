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
import leagueDatasource from 'fxconstants/build/leaguesObj.json';

import Table from 'components/Table';
import { transformations, subTextStyle } from 'utils';
import TabBar from 'components/TabBar';
import Clubs from 'fxconstants/build/clubsObj.json';
import styled from 'styled-components';
import constants from 'components/constants';
import BigCalendar from 'components/Calendar';

import Header from './Header';
import FilterForm from './Forms/FilterForm';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

const ConfirmedIcon = styled.span`
  composes: badge;
  & svg {
      fill: var(--colorGolden);
  }
`;

const getData = (props) => {
  const route = props.match.params.matchId || 'league';
  if (!Number.isInteger(Number(route))) {
    const now = Date.now();

    props.dispatchMatches({
      start_time: parseInt(now / 1000) - 2592000,
      end_time: parseInt(now / 1000) + 5184000,
    });
  }
};

const columns = [{
  displayName: strings.th_match_id,
  field: 'id',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    {field}
    <span style={{ ...subTextStyle, display: 'block', marginTop: 1 }}>
      {leagueDatasource[row.league_id] && leagueDatasource[row.league_id].name}
    </span>
  </div>),
}, {
  displayName: strings.th_time,
  tooltip: strings.tooltip_time,
  field: 'date',
  sortFn: true,
  displayFn: transformations.start_time,
}, {
  displayName: <span>{strings.general_home}</span>,
  field: 'home',
  color: constants.green,
  displayFn: row => (<div>
    {(row.home && Clubs[row.home]) && Clubs[row.home].name}
  </div>),
}, {
  displayName: <span>{strings.general_away}</span>,
  field: 'away',
  color: constants.red,
  displayFn: row => (<div>
    {(row.away && Clubs[row.away]) && Clubs[row.away].name}</div>),
}];

const matchTabs = [{
  name: strings.matches_league,
  key: 'league',
  content: propsVar => (<div>
    <Table data={propsVar.matches} columns={columns} loading={propsVar.loading} />
  </div>),
  route: '/matches/league',
}, {
  name: strings.matches_national,
  key: 'national',
  content: propsVar => (<div>
    <Table data={propsVar.matches} columns={columns} loading={propsVar.loading} />
  </div>),
  route: '/matches/national',
}];

class RequestLayer extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.match.params.matchId !== nextProps.match.params.matchId) {
      getData(nextProps);
    }
  }

  __renderMatch = (row) => {
    const Wrapper = styled.div`
      display: flex;
      flex-direction: row;
      justify-content: center;
      position: relative;
      margin-top: -1px;
      height: 100%;
      align-items: center;
      min-width: 80px;
      font-size: 80%;
      //max-width: 140px;
      
      > div {
        flex: 1;
        justify-content: left;
      }
      
      > div:first-child * {
        float: right;
      }
      
      > div:last-child * {
        float: left;
      }
      
      img {
        margin-right: 7px;
        margin-left: 7px;
        position: relative;
        height: 1em;
        box-shadow: 0 0 5px ${constants.defaultPrimaryColor};
        vertical-align: middle;
        
        @media only screen and (max-width: 660px) {
          margin-right: 3px;
        }
      }
    `;
    return (<Wrapper>
      <div>
        <img
          src={Clubs[row.home] && Clubs[row.home].icon}
          alt=""
        />
        <span>{Clubs[row.home] && Clubs[row.home].short_name}</span>
      </div>
      <div>
        <img
          src={Clubs[row.away] && Clubs[row.away].icon}
          alt=""
        />
        <span>{Clubs[row.away] && Clubs[row.away].short_name}</span>
      </div>
    </Wrapper>);
  };

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

    const route = this.props.match.params.matchId || 'league';
    const tab = matchTabs.find(o => o.key === route);

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
              const title = this.__renderMatch(row);

              return {
                id: row.id,
                title,
                start: startDate,
                end: endDate,
              };
            }) : []}
            defaultView="month"
            // views={allViews}
            step={60}
            showMultiDayTimes
            // scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            onSelectEvent={event => console.log(event)}
            onSelectSlot={slotInfo =>
              alert(
                `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                `\nend: ${slotInfo.end.toLocaleString()}` +
                `\naction: ${slotInfo.action}`)
            }
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
  // matchesNation: PropTypes.array,
};

const mapStateToProps = state => ({
  loading: state.app.matches.loading,
  matches: state.app.matches.data || [],
  matchesLeague: state.app.matchesLeague.data.matches,
  matchesNation: state.app.matchesNation.data,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  dispatchMatches: params => dispatch(getMatches(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
