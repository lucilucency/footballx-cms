/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getOrdinal, transformations } from 'utils';
import { toDateTimeString } from 'utils/time';
import strings from 'lang';
import { messaging } from '_firebase';
/* components */
import Container from 'components/Container';
import { IconFacebook } from 'components/Icons';
import Table from 'components/Table';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconPlace from 'material-ui/svg-icons/maps/place';
import IconPhone from 'material-ui/svg-icons/communication/phone';
import IconWifi from 'material-ui/svg-icons/notification/wifi';

/* css */
import styled, { css } from 'styled-components';
import constants from 'components/constants';

const eventXUsersColumns = (user, event) => [{
  displayName: strings.th_no,
  displayFn: (row, col, field, index) => row.event_status === 'checkin' && getOrdinal(index + 1),
}, {
  displayName: strings.th_xuser,
  tooltip: strings.tooltip_hero_id,
  field: 'nickname',
  displayFn: transformations.th_xuser_image,
  sortFn: true,
}, false && user.user_type === 1 && {
  displayName: '',
  field: 'facebook_id',
  displayFn: (row, col, field) => (<div>
    <a href={`https://www.facebook.com/${field}`} target="_blank"><IconFacebook width={24} height={24} /></a>
  </div>),
}, {
  displayName: strings.th_status,
  tooltip: strings.tooltip_status,
  field: 'event_status',
  displayFn: (row) => {
    let color = event.free_folk_color;
    if (row.favorite_club) {
      if (parseInt(row.favorite_club) === parseInt(event.home)) color = event.home_color;
      else if (parseInt(row.favorite_club) === parseInt(event.away)) color = event.away_color;
    }

    const Status = styled.div`
      ${props => props.status === 'checkin' && css`
          filter: drop-shadow(0 0 5px ${color});
      `}
      ${props => props.status === 'registered' && css`
          color: ${constants.colorMuted}
      `}
    `;
    Status.propTypes = { status: PropTypes.string };

    return (<div>
      <Status status={row.event_status}>{row.event_status}</Status>
      <span style={{ display: 'block', color: constants.colorMutedLight }}>{toDateTimeString(new Date(row.event_updated_at))}</span>
    </div>);
  },
  sortFn: true,
}];

const OverviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    @media only screen and (max-width: 1080px) {
      flex-direction: column-reverse;
    }
`;

const XUsersContainer = styled.div`
  width: calc(65% - 15px);
  margin-right: 15px;

  @media only screen and (max-width: 1080px) {
    width: 100%;
    margin-right: 0;
  }
`;

const HotspotContainer = styled.div`
  width: 35%;

  @media only screen and (max-width: 1080px) {
    width: 100%;
  }
`;

class AllEvents extends React.Component {
  static propTypes = {
    event: PropTypes.shape({}),
    eventXUsers: PropTypes.shape([]),
    user: PropTypes.shape({}),
  };

  componentDidMount() {
    // const eventId = this.props.props.match.params.eventId;
    // this.props.getEventXUsers(eventId);

    messaging.onMessage(function(payload) {
      console.log('vklllllll');
      console.log('Message received. ', payload);
      // ...
    });

    // messaging.useServiceWorker().then(function () {
    //   messaging.requestPermission()
    //     .then(function() {
    //       console.log('Notification permission granted.');
    //       messaging.getToken()
    //         .then(function(currentToken) {
    //           if (currentToken) {
    //             console.log(currentToken);
    //             this.setState({
    //               pushToken: currentToken
    //             });
    //
    //           } else {
    //             // Show permission request.
    //             console.log('No Instance ID token available. Request permission to generate one.');
    //             // Show permission UI.
    //           }
    //         })
    //         .catch(function(err) {
    //           console.log('An error occurred while retrieving token. ', err);
    //         });
    //     })
    //     .catch(function(err) {
    //       console.log('Unable to get permission to notify.', err);
    //     });
    //
    //   messaging.onMessage(function(payload) {
    //     console.log("Message received. ", payload);
    //     // ...
    //   });
    // })
  }

  render() {
    const { event, eventXUsers, user } = this.props;
    const eventData = event.data;
    const eventId = eventData.event_id;
    let xusers = eventXUsers.data;

    xusers = xusers.sort((a, b) => {
      const aDate = new Date(a.event_updated_at);
      const bDate = new Date(b.event_updated_at);

      if (b.event_status === 'checkin') {
        if (a.event_status === 'checkin') {
          return (aDate - bDate);
        }
        return 1;
      }
      return -1;
    });

    return (<div>
      <div><i>*{strings.event_notes}: {eventData.notes}</i></div>
      <OverviewContainer>
        <XUsersContainer>
          <Container
            title={`${strings.heading_xmember} (${this.props.eventXUsers.data.filter(o => o.event_status === 'checkin').length} | ${this.props.eventXUsers.data.length})`}
            titleTo={`/events/${eventId}/xusers`}
            loading={eventXUsers.loading}
            error={false}
          >
            <Table
              columns={eventXUsersColumns(user, event.data)}
              data={xusers}
              loading={eventXUsers.loading}
              error={false}
              paginated={false}
              pageLength={30}
            />
          </Container>
        </XUsersContainer>
        <HotspotContainer>
          <Container
            title={strings.th_hotspot}
            titleTo={`/hotspot/${eventData.hotspot_id}`}
            loading={false}
            error={false}
          >
            <div>
              <List>
                <ListItem
                  leftIcon={<IconPlace />}
                  primaryText={eventData.hotspot_name}
                  secondaryText={eventData.hotspot_address}
                />
                {eventData.hotspot_phone && <ListItem
                  insetChildren
                  leftIcon={<IconPhone />}
                  primaryText={eventData.hotspot_phone}
                />}
              </List>
              {eventData.hotspot_wifi && <Divider inset />}
              {eventData.hotspot_wifi && <List>
                <ListItem
                  leftIcon={<IconWifi />}
                  primaryText={eventData.hotspot_wifi}
                  secondaryText={eventData.hotspot_wifi_password}
                />
              </List>}
            </div>
          </Container>
        </HotspotContainer>
      </OverviewContainer>
    </div>);
  }
}

// const mapDispatchToProps = dispatch => ({
// getEventXUsers: (eventId) => dispatch(getEventXUsers(eventId)),
// });

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  event: state.app.event,
  eventXUsers: state.app.eventXUsers,
});

export default connect(mapStateToProps, null)(AllEvents);

