import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import constants from 'components/constants';
import { navigate } from './utils/constants';
import { darken, lighten } from 'utils';

const ToolbarStyled = styled.div`

  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;

  .rbc-toolbar-label {
    flex-grow:1;
    padding: 0 10px;
    text-align: center;
  }

  & button {
    color: ${constants['btn-color']};
    display: inline-block;
    margin: 0;
    text-align: center;
    vertical-align: middle;
    background: none;
    background-image: none;
    border: 1px solid ${constants['btn-border']};
    padding: .375rem 1rem;
    border-radius: 4px;
    line-height: normal;
    white-space: nowrap;

    &:active,
    &.rbc-active {
      background-image: none;
      box-shadow: inset 0 3px 5px rgba(0,0,0,.125);
      background-color: ${darken(constants['btn-bg'], 0.1)};
      border-color: ${lighten('rgb(19, 147, 249)', 0.2)};
      filter: drop-shadow(0 0 5px rgb(19, 147, 249));

      &:hover,
      &:focus {
        color: ${constants['btn-color']};
        background-color: ${darken(constants['btn-bg'], 0.17)};
        border-color: ${darken(constants['btn-border'], 0.25)};
      }
    }

    &:focus {
      color: ${constants['btn-color']};
      background-color: ${darken(constants['btn-bg'], 0.1)};
      border-color: ${darken(constants['btn-border'], 0.12)};
    }

    &:hover {
      color: ${constants['btn-color']};
      background-color: ${darken(constants['btn-bg'], 0.1)}
          border-color: ${darken(constants['btn-border'], 0.12)}
    }
  }


  .rbc-btn-group {
    display: inline-block;
    white-space: nowrap;
  
    > button:first-child:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  
    > button:last-child:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  
    .rbc-rtl & > button:first-child:not(:last-child) {
      border-radius: 4px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  
    .rbc-rtl & > button:last-child:not(:first-child) {
      border-radius: 4px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  
    > button:not(:first-child):not(:last-child) {
      border-radius: 0;
    }
  
    button + button {
      margin-left: -1px;
    }
  
    .rbc-rtl & button + button {
      margin-left: 0;
      margin-right: -1px;
    }
  
    & + &,
    & + button {
      margin-left: 10px;
    }
  }
`;

class Toolbar extends React.Component {
  static propTypes = {
    view: PropTypes.string.isRequired,
    views: PropTypes.arrayOf(PropTypes.string).isRequired,
    label: PropTypes.node.isRequired,
    messages: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired,
  }

  render() {
    const { messages, label } = this.props;

    return (<ToolbarStyled className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button
          type="button"
          onClick={this.navigate.bind(null, navigate.TODAY)}
        >
          {messages.today}
        </button>
        <button
          type="button"
          onClick={this.navigate.bind(null, navigate.PREVIOUS)}
        >
          {messages.previous}
        </button>
        <button
          type="button"
          onClick={this.navigate.bind(null, navigate.NEXT)}
        >
          {messages.next}
        </button>
      </span>

      <span className="rbc-toolbar-label">{label}</span>

      <span className="rbc-btn-group">{this.viewNamesGroup(messages)}</span>
    </ToolbarStyled>);
  }

  navigate = (action) => {
    this.props.onNavigate(action);
  }

  view = (view) => {
    this.props.onViewChange(view);
  }

  viewNamesGroup(messages) {
    const viewNames = this.props.views;
    const view = this.props.view;

    if (viewNames.length > 1) {
      return viewNames.map(name => (
        <button
          type="button"
          key={name}
          className={cn({ 'rbc-active': view === name })}
          onClick={this.view.bind(null, name)}
        >
          {messages[name]}
        </button>
      ));
    }
  }
}

export default Toolbar;
