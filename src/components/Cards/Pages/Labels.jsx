/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
/* actions & helpers */
import { getCardLabels } from 'actions';
import strings from 'lang';
import { renderDialog, bindAll } from 'utils';
/* components */
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container/index';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconRefresh from 'material-ui/svg-icons/navigation/refresh';

import LabelAddQuantity from './LabelAddQuantity';
import LabelCreateForm from './LabelCreateForm';

const tableCardLabelsColumns = browser => [{
  displayName: 'Label',
  field: 'name',
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/cards/labels/${field}`}>{field.toUpperCase()}</TableLink>
  </div>),
}, {
  displayName: 'Total',
  field: 'total_card',
}, {
  displayName: 'Used',
  field: 'total_card_used',
}, {
  displayName: 'In Stock',
  field: 'total_card_in_stock',
  // displayFn: row => (<div>{row.total_card - row.total_card_used}</div>),
}, {
  displayName: 'Value',
  field: 'value',
}, {
  displayName: 'Cost',
  field: 'cost',
}, {
  displayName: 'Subscription',
  field: 'subscription',
}, {
  displayName: 'Prefix',
  field: 'prefix',
}, {
  field: 'id',
  displayName: '',
  displayFn: (row, col, field) => <LabelAddQuantity cardLabelId={field} cardLabelName={row.name} />,
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
      openDialog: false,
    };
    bindAll([
      'openAddCardLabelForm',
      'handleOpenDialog',
      'handleCloseDialog',
    ], this);
  }

  componentDidMount() {
    getData(this.props);
  }

  handleOpenDialog() {
    this.setState({ openDialog: true });
  }

  handleCloseDialog() {
    this.setState({ openDialog: false, dialogConstruct: {} });
  }

  openAddCardLabelForm() {
    this.setState({
      dialogConstruct: {
        title: strings.heading_create_card_label,
        view: <LabelCreateForm
          callback={() => {
            this.handleCloseDialog();
          }}
        />,
      },
    }, () => {
      this.handleOpenDialog();
    });
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
            // console.log('Doing refresh!');
          },
        }, {
          key: 'add',
          title: 'New Card Label',
          icon: <IconAdd />,
          onClick: this.openAddCardLabelForm,
        }]}
      >
        <Table
          paginated
          columns={tableCardLabelsColumns(this.props.browser)}
          data={cardLabels.data.reduce((r, a) => {
            r[a.id] = r[a.id] || [];
            r[a.id].push(a);
            return r;
          }, []).map(z => z && z.reduce((r, a) => {
            r.id = r.id || a.id;
            r.name = r.name || a.name;
            r.value = r.value || a.value;
            r.cost = r.cost || a.cost;
            r.prefix = r.prefix || a.prefix;
            r.subscription = r.subscription || a.subscription;
            r.total_card_in_stock = r.total_card_in_stock || a.total_card_in_stock;

            r.total_card = r.total_card || 0;
            r.total_card_used = r.total_card_used || 0;
            r.total_card += a.total_card;
            r.total_card_used += a.total_card_used;
            return r;
          }, Object.create(null))).filter(o => o)}
          pageLength={30}
        />
      </Container>
      {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
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
