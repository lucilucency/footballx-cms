/* eslint-disable react/prefer-stateless-function,react/forbid-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
/* actions & helpers */
import { createHotspotEvent, toggleShowForm } from 'actions';

/* component */
import CreateEventForm from 'components/Event/Forms/CreateEventForm';

class CreateHotspotEventForm extends React.Component {
  static propTypes = {
    toggleShowForm: PropTypes.func,
    showForm: PropTypes.bool,
    event: PropTypes.object,
  };


  render() {
    return (<CreateEventForm
      callback={() => {
        this.props.toggleShowForm(false);
      }}
      showForm={this.props.showForm}
      event={this.props.event}
      isEditing
    />);
  }
}

const mapStateToProps = state => ({
  event: state.app.event.data,
  showForm: state.app.formEditEvent.show,
  currentQueryString: window.location.search,
  error: state.app.hotspotEvents.error,
});

const mapDispatchToProps = dispatch => ({
  createHotspotEvent: (params, payload) => dispatch(createHotspotEvent(params, payload)),
  toggleShowForm: () => dispatch(toggleShowForm('editEvent')),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateHotspotEventForm));
