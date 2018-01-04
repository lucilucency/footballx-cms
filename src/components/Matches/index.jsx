import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { getMatchesLeague } from 'actions';
import strings from 'lang';
import Table from 'components/Table';
import { transformations } from 'utility';
import subTextStyle from 'components/Visualizations/Table/subText.css';
import { IconTrophy } from 'components/Icons';
import TabBar from 'components/TabBar';
import Clubs from 'fxconstants/build/clubsObj.json';
import styled from 'styled-components';
import constants from 'components/constants';

const ConfirmedIcon = styled.span`
  composes: badge;
  & svg {
      fill: var(--colorGolden);
  }
`;

const columns = [{
    displayName: strings.th_match_id,
    field: 'id',
    sortFn: true,
    displayFn: (row, col, field) => (<div>
      {field}
      <span className={subTextStyle.subText} style={{display: 'block', marginTop: 1}}>
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
    content: props => (<div>
      <Table data={props.matchesLeague} columns={columns} loading={props.loading}/>
    </div>),
    route: '/matches/league',
}, {
    name: strings.matches_national,
    key: 'national',
    content: props => (<div>
        <Table data={props.matchesNation} columns={columns} loading={props.loading}/>
    </div>),
    route: '/matches/national',
}];

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

        const route = this.props.match.params.matchId || 'league';

        // if (Number.isInteger(Number(route))) {
        //   return <Match {...this.props} matchId={route} />;
        // }

        const tab = matchTabs.find(o => o.key === route);
        return (<div>
          <Helmet title={strings.title_matches} />
          <div>
            <TabBar info={route} tabs={matchTabs} />
            {tab && tab.content(this.props)}
          </div>
        </div>);
    }
}

RequestLayer.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            matchId: PropTypes.number,
        }),
    }),
    user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    // matchesLeague: PropTypes.array,
    // matchesNation: PropTypes.array,
};

const mapStateToProps = state => ({
    loading: state.app.matchesLeague.loading,
    matchesLeague: state.app.matchesLeague.data.matches || [],
    matchesNation: state.app.matchesNation.data,
    user: state.app.metadata.data.user,
});

const mapDispatchToProps = dispatch => ({
    dispatchLeagueMatches: params => dispatch(getMatchesLeague(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
