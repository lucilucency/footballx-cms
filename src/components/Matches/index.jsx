/* eslint-disable import/no-unresolved,import/no-webpack-loader-syntax */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { getMatchesLeague } from 'actions';
import strings from 'lang';
import Table from 'components/Table';
import { transformations, subTextStyle } from 'utils';
import { IconTrophy } from 'components/Icons';
import TabBar from 'components/TabBar';
import Clubs from 'fxconstants/build/clubsObj.json';
import styled from 'styled-components';
import constants from 'components/constants';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import '!style-loader!css-loader!react-big-calendar/lib/css/react-big-calendar.css';
// import globalize from 'globalize';

// BigCalendar.setLocalizer(BigCalendar.globalizeLocalizer(globalize));
// BigCalendar.momentLocalizer(moment);
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

const events = [
  {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2018, 2, 15, 12),
    end: new Date(2018, 2, 15, 13),
  },
  {
    id: 1,
    title: 'Long Event',
    start: new Date(2018, 2, 7),
    end: new Date(2018, 2, 7),
  },
];

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
    props.dispatchLeagueMatches({
      start_time: parseInt(now / 1000) - 86400,
      end_time: parseInt(now / 1000) + 2592000,
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

    const columns = [{
      displayName: strings.th_match_id,
      field: 'id',
      sortFn: true,
      displayFn: (row, col, field) => (<div>
        {field}
        <span style={{ ...subTextStyle, display: 'block', marginTop: 1 }}>
          {row.league_name || strings.th_premier_league}
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
        {(row.home && row.home.result === 1) && <ConfirmedIcon><IconTrophy /></ConfirmedIcon>}
        {(row.home && Clubs[row.home.club_id]) && Clubs[row.home.club_id].name}
      </div>),
    }, {
      displayName: <span>{strings.general_away}</span>,
      field: 'away',
      color: constants.red,
      displayFn: row => (<div>
        {(row.away && row.away.result === 1) && <ConfirmedIcon><IconTrophy /></ConfirmedIcon>}
        {(row.away && Clubs[row.away.club_id]) && Clubs[row.away.club_id].name}</div>),
    }];

    const matchTabs = [{
      name: strings.matches_league,
      key: 'league',
      content: propsPar => (<div>
        <Table data={propsPar.matchesLeague} columns={columns} loading={propsPar.loading} />
      </div>),
      route: '/matches/league',
    }, {
      name: strings.matches_national,
      key: 'national',
      content: propsPar => (<div>
        <Table data={propsPar.matchesNation} columns={columns} loading={propsPar.loading} />
      </div>),
      route: '/matches/national',
    }];

    const route = this.props.match.params.matchId || 'league';

    // if (Number.isInteger(Number(route))) {
    //   return <Match {...this.props} matchId={route} />;
    // }

    const tab = matchTabs.find(o => o.key === route);
    return (<div>
      <Helmet title={strings.title_matches} />
      <div>
        <div>
          <BigCalendar
            selectable
            events={events}
            // defaultView="week"
            // scrollToTime={new Date(1970, 1, 1, 6)}
            // defaultDate={new Date(2018, 2, 15)}
            onSelectEvent={event => alert(event.title)}
            onSelectSlot={slotInfo =>
              alert(
                `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                `\nend: ${slotInfo.end.toLocaleString()}` +
                `\naction: ${slotInfo.action}`)
            }
          />
        </div>
        <TabBar info={route} tabs={matchTabs} />
        {tab && tab.content(this.props)}
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
  // matchesLeague: PropTypes.array,
  // matchesNation: PropTypes.array,
};

const mapStateToProps = state => ({
  loading: state.app.matchesLeague.loading,
  matchesLeague: state.app.matchesLeague.data.matches,
  matchesNation: state.app.matchesNation.data,
  user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
  dispatchLeagueMatches: params => dispatch(getMatchesLeague(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
