/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
/* actions & helpers */
import { createHotspotEvent, toggleShowForm } from 'actions';

/* component */
import CreateEventForm from 'components/Event/Forms/CreateEditEventForm';

class CreateHotspotEventForm extends React.Component {
  static propTypes = {
    hotspotId: PropTypes.number,
    createHotspotEvent: PropTypes.func,
    toggleShowForm: PropTypes.func,
    showForm: PropTypes.bool,
  };

  render() {
    return (<CreateEventForm
      display={this.props.showForm}
      toggle
      mode="create"
      callback={() => {
        this.props.toggleShowForm(false);
      }}

      hotspotId={Number(this.props.hotspotId)}
      dispatch={this.props.createHotspotEvent}
    />);
  }
}

const mapStateToProps = state => ({
  hotspot: state.app.hotspot.data,
  showForm: state.app.formCreateEvent.show,
  currentQueryString: window.location.search,
  error: state.app.hotspotEvents.error,
});

const mapDispatchToProps = dispatch => ({
  createHotspotEvent: (params, payload) => dispatch(createHotspotEvent(params, payload)),
  toggleShowForm: state => dispatch(toggleShowForm('createEvent', state)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateHotspotEventForm));
