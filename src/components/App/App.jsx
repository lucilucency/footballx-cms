import React from 'react';
import { connect } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Helmet from 'react-helmet';
import palette from 'components/palette.css';
import strings from 'lang';
import { Route } from 'react-router-dom';
import Home from 'components/Home';
import Search from 'components/Search';

import Login from 'components/Login';
import Admin from 'components/Admin';
import Clubs from 'components/Clubs';
import FxMatches from 'components/Matches';

import Event from 'components/Event';
import Events from 'components/Events';
import Hotspots from 'components/Hotspots';
import Hotspot from 'components/Hotspot';
import Groups from 'components/Groups';
import Group from 'components/Group';

import Header from '../Header';
import Footer from '../Footer';
import styles from './App.css';

const muiTheme = {
  fontFamily: palette.fontFamily,
  card: { fontWeight: palette.fontWeightNormal },
  badge: { fontWeight: palette.fontWeightNormal },
  subheader: { fontWeight: palette.fontWeightNormal },
  raisedButton: { fontWeight: palette.fontWeightNormal },
  flatButton: { fontWeight: palette.fontWeightNormal }, // color: 'background color'
  inkBar: {
    backgroundColor: palette.blue,
  },
  palette: {
    textColor: palette.textColorPrimary,
    primary1Color: palette.blue,
    canvasColor: palette.primarySurfaceColor,
    borderColor: palette.dividerColor,
  },
  tabs: {
    backgroundColor: palette.primarySurfaceColor,
    textColor: palette.textColorPrimary,
    selectedTextColor: palette.textColorPrimary,
  },
  button: { height: 38 },
};

class App extends React.Component {
  componentWillUpdate(nextProps) {
    if (this.props.location.key !== nextProps.location.key) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { open, params, width, location } = this.props;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme, muiTheme)}>
        <div
          className={
            `${open ? styles.drawerOpen : styles.drawerClosed}
                        ${styles.container}
                        ${location.pathname === '/' && styles.HomeBackground}`
          }
        >
          <Helmet
            defaultTitle={strings.title_default}
            titleTemplate={strings.title_template}
          />
          <Header params={params} location={location} />
          <div className={styles.body}>
            <Route exact path="/" component={Home} />
            <Route exact path="/search" component={Search} />

            <Route exact path="/login" component={Login} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/clubs/:clubId?/:info?" component={Clubs} />
            <Route exact path="/matches/:matchId?/:info?" component={FxMatches} />
            <Route exact path="/events/:eventId?/:info?/:subInfo?" component={Events} />
            <Route exact path="/event/:eventId?/:info?/:subInfo?" component={Event} />
            <Route exact path="/hotspots/:info?/:subInfo?" component={Hotspots} />
            <Route exact path="/hotspot/:hotspotId?/:info?/:subInfo?" component={Hotspot} />
            <Route exact path="/groups/:info?/:subInfo?" component={Groups} />
            <Route exact path="/group/:groupId?/:info?/:subInfo?" component={Group} />

            {/* <Route exact path="/events/:eventId?/:info?" component={} /> */}
          </div>
          <Footer location={location} width={width} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect()(App);
