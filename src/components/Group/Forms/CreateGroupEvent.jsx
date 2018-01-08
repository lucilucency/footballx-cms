import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
/* actions & helpers */
import { createGroupEvent } from 'actions';

/* component */
import CreateEventForm from 'components/Group/Forms/CreateEventForm';

class CreateGroupEventForm extends React.Component {
  static propTypes = {
    groupId: PropTypes.number,
    createGroupEvent: PropTypes.func,
  };
  componentDidMount() {}
  render() {
    return <CreateEventForm groupId={this.props.groupId} dispatch={this.props.createGroupEvent} />;
  }
}

const mapStateToProps = state => ({
  group: state.app.group.data,
  showForm: state.app.formCreateEvent.show,
  currentQueryString: window.location.search,
  error: state.app.groupEvents.error,
});

const mapDispatchToProps = dispatch => ({
  createGroupEvent: (params, payload) => dispatch(createGroupEvent(params, payload)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateGroupEventForm));
