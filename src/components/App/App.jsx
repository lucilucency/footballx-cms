import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Helmet from 'react-helmet';
import strings from 'lang';
import { Route } from 'react-router-dom';

import Header from 'components/Header';
import Footer from 'components/Footer';

import Home from 'components/Home';
import Search from 'components/Search';
import Login from 'components/Login';
import Admin from 'components/Admin';
import Clubs from 'components/Clubs';
import Matches from 'components/Matches';
import Event from 'components/Event';
import Events from 'components/Events';
import Hotspots from 'components/Hotspots';
import Hotspot from 'components/Hotspot';
import Groups from 'components/Groups';
import Group from 'components/Group';

import constants from 'components/constants';
import styled from 'styled-components';

const muiTheme = {
  fontFamily: constants.fontFamily,
  card: { fontWeight: constants.fontWeightNormal },
  badge: { fontWeight: constants.fontWeightNormal },
  subheader: { fontWeight: constants.fontWeightNormal },
  raisedButton: { fontWeight: constants.fontWeightNormal },
  flatButton: { fontWeight: constants.fontWeightNormal },
  inkBar: {
    backgroundColor: constants.colorBlue,
  },
  palette: {
    textColor: constants.textColorPrimary,
    primary1Color: constants.colorBlue,
    canvasColor: constants.primarySurfaceColor,
    borderColor: constants.dividerColor,
  },
  tabs: {
    backgroundColor: constants.primarySurfaceColor,
    textColor: constants.textColorPrimary,
    selectedTextColor: constants.textColorPrimary,
  },
  button: { height: 38 },
};

const StyledDiv = styled.div`
  transition: ${constants.normalTransition};
  position: relative;
  display: flex;
  flex-direction: column;
  //height: 100%;
  height: 100vh;
  left: ${props => (props.open ? '256px' : '0px')};
  background-image: ${props => (props.location.pathname === '/' ? 'url("/assets/images/home-background.png")' : '')};
  background-position: ${props => (props.location.pathname === '/' ? 'center top' : '')};
  background-repeat: ${props => (props.location.pathname === '/' ? 'no-repeat' : '')};
`;

const StyledBodyDiv = styled.div`
  padding: 25px;
  flex-grow: 1;

  @media only screen and (min-width: 1200px) {
    width: 1200px;
    margin: auto;
  }
`;

class App extends React.Component {
  componentWillUpdate(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { params, width, location } = this.props;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme, muiTheme)}>
        <StyledDiv {...this.props}>
          <Helmet
            defaultTitle={strings.title_default}
            titleTemplate={strings.title_template}
          />
          <Header params={params} location={location} />
          <StyledBodyDiv>
            <Route exact path="/" component={Home} />
            <Route exact path="/search" component={Search} />

            <Route exact path="/login" component={Login} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/clubs/:clubId?/:info?" component={Clubs} />
            <Route exact path="/matches/:matchId?/:info?" component={Matches} />
            <Route exact path="/events/:eventId?/:info?/:subInfo?" component={Events} />
            <Route exact path="/event/:eventId?/:info?/:subInfo?" component={Event} />
            <Route exact path="/hotspots/:info?/:subInfo?" component={Hotspots} />
            <Route exact path="/hotspot/:hotspotId?/:info?/:subInfo?" component={Hotspot} />
            <Route exact path="/groups/:info?/:subInfo?" component={Groups} />
            <Route exact path="/group/:groupId?/:info?/:subInfo?" component={Group} />

            {/* <Route exact path="/events/:eventId?/:info?" component={} /> */}
          </StyledBodyDiv>
          <Footer location={location} width={width} />
        </StyledDiv>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  params: PropTypes.shape({}),
  width: PropTypes.number,
  location: PropTypes.shape({
    key: PropTypes.string,
  }),
};

export default connect()(App);
