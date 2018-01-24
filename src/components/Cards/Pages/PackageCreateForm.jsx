import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import strings from 'lang';
import { getCardLabels } from 'actions';
import FormField from 'components/Form/FormField';
import { TextField, AutoComplete, FlatButton } from 'material-ui';
/* css */
import styled, { css } from 'styled-components';

class PackageCreateForm extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    dispatchCardLabels: PropTypes.func,
    cardLabels: PropTypes.shape({}),
  };

  static defaultProps = {
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      form: {
        card_label_id: { text: '', value: null },
        card_number: { text: '', value: null },
      },
      dataSource: {
        card_label_id: [],
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.cardLabelKeyPress = this.cardLabelKeyPress.bind(this);
    this.onChangeCardNumber = this.onChangeCardNumber.bind(this);
    this.onNewRequestCardLabelId = this.onNewRequestCardLabelId.bind(this);
    this.onUpdateInputCardLabelId = this.onUpdateInputCardLabelId.bind(this);
  }

  componentDidMount() {
    const cardLabels = this.props.cardLabels;
    if (!cardLabels.data.length) {
      this.props.dispatchCardLabels().then(() => {
        console.log(this.props);
        this.updateStateFromProps(this.props);
      });
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.updateStateFromProps(nextProps);
  // }


  onChangeCardNumber(e, newValue) {
    // this.setState({
    //   form: {
    //     card_number: { value: e.target.value },
    //   },
    // }, () => {
    //   this.input_card_number.focus();
    // });
    this.handleChange();
  }

  onNewRequestCardLabelId(o) {
    const that = this;
    if (that.input_card_label_id) {
      that.setState({
        form: update(that.state.form, {
          card_label_id: { $set: o },
        }),
      }, () => {
        // that.input_card_label_id.focus();
      });
    }
  }

  onUpdateInputCardLabelId(searchText) {
    const that = this;
    console.log(searchText);
    if (that.input_card_label_id) {
      that.setState({
        form: update(that.state.form, {
          card_label_id: { $set: { text: searchText } },
        }),
      }, () => {
        that.input_card_label_id.focus();
        // that.input_card_label_id.val('');
        // that.input_card_label_id.val(searchText);
      });
    }
  }

  cardLabelKeyPress(event) {
    if (event.charCode === 13) { // enter key pressed
      const { form } = this.state;
      event.preventDefault();
      if (form.card_number.value && form.card_label_id.value > 0) {
        // this.save_task();
        console.warn('GOING TO SUBMIT!');
      }
    }
  }

  handleChange() {
    const { form } = this.state;
    const keys = Object.keys(form);
    const formData = keys.map((k) => {
      console.log(k);
      console.log(form[k]);
      return form[k].value;
    });
    console.log(11111111111111111);
    console.log(formData);

    this.props.onChange({ formData });
  }

  updateStateFromProps(props) {
    const { cardLabels } = props;

    this.setState({
      dataSource: update(this.state.dataSource, {
        card_label_id: {
          $set: cardLabels.data.map(o => ({
            text: o.name,
            value: o.id,
          })),
        },
      }),
    }, () => {
      console.log(this.state);
    });
  }

  render() {
    const { form, dataSource } = this.state;

    const Row = styled.div`
      display: flex;
      flex-direction: row;
      padding: 20px;
    `;
    const Col = styled.div`
      margin: 10px;
      text-align: center;
      ${props => props.flex && css`
        flex: ${props.flex};
      `}
    `;

    return (
      <div>
        <Row>
          <Col flex={5}>
            <TextField
              ref={(c) => { this.input_card_number = c; }}
              name="card_number"
              floatingLabelText="Enter quantity..."
              value={form.card_number.value}
              type="number"
              onChange={this.onChangeCardNumber}
              // onKeyPress={this.cardLabelKeyPress}
              fullWidth
              // autoFocus
            />
          </Col>
          <Col flex={7}>
            <AutoComplete
              ref={(c) => { this.input_card_label_id = c; }}
              floatingLabelText="Choose card label..."
              searchText={form.card_label_id.text}
              value={form.card_label_id.value}
              dataSource={dataSource.card_label_id}
              onNewRequest={this.onNewRequestCardLabelId}
              onUpdateInput={this.onUpdateInputCardLabelId}
              filter={AutoComplete.caseInsensitiveFilter}
              openOnFocus
              maxSearchResults={100}
              fullWidth
              listStyle={{ maxHeight: 300, overflow: 'auto' }}
            />
          </Col>
        </Row>
        <Row>
          <FlatButton
            label="Submit"
            onClick={() => {
              console.log(this.state.form);
            }}
          />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  cardLabels: state.app.cardLabels,
});

const mapDispatchToProps = dispatch => ({
  dispatchCardLabels: () => dispatch(getCardLabels()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PackageCreateForm);

