/* eslint-disable no-undef */
import React from 'react';
import _ from 'lodash';
import { compose, withProps, lifecycle, mapProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';

const API_KEY_GOOGLE_MAPS = 'AIzaSyAVuAeRe7X-4rtzJZb00XUohyCVPV_03QE';

const MapWithSearchBox = compose(
  mapProps(props => ({
    onChanged: props.onChanged,
    marker: props.marker,
  })),
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${API_KEY_GOOGLE_MAPS}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.marker) {
        this.setState({
          center: nextProps.marker,
          marker: nextProps.marker,
        });
      }
    },
    componentWillMount() {
      const refs = {};
      const props = this.props;

      this.setState({
        bounds: null,
        center: { lat: 20.983137, lng: 105.831965 },
        markers: [],
        onMapMounted: (ref) => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          });
        },
        onSearchBoxMounted: (ref) => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach((place) => {
            if (place.geometry) {
              if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
              } else if (place.geometry.location) {
                bounds.extend(place.geometry.location);
              }
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry && place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
            marker: null,
          });

          props.onChanged(places);
          // refs.map.fitBounds(bounds);
        },
      });
    },
  }),
  withScriptjs,
  withGoogleMap,
)(props =>
  (<GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    {props.marker && !props.markers.length && <Marker
      position={{ lat: props.marker.lat, lng: props.marker.lng }}
    />}
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Find the hotspot"
        style={{
          boxSizing: 'border-box',
          border: '1px solid transparent',
          width: '50%',
          height: '32px',
          marginTop: '10px',
          padding: '0 12px',
          borderRadius: '3px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          fontSize: '14px',
          outline: 'none',
          textOverflow: 'ellipses',
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />,
    )}
  </GoogleMap>),
);

export default MapWithSearchBox;
