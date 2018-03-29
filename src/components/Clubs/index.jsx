import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import strings from 'lang';
import leagues from 'fxconstants/build/leaguesArr.json';
import { transformations, getOrdinal, renderDialog, bindAll } from 'utils';
import { ajaxGet, getLeagueClubs } from 'actions';
import styled, { css } from 'styled-components';
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
  displayName: strings.th_popularity,
  field: 'popularity',
  sortFn: true,
}, {
  displayName: strings.th_team,
  field: 'id',
  sortClick: 'name',
  displayFn: transformations.th_club_image,
}, {
  field: 'id',
  displayName: '',
  displayFn: (row, col, field) => (<IconButton
    tooltip={strings.edit}
    onClick={() => {
      context.setState({
        selectedClub: { ...row, leagueID },
      }, context.handleOpenEditClubForm);
    }}
  >
    <IconEdit color={constants.colorMutedLight} />
  </IconButton>),
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
    match: PropTypes.shape({
      params: PropTypes.shape({
        clubId: PropTypes.number,
      }),
    }),
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
          club={this.state.selectedClub}
          callback={() => {
            this.handleCloseDialog();
          }}
        />,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  render() {
    console.log('clubsProps', this.props);

    return (
      <div>
        <Helmet title={strings.title_clubs} />
        <div>
          {this.props.leagues.map((o) => {
            const { league, clubs } = o;
            return (<LeagueContainer
              title={league.name}
              loading={false}
              error={false}
            >
              <Table data={clubs} columns={clubsColumns(this, league.id)} loading={false} error={false} pageLength={10} paginated />
            </LeagueContainer>);
          })}
        </div>

        {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
      </div>
    );
  }
}

Clubs.propTypes = {

};

const mapStateToProps = state => {
  const leaguesReducer = leagues.reduce((__prev, league) => {
    const prev = __prev;
    const clubs = state.app[`league[${league.name}]`].data;
    prev.push({
      league, clubs
    });
    return prev;
  }, []);

  return {
    leagues: leaguesReducer,
  }
};

const mapDispatchToProps = dispatch => ({
  getLeagueClubs: leagueID => dispatch(getLeagueClubs(leagueID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Clubs);
