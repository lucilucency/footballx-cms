/* global FX_API, FX_VERSION */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
/* actions & helpers */
import { editHotspot } from 'actions';
import { toggleShowForm } from 'actions/formActions';
import _ from 'lodash';
/* data & components */
import strings from 'lang';
import { TextField, RaisedButton } from 'material-ui';
import Error from 'components/Error/index';
import MapWithSearchBox from 'components/Visualizations/GoogleMap/MapWithSearchBox';
/* css */
import styled, { css } from 'styled-components';

const FormContainer = styled.div`
    transition: max-height 1s;
    padding: 15px;
    box-sizing: border-box;
    overflow: hidden;
    padding: 0 15px;
    box-sizing: border-box;
    ${props => (props.show ? css`
        max-height: 2000px;
    ` : css`
        max-height: 0;
    `)}
`;

export const FORM_NAME_EDIT_HOTSPOT = 'editHotspot';

const setShowFormState = (props) => {
  if (Boolean(props.currentQueryString.substring(1)) !== props.showForm) {
    // If query string state has a filter, turn on the form
    props.toggleShowForm('editHotspot');
  }
};

class EditHotspotForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotspot: {},
    };
    this.submitEditHotspot = this.submitEditHotspot.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
  }

  componentDidMount() {
    // setShowFormState(this.props);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.hotspot.id !== this.props.hotspot.id) {
      setShowFormState(nextProps);
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      hotspot: {
        name: { value: newProps.hotspot.name },
        address: { value: newProps.hotspot.address },
        phone: { value: newProps.hotspot.phone || '' },
        wifi: { value: newProps.hotspot.wifi || '' },
        lon: { value: newProps.hotspot.coordinate && newProps.hotspot.coordinate.lon },
        lat: { value: newProps.hotspot.coordinate && newProps.hotspot.coordinate.lat },
      },
    });
  }

  submitEditHotspot(e) {
    const that = this;
    const editedHotspot = {
      name: that.state.hotspot.name.value,
      address: that.state.hotspot.address.value,
      phone: that.state.hotspot.phone.value,
      wifi: that.state.hotspot.wifi.value,
      lon: that.state.hotspot.lon.value,
      lat: that.state.hotspot.lat.value,
    };

    that.props.putHotspot(that.props.hotspot.id, editedHotspot).then((dispatch) => {
      if (dispatch.type.indexOf('OK') === 0) {
        console.log('success');
        that.props.toggleShowForm(FORM_NAME_EDIT_HOTSPOT);
      } else {
        console.log('fail');
      }
    });
  }

  onPlaceChanged(places) {
    const that = this;
    console.log('Got from maps: ');
    console.log(places[0]);
    if (places.length) {
      const viewport = places[0].geometry && places[0].geometry.viewport;
      that.setState({
        hotspot: update(that.state.hotspot, {
          name: { $set: { value: places[0].name } },
          address: { $set: { value: places[0].formatted_address } },
          lon: { $set: { value: (viewport.b.b + viewport.b.f) / 2 } },
          lat: { $set: { value: (viewport.f.b + viewport.f.f) / 2 } },
        }),
      });
    }
  }

  render() {
    const {
      showForm,
    } = this.props;

    return (
      <div>
        {this.props.error && <Error text={this.props.error} />}
        <FormContainer show={showForm}>
          <MapWithSearchBox
            onChanged={this.onPlaceChanged}
            marker={{
              lat: this.state.hotspot.lat && parseFloat(this.state.hotspot.lat.value),
              lng: this.state.hotspot.lon && parseFloat(this.state.hotspot.lon.value),
            }}
          />
          <div>
            {/* input name */}
            <TextField
              type="text"
              hintText={strings.tooltip_hotspot_name}
              floatingLabelText={strings.tooltip_hotspot_name}
              onChange={(event, name) => this.setState({
                hotspot: update(this.state.hotspot, {
                  name: { $set: { value: name } },
                }),
              })}
              fullWidth
              value={this.state.hotspot.name && this.state.hotspot.name.value || ''}
              errorText={this.state.hotspot.name && this.state.hotspot.name.error}
            />

            {/* input address */}
            <TextField
              type="text"
              hintText={strings.tooltip_hotspot_address}
              floatingLabelText={strings.tooltip_hotspot_address}
              onChange={(event, address) => this.setState({
                hotspot: update(this.state.hotspot, {
                  address: { $set: { value: address } },
                }),
              })}
              fullWidth
              value={this.state.hotspot.address && this.state.hotspot.address.value || ''}
              errorText={this.state.hotspot.address && this.state.hotspot.address.error}
            />

            {/* input tel. */}
            <TextField
              type="text"
              hintText={strings.tooltip_hotspot_phone}
              floatingLabelText={strings.tooltip_hotspot_phone}
              onChange={(event, phone) => this.setState({
                hotspot: update(this.state.hotspot, {
                  phone: { $set: { value: phone } },
                }),
              })}
              fullWidth
              value={this.state.hotspot.phone && this.state.hotspot.phone.value || ''}
              errorText={this.state.hotspot.phone && this.state.hotspot.phone.error}
            />

            {/* input address */}
            <TextField
              type="text"
              hintText={strings.tooltip_hotspot_wifi}
              floatingLabelText={strings.tooltip_hotspot_wifi}
              onChange={(event, wifi) => this.setState({
                hotspot: update(this.state.hotspot, {
                  wifi: { $set: { value: wifi } },
                }),
              })}
              fullWidth
              value={this.state.hotspot.wifi && this.state.hotspot.wifi.value || ''}
              errorText={this.state.hotspot.wifi && this.state.hotspot.wifi.error}
            />
          </div>

          <RaisedButton
            style={{ float: 'right' }}
            label={strings.form_edit_hotspot_submit}
            primary
            onClick={event => this.submitEditHotspot(event)}
          />
        </FormContainer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showForm: state.app.formEditHotspot.show,
  currentQueryString: window.location.search,
  error: state.app.hotspot.error,
  loading: state.app.hotspot.loading,
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: formName => dispatch(toggleShowForm(formName)),
  putHotspot: (hotspotId, params) => dispatch(editHotspot(hotspotId, params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditHotspotForm));
