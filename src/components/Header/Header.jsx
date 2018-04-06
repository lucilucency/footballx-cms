/* global FX_API, FX_VERSION */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleShowForm } from 'actions';
import strings from 'lang';
import styled from 'styled-components';
import constants from 'components/constants';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import IconUpdate from 'material-ui/svg-icons/action/update';
import NoficationIcon from 'material-ui/svg-icons/social/notifications-active';
import Add from 'material-ui/svg-icons/av/playlist-add';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import FlatButton from 'material-ui/FlatButton';
import { LocalizationMenu } from 'components/Header/Localization';
import AccountWidget from './AccountWidget';
import DropDown from './Dropdown';
import Logout from './Logout';
// import Announce from 'components/Announce';
// import SearchForm from '../Search/SearchForm';
// import ActionSearch from 'material-ui/svg-icons/action/search';
import AppLogo from '../App/AppLogo';
import BurgerMenu from './BurgerMenu/index';

const navbarPages = [
  <Link key={strings.header_clubs} to="/clubs">{strings.header_clubs}</Link>,
];

const navbarPagesGUser = user => [
  <Link key={strings.header_matches} to="/matches">{strings.header_matches}</Link>,
  user && user.group_id &&
  <Link key={strings.header_events} to={`/group/${user.group_id}`}>{strings.header_my_group}</Link>,
];

const navbarPagesHUser = hotspot => ([
  <Link key={strings.header_matches} to="/matches">{strings.header_matches}</Link>,
  hotspot && hotspot.id && <Link
    key={strings.header_events}
    to={`/hotspot/${hotspot.id}`}
  >{strings.header_my_hotspot}</Link>,
]);

const navbarPagesCUser = [
  <Link key={strings.header_matches} to="/matches">{strings.header_matches}</Link>,
  <Link key={strings.header_hotspots} to="/hotspots">{strings.header_hotspots}</Link>,
  <Link key={strings.header_groups} to="/groups">{strings.header_groups}</Link>,
  <Link key={strings.header_events} to="/events">{strings.header_events}</Link>,
  <Link key={strings.header_cards} to="/cards">{strings.header_cards}</Link>,
];

const burgerItems = (user, hotspot, group) => {
  const burgerHUser = (user && user.user_type === 2) ? navbarPagesHUser(hotspot) : [];
  const burgerGUser = (user && user.user_type === 3) ? navbarPagesGUser(group) : [];
  const burgerCUser = (user && user.user_type === 1) ? navbarPagesCUser : [];
  return [
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
};

const buttonProps = {
  children: <ActionSettings />,
};

const VerticalAlignToolbar = styled(ToolbarGroup)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDropdown = styled(DropDown)`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const VerticalAlignDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LogoGroup = (propsVar) => {
  const { small, auth } = propsVar;

  return (
    <VerticalAlignToolbar>
      {!small &&
      <BurgerMenu menuItems={burgerItems(auth.user, auth.hotspot)} />}
      <AppLogo style={{ marginRight: 18 }} />
    </VerticalAlignToolbar>
  );
};

const LinkGroup = (propsVar) => {
  const { user, hotspot } = propsVar.user;
  return (
    <VerticalAlignToolbar>
      {navbarPages.map(page => (
        <TabContainer key={page.key}>
          <div style={{
            margin: '0 10px',
            textAlign: 'center',
            fontWeight: `${constants.fontWeightNormal} !important`,
          }}
          >
            {page}
          </div>
        </TabContainer>
      ))}
      {(user && user.user_type === 2) && navbarPagesHUser(hotspot).map(page => (
        <TabContainer key={page.key}>
          <div style={{
            margin: '0 10px',
            textAlign: 'center',
            fontWeight: `${constants.fontWeightNormal} !important`,
          }}
          >
            {page}
          </div>
        </TabContainer>
      ))}
      {(user && user.user_type === 3) && navbarPagesGUser(user).map(page => (
        <TabContainer key={page.key}>
          <div style={{
            margin: '0 10px',
            textAlign: 'center',
            fontWeight: `${constants.fontWeightNormal} !important`,
          }}
          >
            {page}
          </div>
        </TabContainer>
      ))}
      {(user && user.user_type === 1) ? navbarPagesCUser.map(page => (
        <TabContainer key={page.key}>
          <div style={{
            margin: '0 10px',
            textAlign: 'center',
            fontWeight: `${constants.fontWeightNormal} !important`,
          }}
          >
            {page}
          </div>
        </TabContainer>
      )) : null}
    </VerticalAlignToolbar>
  );
};

// const SearchGroup = () => (
//   <VerticalAlignToolbar>
//     <ActionSearch style={{ marginRight: 6, opacity: '.6' }} />
//     <SearchForm />
//   </VerticalAlignToolbar>
// );

const SettingsGroup = (propsVar) => {
  const { user } = propsVar;
  return (
    <VerticalAlignDropdown
      Button={IconButton}
      buttonProps={buttonProps}
    >
      <VerticalAlignToolbar>
        <AccountWidget />
      </VerticalAlignToolbar>
      <LocalizationMenu />
      {user && user.user_type === 1 && <Link to={'/notify'}>
        <FlatButton
          label={strings.header_send_notification}
          hoverColor="transparent"
          icon={<NoficationIcon />}
        />
      </Link>}
      {user && user.user_type === 1 && <Link to={'/settings'}>
        <FlatButton
          label={'Settings'}
          hoverColor="transparent"
          icon={<ActionSettings />}
        />
      </Link>}
      {user && user.user_type === 1 && <FlatButton
        icon={<IconUpdate />}
        onClick={() => {
          fetch(`${FX_API}/${FX_VERSION}/content`, { method: 'POST' });
        }}
        label={strings.app_update_content_data}
      />}
      {user ? <Logout /> : null}
    </VerticalAlignDropdown>
  );
};

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

const ToolbarHeader = styled(Toolbar)`
  background-color: ${constants.defaultPrimaryColor} !important;
  padding: 8px !important;
  & a {
    color: ${constants.primaryTextColor};

    &:hover {
      color: ${constants.primaryTextColor};
      opacity: 0.6;
    }
  }
`;

const Header = (propsVar) => {
  const {
    // location,
    small,
    auth,
  } = propsVar;

  return (
    <div>
      <ToolbarHeader>
        <VerticalAlignDiv>
          <LogoGroup small={small} auth={auth} />
          {small && <LinkGroup user={auth} />}
          {/* <SearchGroup/> */}
        </VerticalAlignDiv>
        <VerticalAlignDiv>
          {auth.user && (auth.user.user_type === 1 || (auth.user.user_type === 2 && auth.user.type === 'group')) &&
          <FastActionGroup />}
          {<SettingsGroup user={auth.user} />}
        </VerticalAlignDiv>

        {/* <Announce location={location}/> */}

        {/* <div className={styles.adBanner}> */}
        {/* {location.pathname !== '/' && */}
        {/* <IconFootballX/> */}
        {/* } */}
        {/* </div> */}
      </ToolbarHeader>
    </div>
  );
};

const mapStateToProps = state => ({
  small: state.browser.greaterThan.small,
  auth: state.app.metadata.data,
  showFormCreateEvents: state.app.formCreateEvents.show,
});

const mapDispatchToProps = dispatch => ({
  toggleShowFormCreateEvents: () => dispatch(toggleShowForm('createEvent')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
