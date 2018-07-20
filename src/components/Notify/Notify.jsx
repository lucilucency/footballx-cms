import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import {
  getEvent, getEventXUsers,
} from 'actions';
import strings from 'lang';
import CreateNotificationForm from './Forms/createNotification';

class RequestLayer extends React.Component {
  static propTypes = {
    userData: PropTypes.shape({}),
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  };
  componentDidMount() {

  }

  render() {
    const { userData } = this.props;
    if (!userData) {
      this.props.history.push('/login');
      return false;
    }

    if (userData.user.type === 1) {
      return (<div>
        <Helmet title={strings.title_group_husers} />
        <CreateNotificationForm toggle={false} />
      </div>);
    }

    return false;
  }
}

const mapStateToProps = state => ({
  userData: state.app.metadata.data,
  event: state.app.event,
});

const mapDispatchToProps = dispatch => ({
  getEvent: eventId => dispatch(getEvent(eventId)),
  getEventXUsers: eventId => dispatch(getEventXUsers(eventId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
