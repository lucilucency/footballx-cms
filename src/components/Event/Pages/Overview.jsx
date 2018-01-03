import React from 'react';
import { connect } from 'react-redux';
/* components */
import Container from 'components/Container';
import { IconFacebook } from 'components/Icons';
import Table, { TableLink } from 'components/Table';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconPlace from 'material-ui/svg-icons/maps/place';
import IconPhone from 'material-ui/svg-icons/communication/phone';
import { indigo500 } from 'material-ui/styles/colors';
import IconWifi from 'material-ui/svg-icons/notification/wifi';
/* actions & helpers */
import { getEventXUsers } from 'actions';
import { transformations, getOrdinal } from 'utility';
import { toDateTimeString } from 'utility/time';
import strings from 'lang';
/* css */
import { css } from 'styled-components';
import styled from 'styled-components';
import constants from 'components/constants';

const MAX_XUSERS_ROWS = 100;

const eventXUsersColumns = (user, event) => [{
  displayName: strings.th_no,
  displayFn: (row, col, field, index) => row.event_status === 'checkin' && getOrdinal(index + 1),
}, {
  displayName: strings.th_xuser,
  tooltip: strings.tooltip_hero_id,
  field: 'nickname',
  displayFn: transformations.th_xuser_image,
  sortFn: true,
}, user.user_type === 1 && {
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
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // const eventId = this.props.props.match.params.eventId;
    // this.props.getEventXUsers(eventId);
  }

  componentWillUpdate(nextProps) {

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
              paginated
              columns={eventXUsersColumns(user, event.data)}
              data={xusers}
              loading={eventXUsers.loading}
              error={false}
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

const mapDispatchToProps = dispatch => ({
  // getEventXUsers: (eventId) => dispatch(getEventXUsers(eventId)),
});

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  event: state.app.event,
  eventXUsers: state.app.eventXUsers,
});

export default connect(mapStateToProps, mapDispatchToProps)(AllEvents);

