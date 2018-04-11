import React from 'react';
import { connect } from 'react-redux';
import { IconButton, Avatar, Badge } from 'material-ui';
import Spinner from 'components/Spinner';
import IconValidated from 'material-ui/svg-icons/action/check-circle';
import IconCafe from 'material-ui/svg-icons/maps/local-cafe';
import IconBeer from 'material-ui/svg-icons/maps/local-drink';
import IconStadium from 'material-ui/svg-icons/maps/local-activity';
import IconPhone from 'material-ui/svg-icons/communication/phone';
import IconEmail from 'material-ui/svg-icons/communication/email';
import IconAddress from 'material-ui/svg-icons/communication/location-on';
import strings from 'lang';
import constants from 'components/constants';
import styled from 'styled-components';
import Buttons from './Buttons';

const LARGE_IMAGE_SIZE = 124;

const Header = styled.div`
  display: flex;
  flex-direction: row;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;
const UserAvatar = styled.div`
  padding-top: 2em;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const ValidatedBadge = styled(IconValidated)`
  width: 18px;
  height: 18px;
  position: relative;

  &[data-hint-position="top"] {
    &::before {
        top: -7px;
        margin-left: 3px;
    }

    &::after {
    margin-bottom: 7px;
    margin-left: -7px;
    }
  }
`;
const UserInfo = styled.div`
  padding-top: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  > li:first-child {
    line-height: 3em;
  }
 
  > li {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    color: ${constants.colorMutedLight};
    
    @media only screen and (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
    
    & span {
      text-align: center;
      display: inline-flex;
    }
    
    & span[data='name'] {
      font-size: 28px;
      text-align: center;
    }
  }
`;
const AvatarStyled = styled(Avatar)`
  box-shadow: 0 0 15px 2px rgba(0, 0, 0, 0.4);

  @media only screen and (max-width: 768px) {
    margin-left: 0 !important;
  }
`;

const getIcon = (type) => {
  switch (type) {
    case 1:
      return (<IconButton tooltip={strings.enum_hotspot_type_1}>
        <IconCafe />
      </IconButton>);
    case 2:
      return (<IconButton tooltip={strings.enum_hotspot_type_2}>
        <IconBeer />
      </IconButton>);
    case 3:
      return (<IconButton tooltip={strings.enum_hotspot_type_3}>
        <IconStadium />
      </IconButton>);
    default:
      return (<IconButton tooltip={strings.enum_hotspot_type_1}>
        <IconCafe />
      </IconButton>);
  }
};


const HotspotHeader = (propsVar) => {
  const { user, small, extraSmall, isOwner, metadata } = propsVar;
  let userData = user.data || {};
  if (userData.cuser) {
    userData = Object.assign(userData, userData.cuser);
  } else if (userData.huser) {
    userData = Object.assign(userData, userData.huser);
  } else if (userData.guser) {
    userData = Object.assign(userData.guser);
  }
  if (user.loading) {
    return <Spinner />;
  }

  const badgeStyle = color => ({
    fontSize: 20,
    top: 5,
    left: 25,
    background: color || 'transparent',
    width: 32,
    height: 32,
    marginLeft: !small ? -1 * (LARGE_IMAGE_SIZE / 2) * 0.75 : 0,
  });

  const avatarStyle = {
    marginLeft: small ? 30 : 0,
    marginRight: extraSmall ? 30 : 0,
  };

  const iconStyle = {
    color: constants.colorMutedLight,
  };

  return (
    <Header>
      <UserAvatar>
        <Badge
          badgeContent={<ValidatedBadge />}
          badgeStyle={badgeStyle()}
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          <AvatarStyled
            src={userData.avatar || '/assets/images/no-avatar.png'}
            style={avatarStyle}
            size={LARGE_IMAGE_SIZE}
          />
        </Badge>
      </UserAvatar>
      <UserInfo>
        <li>
          <span data="name">{userData.username}</span>
          {(userData.fullname || userData.name) && <small>( {userData.name || userData.fullname} )</small>}
        </li>
        <li>
          <small>{strings[`enum_user_type_${userData.type}`]}</small>
        </li>
        {userData.email && <li>
          <span><IconEmail style={{ ...iconStyle }} /> {userData.email}</span>
        </li>}
        {userData.phone && <li>
          <span><IconPhone style={{ ...iconStyle }} /> {userData.phone}</span>
        </li>}
        {userData.address && <li>
          <span><IconAddress style={{ ...iconStyle }} /> {userData.address}</span>
        </li>}

        {(metadata.user_type === 1 || isOwner) && <Buttons
          compact={!small}
        />}
      </UserInfo>
    </Header>
  );
};

const mapStateToProps = state => ({
  user: state.app.user,
  metadata: state.app.metadata.data.user,
  events: state.app.hotspotEvents.data,
  small: state.browser.greaterThan.small,
  extraSmall: state.browser.greaterThan.extraSmall,
});

export default connect(mapStateToProps)(HotspotHeader);
