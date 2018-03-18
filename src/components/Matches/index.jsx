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

// import BigCalendar from 'react-big-calendar';
import BigCalendar from 'components/Calendar';
import moment from 'moment';

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

const events = [{
  id: 0,
  title: 'All Day Event very long title',
  allDay: true,
  start: new Date(2018, 2, 15, 12),
  end: new Date(2018, 2, 15, 13),
}, {
  id: 1,
  title: 'Long Event',
  start: new Date(2018, 2, 7),
  end: new Date(2018, 2, 7),
}, {
  id: 1,
  title: 'MANU vs MANC',
  start: new Date(2018, 2, 16, 21, 30),
  end: new Date(2018, 2, 16, 23),
}, {
  id: 1,
  title: 'ARS vs CHE',
  start: new Date(),
  end: new Date(2018, 2, 17, 23),
}];

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

    const matchTabs = [{
      name: strings.matches_league,
      key: 'league',
      content: propsVar => (<div>
        <Table data={propsVar.matchesLeague} columns={columns} loading={propsVar.loading} />
      </div>),
      route: '/matches/league',
    }, {
      name: strings.matches_national,
      key: 'national',
      content: propsVar => (<div>
        <Table data={propsVar.matchesNation} columns={columns} loading={propsVar.loading} />
      </div>),
      route: '/matches/national',
    }];

    const route = this.props.match.params.matchId || 'league';

    // if (Number.isInteger(Number(route))) {
    //   return <Match {...this.props} matchId={route} />;
    // }

    const tab = matchTabs.find(o => o.key === route);
    const __renderMatch = row => {
      const imageContainer = styled.div`
        position: relative;
        display: flex;
        justify-content: center;
      `;
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
        
        img {
          margin-right: 7px;
          margin-left: 7px;
          position: relative;
          height: 20px;
          box-shadow: 0 0 5px ${constants.defaultPrimaryColor};
          vertical-align: middle;
          
          @media only screen and (max-width: 660px) {
            margin-right: 3px;
          }
        }
      `;
      return (<Wrapper>
        <div className="imageContainer">
          <span>{Clubs[row.home.club_id] && Clubs[row.home.club_id].short_name}</span>
          <img
            src={Clubs[row.home.club_id] && Clubs[row.home.club_id].icon}
            alt=""
            className="image"
          />
        </div>
        <div className="imageContainer">
          <img
            src={Clubs[row.away.club_id] && Clubs[row.away.club_id].icon}
            alt=""
            className="image"
          />
          <span>{Clubs[row.away.club_id] && Clubs[row.away.club_id].short_name}</span>
        </div>
      </Wrapper>);
    };

    return (<div>
      <Helmet title={strings.title_matches} />
      <div>
        <div>
          <BigCalendar
            selectable
            events={this.props.matchesLeague.map(row => {
              const startDate = new Date(row.date * 1000);
              const endDate = new Date(row.date * 1000 + 5400000);
              // const title = <span>{`${Clubs[row.home.club_id] && Clubs[row.home.club_id].short_name} vs ${Clubs[row.away.club_id] && Clubs[row.away.club_id].short_name}`}</span>;
              const title = __renderMatch(row);

              return {
                id: row.id,
                title,
                start: startDate,
                end: endDate,
              };
            })}
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
