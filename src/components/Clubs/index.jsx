/* eslint-disable no-trailing-spaces,react/forbid-prop-types */
import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import strings from 'lang';
import leagues from 'fxconstants/leaguesArr.json';
import { transformations, getOrdinal, renderDialog, bindAll } from 'utils';
import { getLeagueClubs } from 'actions';
import styled from 'styled-components';
import constants from 'components/constants';

import Table from 'components/Table';
import Container from 'components/Container';
import { IconButton } from 'material-ui';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';

import EditClubForm from './Forms/EditClubForm';

const LeagueContainer = styled(Container)`
  //float: left;
  //width: calc(50% - 30px);
  //margin-right: 15px;

  @media only screen and (max-width: 1080px) {
    width: 100%;
    margin-right: 0;
  }
`;

const clubsColumns = (context, leagueID) => [null && {
  displayName: strings.th_no,
  displayFn: (row, col, field, index) => getOrdinal(index + 1),
}, {
  displayName: strings.th_team,
  field: 'id',
  sortClick: 'name',
  displayFn: transformations.th_club_image,
}, {
  displayName: strings.th_popularity,
  field: 'popularity',
  tooltip: strings.tooltip_popularity,
  sortFn: true,
}, context.props.user_type && context.props.user_type === 1 && {
  field: 'id',
  displayName: '',
  displayFn: row => (<div style={{ float: 'right' }}>
    <IconButton
      tooltip={strings.edit}
      onClick={() => {
        context.setState({
          selectedClub: { ...row, leagueID },
        }, context.handleOpenEditClubForm);
      }}
      iconStyle={{ width: 18, height: 18 }}
    >
      <IconEdit
        color={constants.colorMutedLight}
      />
    </IconButton>
  </div>),
}];

// const getLeagueClubs = league => new Promise((resolve) => {
//   resolve(ajaxGet(`league/${league.id}/clubs`)
//     .then((res, err) => {
//       if (!err) {
//         const clubs = res.body.data || [];
//         return { league, clubs };
//       }
//       return { league, clubs: [] };
//     }));
// });

class Clubs extends React.Component {
  static propTypes = {
    leagues: React.PropTypes.array,
    getLeagueClubs: React.PropTypes.func,
  };

  static initialState = {
    openDialog: false,
    dialogConstruct: {},
    leagues: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      ...Clubs.initialState,
    };

    bindAll([
      'handleOpenDialog',
      'handleCloseDialog',
      'handleOpenEditClubForm',
    ], this);
  }

  componentDidMount() {
    leagues.forEach(league => this.props.getLeagueClubs(league.id));
  }

  handleOpenDialog() {
    this.setState({ openDialog: true });
  }

  handleCloseDialog() {
    this.setState({ openDialog: false, dialogConstruct: {} });
  }

  handleOpenEditClubForm() {
    this.setState({
      dialogConstruct: {
        title: strings.heading_edit_team,
        view: <EditClubForm
          popup
          club={this.state.selectedClub}
          callback={this.handleCloseDialog}
        />,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  render() {
    return (
      <div>
        <Helmet title={strings.title_clubs} />
        <div>
          {this.props.leagues.map((o) => {
            const { league, clubs } = o;
            return (<LeagueContainer
              title={league.name}
              loading={clubs.loading}
              error={clubs.error}
            >
              <Table data={clubs.data} columns={clubsColumns(this, league.id)} loading={clubs.loading} error={clubs.error} pageLength={10} paginated />
            </LeagueContainer>);
          })}
        </div>

        {renderDialog(this.state.dialogConstruct, this.state.openDialog)}
      </div>
    );
  }
}

Clubs.propTypes = {

};

const mapStateToProps = (state) => {
  const leaguesReducer = leagues.reduce((__prev, league) => {
    const prev = __prev;
    const clubs = state.app[`league[${league.name}]`];
    prev.push({
      league, clubs,
    });
    return prev;
  }, []);

  return {
    leagues: leaguesReducer,
    user_type: state.app.metadata.data.user && state.app.metadata.data.user.user_type,
  };
};

const mapDispatchToProps = dispatch => ({
  getLeagueClubs: leagueID => dispatch(getLeagueClubs(leagueID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Clubs);
