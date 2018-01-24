import React from 'react';
import { IconButton, TextField, FlatButton } from 'material-ui';
import IconAddBox from 'material-ui/svg-icons/content/add-box';
/* data */
import strings from 'lang';
/* css */
import constants from 'components/constants';
import styled from 'styled-components';

class Package extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick() {
    this.setState({
      open: !this.state.open,
    }, () => {
      this.addingNumber.focus();
    });
  }

  handleSubmit() {
    this.setState({
      open: !this.state.open,
    });
  }

  handleCancel() {
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    const CardLabelAddStyled = styled.div`
      transition: height 500ms 0ms, opacity 500ms 500ms;
      //width: 270px;
    `;
    const Ul = styled.div`
      font-size: 1em;

      & li {
        list-style-type: square;
        transition: .4s linear color;
      }

      & li:hover {
        color: white;
      }

    `;
    return (
      <div style={{ textAlign: 'right' }}>
        <Ul>
          <li>11111</li>
          <li>22222</li>
          <li>33333</li>
        </Ul>
        <CardLabelAddStyled>
          <TextField
            ref={(elem) => { this.addingNumber = elem; }}
            type="number"
            hintText={strings.hint_number}
            // floatingLabelText={strings.tooltip_card_label_add_card}
            style={{ width: 150 }}
            inputStyle={{ width: 150 }}
          />
          <FlatButton
            label={'Submit'}
            primary
            style={{ height: '1.5em', lineHeight: '0.1em', minWidth: 60 }}
            labelStyle={{ fontSize: '0.8em', lineHeight: '0.8em', paddingLeft: 5, paddingRight: 5 }}
            onClick={this.handleSubmit}
          />
          <FlatButton
            label={'Cancel'}
            secondary
            style={{ height: '1.5em', lineHeight: '0.1em', minWidth: 60 }}
            labelStyle={{ fontSize: '0.8em', lineHeight: '0.8em', paddingLeft: 5, paddingRight: 5 }}
            onClick={this.handleCancel}
          />
        </CardLabelAddStyled>
      </div>
    );
  }
}

export default Package;
