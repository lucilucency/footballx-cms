import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
import PropTypes from 'prop-types';
/* actions & helpers */
import { toggleShowForm } from 'actions/formActions';
import { createHotspot } from 'actions';
/* data */
import strings from 'lang';
/* components */
import { TextField, RaisedButton } from 'material-ui';
import Error from 'components/Error/index';
import Spinner from 'components/Spinner/index';
import MapWithSearchBox from '../../Visualizations/GoogleMap/MapWithSearchBox';
/* css */
import styles from './index.css';

export const FORM_NAME_CREATE_EVENT = 'createHotspot';

class CreateHotspotForm extends React.Component {
  constructor() {
    super();
    this.state = {
      hotspot: { name: {}, address: {}, lon: {}, lat: {}, phone: {}, wifi: {} },
    };

    this.submitCreateHotspot = this.submitCreateHotspot.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
  }

  componentDidMount() {
    //
  }

  onPlaceChanged(places) {
    const that = this;
    console.log('Got from maps: ');
    console.log(places[0]);
    if (places.length) {
      const viewport = places[0].geometry.viewport;
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

  submitCreateHotspot() {
    const that = this;
    const newHotspot = {
      name: that.state.hotspot.name.value,
      address: that.state.hotspot.address.value,
      lon: that.state.hotspot.lon.value,
      lat: that.state.hotspot.lat.value,
      phone: that.state.hotspot.phone && that.state.hotspot.phone.value,
      wifi: that.state.hotspot.wifi && that.state.hotspot.wifi.value,
    };

    that.props.postHotspot(newHotspot).then((dispatch) => {
      if (dispatch.type.indexOf('OK') === 0) {
        console.log('success');
        that.props.history.push('/hotspots/all');
      } else {
        console.log('fail');
      }
    });
  }

  render() {
    const {
      loading,
    } = this.props;

    return (
      <div id={'CreateHotspotForm'}>
        {loading && <Spinner />}
        {this.state.error && <Error text={this.state.error} />}

        <MapWithSearchBox onChanged={this.onPlaceChanged} />

        <div className={styles.formGroup}>
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
            value={this.state.hotspot.name && this.state.hotspot.name.value}
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
            value={this.state.hotspot.address && this.state.hotspot.address.value}
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
            value={this.state.hotspot.phone && this.state.hotspot.phone.value}
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
            value={this.state.hotspot.wifi && this.state.hotspot.wifi.value}
            errorText={this.state.hotspot.wifi && this.state.hotspot.wifi.error}
          />
        </div>
        <RaisedButton style={{ float: 'right' }} label={strings.form_edit_hotspot_submit} primary onClick={event => this.submitCreateHotspot(event)} />
      </div>
    );
  }
}

CreateHotspotForm.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  loading: state.app.hotspots.loading,
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: () => dispatch(toggleShowForm(FORM_NAME_CREATE_EVENT)),
  postHotspot: params => dispatch(createHotspot(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateHotspotForm));
