import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
/* actions & helpers */
import { getCardPackages } from 'actions';
import strings from 'lang';
import { toDateTimeString } from 'utility';
/* components */
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container/index';
import { FlatButton, Dialog, IconButton } from 'material-ui';
import IconPrint from 'material-ui/svg-icons/action/print';
import constants from 'components/constants';

import CreateEventForm from 'components/Event/Forms/CreateEventForm';

import PackageViewer from './PackageViewer';
import PackageCreateForm from './PackageCreateForm';

const tableCardLabelsColumns = that => [{
  displayName: 'ID',
  field: 'id',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/cards/packages/${field}`}>{field}</TableLink>
  </div>),
}, {
  displayName: 'Total Card',
  field: 'total_card',
  sortFn: true,
}, {
  displayName: 'Status',
  field: 'status',
  sortFn: true,
}, {
  displayName: 'Created At',
  field: 'created_at',
  displayFn: (row, col, field) => (<div>{toDateTimeString(field)}</div>),
}, {
  displayName: 'Date Available',
  field: 'date_available',
  sortFn: true,
}, that.props.browser.greaterThan.medium && {
  displayName: 'Card Label',
  field: 'card_label',
  sortFn: true,
}, {
  field: 'id',
  displayName: '',
  displayFn: () => (<IconButton tooltip={strings.tooltip_print} onClick={that.handleView}>
    <IconPrint color={constants.blue500} />
  </IconButton>),
}];

const getData = (props) => {
  props.dispatchPackages();
};

class PackagesPage extends React.Component {
  static propTypes = {
    // browser: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    cardPackages: PropTypes.shape([]),
  };

  constructor(props) {
    super(props);
    this.state = {
      openEditor: false,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleView = this.handleView.bind(this);
    this.renderDialog = this.renderDialog.bind(this);
    this.handleCreateAndPrint = this.handleCreateAndPrint.bind(this);
  }

  componentDidMount() {
    getData(this.props);
  }

  handleOpen() {
    this.setState({ openEditor: true });
  }

  handleClose() {
    this.setState({ openEditor: false, dialogCons: {} });
  }

  handleView() {
    this.setState({
      dialogCons: {
        actions: [
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
        ],
        view: <PackageViewer />,
      },
    }, () => {
      this.handleOpen();
    });
  }

  handleCreateAndPrint() {
    let newPackage;
    this.setState({
      dialogCons: {
        actions: [
          <FlatButton
            label="Create & Print"
            primary
            keyboardFocused
            onClick={() => {
              console.log('data to push: ');
              console.log(newPackage);
            }}
          />,
          <FlatButton
            label="Cancel"
            secondary
            onClick={this.handleClose}
          />,
        ],
        view: <PackageCreateForm
          onChange={(formData) => {
            console.log(formData);
            newPackage = formData;
          }}
        />,
        // view: <CreateEventForm toggle={false} />,
      },
    }, () => {
      this.handleOpen();
    });
  }

  renderDialog(dialogCons = {}, trigger) {
    const defaultDialogCons = {
      title: 'Example Dialog',
      actions: [
        <FlatButton
          label="OK"
          primary
          keyboardFocused
          onClick={this.handleClose}
        />,
      ],
      view: <h1>Welcome!</h1>,
    };
    const { title, actions, view } = Object.assign(defaultDialogCons, dialogCons);

    return (
      <Dialog
        title={title}
        actions={actions}
        modal={false}
        open={trigger}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
      >
        {view}
      </Dialog>
    );
  }

  render() {
    const { cardPackages } = this.props;

    return (<div>
      <Container
        title={strings.heading_packages}
        actions={[{
          key: 'createAndPrint',
          title: 'Create Package and Print',
          icon: <IconPrint />,
          onClick: this.handleCreateAndPrint,
        }]}
      >
        <Table
          paginated
          columns={tableCardLabelsColumns(this)}
          data={cardPackages.data}
          pageLength={30}
        />
      </Container>
      {this.renderDialog(this.state.dialogCons, this.state.openEditor)}
    </div>);
  }
}

const mapStateToProps = state => ({
  browser: state.browser,
  cardPackages: state.app.cardPackages,
});

const mapDispatchToProps = dispatch => ({
  dispatchPackages: () => dispatch(getCardPackages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PackagesPage);
