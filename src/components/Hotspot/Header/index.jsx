import React from 'react';
import { connect } from 'react-redux';
/* components */
import { IconButton, Avatar, Badge } from 'material-ui';
import Spinner from 'components/Spinner';
import IconValidated from 'material-ui/svg-icons/action/check-circle';
import IconCafe from 'material-ui/svg-icons/maps/local-cafe';
import IconBeer from 'material-ui/svg-icons/maps/local-drink';
import IconStadium from 'material-ui/svg-icons/maps/local-activity';
import IconPhone from 'material-ui/svg-icons/communication/phone';
import IconLocation from 'material-ui/svg-icons/communication/location-on';
import IconWifi from 'material-ui/svg-icons/notification/wifi';
/* data */
import strings from 'lang';
import constants from 'components/constants';
/* css */
import styled from 'styled-components';

import { HotspotHeaderStats } from './Stats';
import HotspotHeaderButtons from './Buttons';

const LARGE_IMAGE_SIZE = 124;

const Header = styled.div`
  display: flex;
  flex-direction: row;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;
const ImageContainer = styled.div`
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
const InfoContainer = styled.div`
  padding-top: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  & li {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    line-height: 1.5em;
    
    @media only screen and (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
    
    & span[data='name'] {
      color: rgba(245, 245, 245, 0.870588);
      font-size: 28px;
      text-align: center;
    }
    
    & span[data='address'] {
      color: rgba(245, 245, 245, 0.870588);
      font-size: 18px;
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

const getHotspotIcon = (type) => {
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
  const { hotspotId, hotspot, small, extraSmall, events, isOwner, user } = propsVar;
  const hotspotData = hotspot.data || {};
  if (hotspot.loading) {
    return <Spinner />;
  }
  const checkedInXUsers = (events && events.length && events.reduce((a, b) => a + b.checkin_total, 0)) || 0;
  const registeredXUsers = (events && events.length && events.reduce((a, b) => a + b.register_total, 0)) || 0;

  let badgeStyle = {
    fontSize: 20,
    top: 5,
    left: 40,
    background: isOwner ? constants.green : 'transparent',
    width: 18,
    height: 18,
  };

  const avatarStyle = {
    marginLeft: small ? 30 : 0,
    marginRight: extraSmall ? 30 : 0,
  };

  if (!small) {
    badgeStyle = {
      ...badgeStyle,
      marginLeft: -1 * (LARGE_IMAGE_SIZE / 2) * 0.75,
    };
  }

  const iconStyle = {
    width: 15,
    height: 15,
    color: constants.colorMutedLight,
  };

  return (
    <Header>
      <ImageContainer>
        <Badge
          badgeContent={<ValidatedBadge
            data-hint={strings.tooltip_validated}
            data-hint-position="top"
          />}
          badgeStyle={badgeStyle}
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          <AvatarStyled
            src={hotspotData.avatar || '/assets/images/footballx.png'}
            style={avatarStyle}
            size={LARGE_IMAGE_SIZE}
          />
        </Badge>
      </ImageContainer>
      <InfoContainer>
        <li>
          <span data="name">{hotspotData.name}</span>
          {hotspotData.short_name && <small>({hotspotData.short_name})</small>}
          {getHotspotIcon(hotspotData.type)}
        </li>
        <li>
          <span data="address"><IconLocation style={{ ...iconStyle }} /> {hotspotData.address}</span>
        </li>
        {hotspotData.phone && <li>
          <span><IconPhone style={{ ...iconStyle }} /> {hotspotData.phone}</span>
        </li>}
        {hotspotData.wifi && <li>
          <span><IconWifi style={{ ...iconStyle }} /> {hotspotData.wifi}</span>
        </li>}

        <HotspotHeaderStats
          loading={hotspot.loading}
          error={hotspot.error}
          compact={!small}
          events={events.length || 0}
          registeredXUsers={registeredXUsers}
          checkedInXUsers={checkedInXUsers}
          hotspot={hotspot.data}
        />
        {(user.type === 1 || isOwner) && <HotspotHeaderButtons
          hotspotId={hotspotId}
          compact={!small}
        />}

      </InfoContainer>
    </Header>
  );
};

const mapStateToProps = state => ({
  hotspot: state.app.hotspot,
  user: state.app.metadata.data.user,
  events: state.app.hotspotEvents.data,
  small: state.browser.greaterThan.small,
  extraSmall: state.browser.greaterThan.extraSmall,
});

export default connect(mapStateToProps)(HotspotHeader);
