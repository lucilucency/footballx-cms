import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
/* components */
import ActionSearch from 'material-ui/svg-icons/action/search';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';

import { LocalizationMenu } from 'components/Localization';
import AccountWidget from './AccountWidget';
import Announce from 'components/Announce';
import DropDown from 'components/Header/Dropdown';
import Logout from './Logout';
import SearchForm from '../Search/SearchForm';
import AppLogo from '../App/AppLogo';
import BurgerMenu from '../BurgerMenu';
import Add from 'material-ui/svg-icons/av/playlist-add';
import FlatButton from 'material-ui/FlatButton';

/* data */
import { toggleShowForm } from 'actions';
import strings from 'lang';
import { FORM_NAME_CREATE_EVENTS } from '../Events/Forms/index';
/* css */
import styles from './Header.css';


const navbarPages = [
  <Link key={strings.header_clubs} to="/clubs">{strings.header_clubs}</Link>,
];

const navbarPagesGUser = group => [
  <Link key={strings.header_matches} to="/matches">{strings.header_matches}</Link>,
  group && group.id && <Link key={strings.header_events} to={`/group/${group.id}`}>{strings.header_groups}</Link>,
];

const navbarPagesHUser = (hotspot) => {
  console.log('aaaaaa');
  console.log(hotspot);

  return [
    <Link key={strings.header_matches} to="/matches">{strings.header_matches}</Link>,
    hotspot && hotspot.id && <Link key={strings.header_events} to={`/hotspot/${hotspot.id}`}>{strings.header_my_hotspot}</Link>,
  ];
};

const navbarPagesCUser = [
  <Link key={strings.header_matches} to="/matches">{strings.header_matches}</Link>,
  <Link key={strings.header_hotspots} to="/hotspots">{strings.header_hotspots}</Link>,
  <Link key={strings.header_groups} to="/groups">{strings.header_groups}</Link>,
  <Link key={strings.header_events} to="/events">{strings.header_events}</Link>,
];

const burgerItems = (user, hotspot, group) => {
  const burgerHUser = (user && user.user_type === 2) ? navbarPagesHUser(hotspot) : [];
  const burgerGUser = (user && user.user_type === 3) ? navbarPagesGUser(group) : [];
  const burgerCUser = (user && user.user_type === 1) ? navbarPagesCUser : [];
  const _return = [
    {
      component: <AccountWidget key={0} />,
      close: true,
    },
    ...navbarPages.map(item => ({
      component: item,
      close: true,
    })),
    ...burgerCUser.map(item => ({
      component: item,
      close: true,
    })),
    ...burgerHUser.map(item => ({
      component: item,
      close: true,
    })),
    ...burgerGUser.map(item => ({
      component: item,
      close: true,
    })),
  ];

  return _return;
};

const buttonProps = {
  children: <ActionSettings />,
};

const LogoGroup = (props) => {
  const { small, auth } = props;

  return (
    <ToolbarGroup className={styles.verticalAlign} key={'logoGroup'}>
      {!small &&
      <BurgerMenu menuItems={burgerItems(auth.user, auth.hotspot)} />}
      <AppLogo style={{ marginRight: 18 }} />
    </ToolbarGroup>
  );
};

const LinkGroup = (props) => {
  const { user, hotspot } = props.user;
  return (
    <ToolbarGroup className={styles.verticalAlign}>
      {navbarPages.map((page, index) => (
        <div key={page.key} className={styles.tabContainer}>
          {React.cloneElement(page, { className: styles.tab })}
        </div>
      ))}
      {(user && user.user_type === 2) && navbarPagesHUser(hotspot).map(page => (
        <div key={page.key} className={styles.tabContainer}>
          {React.cloneElement(page, { className: styles.tab })}
        </div>
      ))}
      {(user && user.user_type === 3) && navbarPagesGUser(hotspot).map(page => (
        <div key={page.key} className={styles.tabContainer}>
          {React.cloneElement(page, { className: styles.tab })}
        </div>
      ))}
      {(user && user.user_type === 1) ? navbarPagesCUser.map(page => (
        <div key={page.key} className={styles.tabContainer}>
          {React.cloneElement(page, { className: styles.tab })}
        </div>
      )) : null}
    </ToolbarGroup>
  );
};

const SearchGroup = () => (
  <ToolbarGroup style={{ marginLeft: 20 }} className={styles.verticalAlign}>
    <ActionSearch style={{ marginRight: 6, opacity: '.6' }} />
    <SearchForm />
  </ToolbarGroup>
);

const AccountGroup = () => (
  <ToolbarGroup className={styles.verticalAlign}>
    <AccountWidget />
  </ToolbarGroup>
);

const SettingsGroup = ({ user }) => (
  <DropDown
    Button={IconButton}
    buttonProps={buttonProps}
    className={styles.verticalAlign}
  >
    <LocalizationMenu />
    <AccountGroup />
    {user ? <Logout /> : null}
  </DropDown>
);

const FastActionGroup = () => (
  <FlatButton
    containerElement={<Link
      to={'/events/add'}
    />}
    label={strings.form_create_event}
    icon={<Add />}
    labelPosition={'after'}
    style={{ marginLeft: 15, paddingLeft: 15, paddingRight: 15 }}
  />
);

const Header = ({ location, small, auth, showFormCreateEvents, toggleShowFormCreateEvents }) => (
  <div>
    <Toolbar style={{ padding: '8px' }} className={styles.header}>
      <div className={styles.verticalAlign}>
        <LogoGroup small={small} auth={auth} />
        {small && <LinkGroup user={auth} />}
        {/* <SearchGroup/> */}
      </div>
      <div className={styles.accountGroup}>
        {auth.user && (auth.user.user_type === 1 || (auth.user.user_type === 2 && auth.user.type === 'group')) && <FastActionGroup />}
        {<SettingsGroup user={auth.user} />}
      </div>
    </Toolbar>

    {/* <Announce location={location}/> */}

    {/* <div className={styles.adBanner}> */}
    {/* {location.pathname !== '/' && */}
    {/* <IconFootballX/> */}
    {/* } */}
    {/* </div> */}
  </div>
);

const mapStateToProps = state => ({
  small: state.browser.greaterThan.small,
  auth: state.app.metadata.data,
  showFormCreateEvents: state.app.formCreateEvents.show,
});

const mapDispatchToProps = dispatch => ({
  toggleShowFormCreateEvents: () => dispatch(toggleShowForm(FORM_NAME_CREATE_EVENTS)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
