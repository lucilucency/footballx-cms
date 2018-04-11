/* eslint-disable react/forbid-prop-types,max-len,no-confusing-arrow */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { Row, Col, bindAll, FormWrapper } from 'utils';
import { createHotspot as defaultCreateFn, editHotspot as defaultEditFn, deleteHotspot } from 'actions';
import strings from 'lang';
import constants from 'components/constants';
import {
  AutoComplete,
  Dialog,
  FlatButton,
  List,
  ListItem,
  TextField,
} from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import CircularProgress from 'material-ui/CircularProgress';

import Error from 'components/Error/index';
import Spinner from 'components/Spinner/index';
import MapWithSearchBox from 'components/Visualizations/GoogleMap/MapWithSearchBox';

const initialState = ({
  formData: {
    name: {},
    short_name: {},
    address: {},
    lon: {},
    lat: {},
    phone: {},
    wifi: {},
    type: {},
  },
  payload: {},
  submitResults: {
    data: [],
    show: false,
  },
});

class CreateEditHotspotForm extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
    display: PropTypes.bool,
    toggle: PropTypes.bool,
    popup: PropTypes.bool,
    loading: PropTypes.bool,
    callback: PropTypes.func,

    dsHotspotType: PropTypes.array,
  };

  static defaultProps = {
    mode: 'create',
    display: true,
    toggle: false,
    popup: false,
    loading: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
    };
    bindAll([
      'getFormData',
      'submit',
      'deleteHotspot',
      'closeDialog',
      'onPlaceChanged',
    ], this);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {
    if (newProps.mode === 'edit') {
      const __type = () => {
        const __find = newProps.dsHotspotType.find(o => o.value === Number(newProps.hotspot.type));
        return __find && __find.text;
      };

      this.setState({
        formData: {
          hotspot_id: { value: newProps.hotspot.id },
          name: { value: newProps.hotspot.name, text: newProps.hotspot.name && newProps.hotspot.name.toString() },
          short_name: { value: newProps.hotspot.short_name, text: newProps.hotspot.short_name && newProps.hotspot.short_name.toString() },
          address: { value: newProps.hotspot.address, text: newProps.hotspot.address && newProps.hotspot.address.toString() },
          phone: { value: newProps.hotspot.phone, text: newProps.hotspot.phone && newProps.hotspot.phone.toString() },
          lon: { value: newProps.hotspot.coordinate && parseFloat(newProps.hotspot.coordinate.lon), text: newProps.hotspot.coordinate && newProps.hotspot.coordinate.lon.toString() },
          lat: { value: newProps.hotspot.coordinate && parseFloat(newProps.hotspot.coordinate.lat), text: newProps.hotspot.coordinate && newProps.hotspot.coordinate.lat.toString() },
          wifi: { value: newProps.hotspot.wifi },
          type: { value: newProps.hotspot.type, text: __type() },
        },
      });
    }
  }

  onPlaceChanged(places) {
    const that = this;
    console.log('Got from maps: ');
    console.log(places[0]);
    if (places.length) {
      const viewport = places[0].geometry.viewport;
      that.setState({
        formData: update(that.state.formData, {
          name: { $set: { value: places[0].name } },
          short_name: { $set: { value: places[0].name } },
          address: { $set: { value: places[0].formatted_address } },
          phone: { $set: { value: places[0].formatted_phone_number } },
          lon: { $set: { value: (viewport.b.b + viewport.b.f) / 2 } },
          lat: { $set: { value: (viewport.f.b + viewport.f.f) / 2 } },
        }),
      });
    }
  }

  getFormData() {
    const formData = this.state.formData;

    return {
      name: formData.name.value,
      short_name: formData.short_name.value,
      address: formData.address.value,
      phone: formData.phone.value,
      lon: formData.lon.value,
      lat: formData.lat.value,
      wifi: formData.wifi.value,
      type: formData.type.value || 1,
    };
  }

  clearState() {
    this.setState(initialState(this.props));
  }

  submit() {
    const that = this;

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
      }),
    }, () => {
      const createFn = that.props.dispatch ? that.props.dispatch : that.props.defaultCreateFunction;
      const editFn = that.props.dispatch ? that.props.dispatch : that.props.defaultEditFunction;

      const doSubmit = new Promise((resolve) => {
        that.setState({
          submitResults: update(that.state.submitResults, {
            data: {
              $push: [{
                submitAction: that.props.mode === 'edit' ? 'Updating hotspot' : 'Creating hotspot',
                submitting: true,
              }],
            },
          }),
        });
        const submitData = this.getFormData();
        if (that.props.mode === 'edit') {
          resolve(editFn(that.props.hotspot.id, submitData));
        } else {
          resolve(createFn(submitData, this.state.payload));
        }
      });

      // var p1 = Promise.resolve(3);
      // var p2 = 1337;
      // const p3 = new Promise((resolve, reject) => {
      //   setTimeout(resolve, 10000, 'foo');
      // });

      Promise.all([doSubmit]).then((results) => {
        const resultsReport = [];
        if (results[0].type.indexOf('OK') === 0) {
          resultsReport.push({
            submitAction: that.props.mode === 'edit' ? 'Update hotspot successfully' : 'Create hotspot successfully',
            submitting: false,
          });

          that.setState({
            formData: update(that.state.formData, {
              hotspot_id: {
                $set: {
                  value: results[0].payload.id,
                },
              },
            }),
          });
        } else {
          resultsReport.push({
            submitAction: that.props.mode === 'edit' ? 'Update hotspot failed' : 'Create hotspot failed',
            submitting: false,
            error: results[0].error,
          });
        }

        that.setState({
          submitResults: update(that.state.submitResults, {
            data: { $set: resultsReport },
          }),
        });
      });
    });
  }

  deleteHotspot() {
    if (confirm('Are you sure you want to delete this hotspot?')) {
      this.setState({
        submitResults: update(this.state.submitResults, {
          show: { $set: true },
        }),
      }, () => {
        const doSubmit = new Promise((resolve) => {
          this.setState({
            submitResults: update(this.state.submitResults, {
              data: {
                $push: [{
                  submitAction: 'Deleting hotspot...',
                  submitting: true,
                }],
              },
            }),
          });
          resolve(this.props.defaultDeleteFunction(this.state.formData.hotspot_id.value));
        });

        Promise.all([doSubmit]).then((results) => {
          const resultsReport = [];
          if (results[0].type.indexOf('OK') === 0) {
            resultsReport.push({
              submitAction: 'Delete hotspot successfully',
              submitting: false,
            });
          } else {
            resultsReport.push({
              submitAction: 'Delete hotspot failed',
              submitting: false,
              error: results[0].error,
            });
          }
          this.setState({
            submitResults: update(this.state.submitResults, {
              data: { $set: resultsReport },
            }),
          });
        });
      });
    } else {
      // Do nothing!
    }
  }

  closeDialog() {
    this.setState({
      submitResults: update(this.state.submitResults, {
        show: { $set: false },
      }),
    });
  }

  render() {
    const props = this.props;
    const {
      mode,
      display,
      toggle,
      popup,
      loading,
    } = this.props;

    const __renderHotspotName = () => (<TextField
      type="text"
      hintText={strings.tooltip_hotspot_name}
      floatingLabelText={strings.tooltip_hotspot_name}
      onChange={(e, value) => this.setState({
        formData: update(this.state.formData, {
          name: { $set: { value } },
        }),
      })}
      fullWidth
      value={this.state.formData.name && this.state.formData.name.value}
    />);

    const __renderHotspotShortName = () => (<TextField
      type="text"
      hintText={strings.tooltip_hotspot_short_name}
      floatingLabelText={strings.tooltip_hotspot_short_name}
      onChange={(e, value) => this.setState({
        formData: update(this.state.formData, {
          short_name: { $set: { value } },
        }),
      })}
      fullWidth
      value={this.state.formData.short_name && this.state.formData.short_name.value}
    />);

    const __renderHotspotAddress = () => (<TextField
      type="text"
      hintText={strings.tooltip_hotspot_address}
      floatingLabelText={strings.tooltip_hotspot_address}
      onChange={(event, value) => this.setState({
        formData: update(this.state.formData, {
          address: { $set: { value } },
        }),
      })}
      fullWidth
      value={this.state.formData.address && this.state.formData.address.value}
    />);

    const __renderHotspotPhone = () => (<TextField
      type="text"
      hintText={strings.tooltip_hotspot_phone}
      floatingLabelText={strings.tooltip_hotspot_phone}
      onChange={(event, value) => this.setState({
        formData: update(this.state.formData, {
          phone: { $set: { value } },
        }),
      })}
      fullWidth
      value={this.state.formData.phone && this.state.formData.phone.value}
    />);

    const __renderHotspotWifi = () => (<TextField
      type="text"
      hintText={strings.tooltip_hotspot_wifi}
      floatingLabelText={strings.tooltip_hotspot_wifi}
      onChange={(event, value) => this.setState({
        formData: update(this.state.formData, {
          wifi: { $set: { value } },
        }),
      })}
      fullWidth
      value={this.state.formData.wifi && this.state.formData.wifi.value}
    />);

    const __renderHotspotType = () => (<AutoComplete
      name="type"
      hintText={strings.filter_hotspot_type}
      floatingLabelText={strings.filter_hotspot_type}
      searchText={this.state.formData.type.text}
      value={this.state.formData.type.value}
      dataSource={this.props.dsHotspotType}
      onNewRequest={(o) => {
        this.setState({
          formData: update(this.state.formData, {
            type: { $set: o },
          }),
        });
      }}
      onUpdateInput={(searchText) => {
        this.setState({
          formData: update(this.state.formData, {
            type: { $set: { value: searchText } },
          }),
        });
      }}
      filter={AutoComplete.caseInsensitiveFilter}
      openOnFocus
      maxSearchResults={100}
      fullWidth
      listStyle={{ maxHeight: 300, overflow: 'auto' }}
    />);

    const actions = [
      null && <FlatButton
        type="reset"
        key="reset"
        label="Reset"
        secondary
        onClick={this.clearState}
        style={{ float: 'left' }}
      />,
      mode === 'edit' && <FlatButton
        key="delete"
        label={strings.form_general_delete}
        secondary
        onClick={this.deleteHotspot}
        style={{ float: 'left' }}
      />,
      <FlatButton
        label={strings.form_general_close}
        key="cancel"
        primary
        onClick={() => this.props.callback ? this.props.callback() : props.history.push('/hotspots')}
      />,
      <FlatButton
        key="submit"
        type="submit"
        label={strings.form_general_submit}
        primary
      />,
    ];

    return (<FormWrapper
      data-toggle={toggle}
      data-popup={popup}
      data-display={display}
      onSubmit={this.submit}
      // onError={errors => console.log(errors)}
    >
      {loading && <Spinner />}
      {this.state.error && <Error text={this.state.error} />}

      <MapWithSearchBox
        onChanged={this.onPlaceChanged}
        marker={mode === 'edit' && {
          lat: this.state.formData.lat.value || 0,
          lng: this.state.formData.lon.value || 0,
        }}
      />

      <div>
        <Row>
          {__renderHotspotAddress()}
        </Row>
        <Row>
          <Col flex={6}>{__renderHotspotName()}</Col>
          <Col flex={6}>{__renderHotspotShortName()}</Col>
        </Row>
        <Row>
          <Col flex={6}>{__renderHotspotType()}</Col>
          <Col flex={6}>{__renderHotspotPhone()}</Col>
          <Col flex={6}>{__renderHotspotWifi()}</Col>
        </Row>
      </div>

      <div className="actions">
        {actions}
      </div>

      <Dialog
        title={strings.form_general_dialog_title}
        actions={<FlatButton
          label="Close"
          primary
          keyboardFocused
          onClick={() => {
            this.closeDialog();
            return this.props.callback ? this.props.callback() : props.history.push(`/hotspot/${this.state.formData.hotspot_id.value}`);
          }}
        />}
        modal={false}
        open={this.state.submitResults.show}
        onRequestClose={this.closeDialog}
      >
        <List>
          {this.state.submitResults.data.map(r => (<ListItem
            key={r.submitAction}
            primaryText={r.submitAction}
            leftIcon={r.submitting ? <CircularProgress size={24} /> : r.error ?
              <IconFail color={constants.colorRed} title={strings.form_general_fail} />
              : <IconSuccess
                color={constants.colorSuccess}
                title={strings.form_general_success}
              />}
            secondaryText={r.error && r.error}
            secondaryTextLines={1}
          />))}
        </List>
      </Dialog>
    </FormWrapper>);
  }
}

const mapStateToProps = () => ({
  currentQueryString: window.location.search,
  dsHotspotType: [{
    text: strings.enum_hotspot_type_1,
    value: 1,
  }, {
    text: strings.enum_hotspot_type_2,
    value: 2,
  }, {
    text: strings.enum_hotspot_type_3,
    value: 3,
  }],
});

const mapDispatchToProps = dispatch => ({
  defaultCreateFunction: params => dispatch(defaultCreateFn(params)),
  defaultEditFunction: (hotspotId, params) => dispatch(defaultEditFn(hotspotId, params)),
  defaultDeleteFunction: hotspotID => dispatch(deleteHotspot(hotspotID)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateEditHotspotForm));
