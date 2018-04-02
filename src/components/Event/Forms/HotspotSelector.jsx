/* eslint-disable react/forbid-prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindAll } from 'utils';
import { getHotspots } from 'actions';
import {
  Chip,
  Avatar,
  FontIcon,
} from 'material-ui';
import BigSelector from 'components/BigSelector';

const initialState = {};

class HotspotSelector extends React.Component {
  static propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    dsHotspot: React.PropTypes.array,
  };

  static defaultProps = {};


  constructor(props) {
    super(props);

    bindAll([
      'handleCustomDisplaySelections',
      'onRequestDelete',
      'handleSelection',
    ], this);

    this.state = {
      ...initialState,
      selectedHotspot: [],
    };
  }

  onRequestDelete = (key, stateName) => () => {
    this.state[stateName].filter((v, i) => i !== key);

    this.setState({ [stateName]: this.state[stateName].filter((v, i) => i !== key) });
  };

  handleSelection = (values, stateName) => this.setState({ [stateName]: values }, this.props.onSelect(values, stateName));

  handleCustomDisplaySelections = stateName => (values) => {
    if (values.length) {
      return (<div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {values.map(({ label }, index) => (
          <Chip key={index} style={{ margin: 5 }} onRequestDelete={this.onRequestDelete(index, stateName)}>
            <Avatar
              icon={
                <FontIcon
                  style={{
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    borderRadius: '50%',
                    backgroundSize: 'cover',
                  }}
                />
              }
            />
            {label}
          </Chip>
        ))}
      </div>);
    }

    return (<div style={{ minHeight: 42, lineHeight: '42px' }}>Select hotspot(s)</div>);
    // advice: use one of <option>s' default height as min-height
  };

  render() {
    const dsHotspot = this.props.dsHotspot;
    const cities = ['Hà Nội', 'Hồ Chí Minh'];

    const countriesNodeList = cities.map((city, continentIndex) => (
      <optgroup key={continentIndex} label={city}>
        {dsHotspot
          // .sort((a, b) => b.Continent - a.Continent)
          .filter(c => c.address.indexOf(city) !== -1)
          .map((hotspot, index) => {
            const menuItemStyle = {
              whiteSpace: 'normal',
              display: 'flex',
              justifyContent: 'space-between',
              lineHeight: 'normal',
            };

            return (
              <div key={index} value={hotspot} label={`${hotspot.name} - ${hotspot.address}`} style={menuItemStyle}>
                <div style={{ marginRight: 10 }}>
                  <span style={{ fontWeight: 'bold' }}>{hotspot.name}</span>
                  <br />
                  <span style={{ fontSize: 12 }}>{hotspot.address}</span>
                </div>
              </div>
            );
          })}
      </optgroup>
    ));

    return (<BigSelector
      name="selectedHotspot"
      multiple
      keepSearchOnSelect
      withResetSelectAllButtons
      checkPosition="left"
      hintText="Complex example"
      onChange={this.handleSelection}
      value={this.state.selectedHotspot}
      elementHeight={58}
      selectionsRenderer={this.handleCustomDisplaySelections('selectedHotspot')}
      style={{ width: '100%', marginTop: 20 }}
    >
      {countriesNodeList}
    </BigSelector>);
  }
}


const mapStateToProps = state => ({
  dsHotspot: state.app.hotspots.data,
});

const mapDispatchToProps = dispatch => ({
  dispatchHotspots: () => dispatch(getHotspots()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HotspotSelector));
