import React from 'react';
import { connect } from 'react-redux';

/* components */
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import Spinner from 'components/Spinner';
import HotspotHeaderStats from './HotspotHeaderStats';
import HotspotHeaderButtons from './HotspotHeaderButtons';
import IconValidated from 'material-ui/svg-icons/action/check-circle';
/* data */
import strings from 'lang';
import constants from 'components/constants';
/* css */
import styled from 'styled-components';

const LARGE_IMAGE_SIZE = 124;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const TopContainer = styled.div`
    display: flex;
    flex-direction: row;

    @media only screen and (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;
const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const RegistrationBadge = styled(IconValidated)`
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
const HotspotInfo = styled.div`
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

const getRegistrationBadge = registered => registered && (
  <RegistrationBadge
    data-hint={strings.tooltip_registered_user}
    data-hint-position="top"
  />
);


const HotspotHeader = ({ hotspotId, hotspot, small, extraSmall, events, isOwner, user }) => {
  const hotspotData = hotspot.data || {};
  if (hotspot.loading) {
    return <Spinner />;
  }
  const checkedInXUsers = (events.length && events.reduce((a, b) => a + b.checkin_total, 0)) || 0;
  const registeredXUsers = (events.length && events.reduce((a, b) => a + b.register_total, 0)) || 0;

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

  return (
    <Container>
      <TopContainer>
        <ImageContainer>
          <Badge
            badgeContent={getRegistrationBadge(isOwner)}
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
        <HotspotInfo>
          <li>
            <span data="name">{hotspotData.name}</span>
          </li>
          <li>
            <span data="address">{hotspotData.address}</span>
          </li>
          {hotspotData.phone && <li>
            <span>Tel.: {hotspotData.phone}</span>
          </li>}
          {hotspotData.wifi && <li>
            <span>Wifi Password: {hotspotData.wifi}</span>
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
          {(user.user_type === 1 || isOwner) && <HotspotHeaderButtons
            hotspotId={hotspotId}
            compact={!small}
          />}

        </HotspotInfo>
      </TopContainer>
    </Container>
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