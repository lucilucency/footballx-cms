import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
/* actions & helpers */
import { createEvent } from 'actions';
/* components */
import CreateEventForm from 'components/Event/Forms/CreateEditEventForm';

class CreateEventsForm extends React.Component {
  componentDidMount() {
  }

  render() {
    return <CreateEventForm dispatch={this.props.createEvent} toggle={false} />;
  }
}

CreateEventsForm.propTypes = {
  createEvent: PropTypes.func,
};

// const mapStateToProps = state => ({
//   currentQueryString: window.location.search,
// });

const mapDispatchToProps = dispatch => ({
  createEvent: params => dispatch(createEvent(params)),
});

export default withRouter(connect(null, mapDispatchToProps)(CreateEventsForm));
