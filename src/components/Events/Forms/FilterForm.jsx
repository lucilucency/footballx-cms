import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'querystring';
/* actions & helpers */
import { getHotspots } from 'actions';
import { toggleShowForm } from 'actions/formActions';
/* components */
import FormField from 'components/Form/FormField';
/* data */
import * as data from './FilterForm.config';
import strings from 'lang';
/* css */
import { css } from 'styled-components';
import styled from 'styled-components';

const FormGroup = styled.div`
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
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

export const FORM_NAME_FILTER = 'filter';

const setShowFormState = (props) => {
  if (Boolean(props.currentQueryString.substring(1)) !== props.showForm) {
    console.log('do toggle');
    // If query string state has a filter, turn on the form
    props.toggleShowForm();
  }
};

class FilterForm extends React.Component {
  constructor() {
    super();
    this.state = {
      hotspots: [],
    };
  }

  componentDidMount() {
    setShowFormState(this.props);
    this.props.getHotspots();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.playerId !== this.props.playerId) {
      setShowFormState(nextProps);
      this.props.getHotspots();
    }
  }

  render() {
    const { showForm, currentQueryString, history } = this.props;
    const formSelectionState = queryString.parse(currentQueryString.substring(1));

    return (
      <FormGroupWrapper show={showForm}>
        <FormGroup>
          <FormField
            name="hotspot_id"
            label={strings.filter_hotspot}
            dataSource={this.props.hotspots.map(peer => ({ text: `${peer.name}`, value: peer.id }))}
            formSelectionState={formSelectionState}
            history={history}
            limit={5}
          />
          <FormField
            name="clubs"
            label={strings.filter_club}
            dataSource={data.clubList}
            formSelectionState={formSelectionState}
            history={history}
            limit={5}
          />
          <FormField
            name="status"
            label={strings.filter_status}
            dataSource={data.statusList}
            formSelectionState={formSelectionState}
            history={history}
            limit={5}
          />
          <FormField
            name="place"
            label={strings.filter_place}
            dataSource={data.placeList}
            formSelectionState={formSelectionState}
            history={history}
            limit={5}
          />
        </FormGroup>
      </FormGroupWrapper>
    );
  }
}

FilterForm.propTypes = {
  showForm: PropTypes.bool,
  currentQueryString: PropTypes.string,
  history: PropTypes.shape({}),
  playerId: PropTypes.string,
};

const mapStateToProps = state => ({
  showForm: state.app.formFilter.show,
  currentQueryString: window.location.search,
  hotspots: state.app.hotspots.data || [],
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: () => dispatch(toggleShowForm(FORM_NAME_FILTER)),
  getHotspots: () => dispatch(getHotspots()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterForm));
