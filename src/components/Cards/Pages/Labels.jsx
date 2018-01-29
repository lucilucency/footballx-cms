import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
/* actions & helpers */
import { getCardLabels } from 'actions';
import strings from 'lang';
/* components */
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container/index';
import { FlatButton, Dialog, RadioButton, RadioButtonGroup } from 'material-ui';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconRefresh from 'material-ui/svg-icons/navigation/refresh';

import CardLabelAddQuantity from './LabelAddQuantity';

const tableCardLabelsColumns = browser => [{
  displayName: 'Label',
  field: 'name',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/cards/labels/${field}`}>{field.toUpperCase()}</TableLink>
  </div>),
}, {
  displayName: 'Total',
  field: 'total_card',
  sortFn: true,
}, {
  displayName: 'Used',
  field: 'total_card_used',
  sortFn: true,
}, {
  displayName: 'Available',
  field: 'total_card_available',
  sortFn: true,
}, {
  displayName: 'Value',
  field: 'value',
  sortFn: true,
}, {
  displayName: 'Cost',
  field: 'cost',
  sortFn: true,
}, browser.greaterThan.medium && {
  displayName: 'Subscription',
  field: 'subscription',
  sortFn: true,
}, {
  field: 'id',
  displayName: '',
  displayFn: (row, col, field) => <CardLabelAddQuantity cardLabelId={field} cardLabelName={row.name} />,
}];

const getData = (props) => {
  props.dispatchCardLabels();
};

class CardLabelsPage extends React.Component {
  static propTypes = {
    browser: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    cardLabels: PropTypes.shape([]),
  };

  constructor(props) {
    super(props);
    this.state = {
      openEditor: false,
    };
    this.openEditor = this.openEditor.bind(this);
  }

  componentDidMount() {
    getData(this.props);
  }

  openEditor() {
    this.setState({ openEditor: true });
  }

  renderDialog() {
    const actions = [
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Cancel"
        secondary
        onClick={this.handleClose}
      />,
    ];

    const radios = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 30; i++) {
      radios.push(
        <RadioButton
          key={i}
          value={`value${i + 1}`}
          label={`Option ${i + 1}`}
          style={{ marginTop: 16 }}
        />,
      );
    }

    return (
      <Dialog
        title="Dialog"
        actions={actions}
        modal={false}
        open={this.state.openEditor}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
      >
        <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
          {radios}
        </RadioButtonGroup>
      </Dialog>
    );
  }

  render() {
    const { cardLabels } = this.props;

    return (<div>
      <Container
        title={strings.heading_labels}
        actions={[{
          key: 'refresh',
          title: 'Refresh',
          icon: <IconRefresh />,
          onClick: () => {
            console.log(123);
          },
        }, {
          key: 'add',
          title: 'New Card Label',
          icon: <IconAdd />,
          onClick: this.openEditor,
        }]}
      >
        <Table
          paginated
          columns={tableCardLabelsColumns(this.props.browser)}
          data={cardLabels.data}
          pageLength={30}
        />
      </Container>
      {this.renderDialog()}
    </div>);
  }
}

const mapStateToProps = state => ({
  browser: state.browser,
  cardLabels: state.app.cardLabels,
});

const mapDispatchToProps = dispatch => ({
  dispatchCardLabels: () => dispatch(getCardLabels()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardLabelsPage);
