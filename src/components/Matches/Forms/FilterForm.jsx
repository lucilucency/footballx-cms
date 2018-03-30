import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'querystring';
/* actions & helpers */
import { toggleShowForm } from 'actions/dispatchForm';
/* components */
import FormField from 'components/Form/FormField';
import strings from 'lang';
/* css */
import styled, { css } from 'styled-components';
/* data */
import * as data from './FilterForm.config';

const FormGroup = styled.div`
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    
    @media only screen and (max-width: 660px) {
      justify-content: center;
    }
`;

const FormGroupWrapper = styled.div`
    overflow: hidden;
    transition: max-height 0.2s;
    ${props => (props.show ? css`
        max-height: 1000px;
    ` : css`
        max-height: 0px;
    `)}
`;

const setShowFormState = (props) => {
  const currentQueryString = window.location.search;
  if (Boolean(currentQueryString.substring(1)) !== props.showForm) {
    // If query string state has a filter, turn on the form
    props.toggleShowForm();
  }
};

class FilterForm extends React.Component {
  static propTypes = {
  };
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
    setShowFormState(this.props);
  }

  render() {
    const { showForm, history } = this.props;
    const currentQueryString = window.location.search;
    const formSelectionState = queryString.parse(currentQueryString.substring(1));

    return (
      <FormGroupWrapper show={showForm}>
        <FormGroup>
          <FormField
            name="league_id"
            label={'League'}
            dataSource={data.leagueList}
            formSelectionState={formSelectionState}
            history={history}
            // limit={5}
          />
          <FormField
            name="clubs"
            label={strings.filter_club}
            dataSource={data.clubList}
            formSelectionState={formSelectionState}
            history={history}
            // limit={5}
          />
        </FormGroup>
      </FormGroupWrapper>
    );
  }
}

FilterForm.propTypes = {
  showForm: PropTypes.bool,
  history: PropTypes.shape({}),
};

const mapStateToProps = state => ({
  showForm: state.app.formFilter.show,
  // currentQueryString: window.location.search,
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: () => dispatch(toggleShowForm('filter')),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterForm));
