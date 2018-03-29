import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
/* actions & helpers */
import { getCardPackages, confirmPrintedPackage } from 'actions';
import strings from 'lang';
import { toDateTimeString, bindAll, renderDialog } from 'utils';
/* components */
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container/index';
import { FlatButton, Dialog } from 'material-ui';
import IconPrint from 'material-ui/svg-icons/action/print';

import PackageViewer from './PackageViewer';
import PackageCreateForm from './PackageCreateForm';
import PackageConfirmPrintedButton from './PackageConfirmPrintedButton';

const tableCardLabelsColumns = [{
  displayName: 'ID',
  field: 'id',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/cards/packages/${field}`}>{field}</TableLink>
  </div>),
}, {
  displayName: strings.th_cards,
  field: 'total_card',
  displayFn: (row, col, field) => (<div><b>{row.card_label_id}</b> <small>x{field}</small></div>),
}, {
  displayName: 'Status',
  field: 'status',
  sortFn: true,
  displayFn: (row, col, field) => (<div>{strings[`enum_package_status_${field}`]}</div>),
}, {
  displayName: 'Date Available',
  field: 'date_available',
  sortFn: true,
  displayFn: (row, col, field) => (<div>{field && toDateTimeString(field)}</div>),
}, {
  displayName: 'Created At',
  field: 'created_at',
  displayFn: (row, col, field) => (<div>{field && toDateTimeString(field)}</div>),
}, {
  field: 'id',
  displayName: '',
  displayFn: (row, col, field) => (row.status === 1 ? (<PackageConfirmPrintedButton packageId={field} status={row.status} />) : null),
}];

const getData = (props) => {
  props.dispatchPackages();
};

class PackagesPage extends React.Component {
  static propTypes = {
    // browser: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    cardPackages: PropTypes.shape([]),
    confirmPrintedPackage: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      createPackageFormData: {},
    };

    bindAll([
      'handleOpenDialog',
      'handleCloseDialog',
      'handleViewPackage',
      'handleCreatePackage',
      'handleConfirmPrinted',
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

  handleViewPackage() {
    this.setState({
      dialogConstruct: {
        title: 'Package Details',
        actions: [
          <FlatButton
            label="OK"
            primary
            keyboardFocused
            onClick={this.handleCloseDialog}
          />,
        ],
        view: <PackageViewer />,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  handleConfirmPrinted() {
    this.setState({
      dialogConstruct: {
        title: 'Do you want to confirm that package is printed?',
        actions: [
          <FlatButton
            label="Confirm"
            primary
            keyboardFocused
            onClick={this.props.confirmPrintedPackage}
            // disabled={isEmpty(this.state.createPackageFormData)}
          />,
          <FlatButton
            label="No, thanks."
            secondary
            onClick={this.handleCloseDialog}
          />,
        ],
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  handleCreatePackage() {
    this.setState({
      dialogConstruct: {
        title: 'More cards more fun!',
        // actions: [
        //   <FlatButton
        //     label="Create & Print"
        //     primary
        //     keyboardFocused
        //     onClick={() => {
        //       console.log('data to push: ');
        //       console.log(this.state.createPackageFormData);
        //     }}
        //     // disabled={isEmpty(this.state.createPackageFormData)}
        //   />,
        //   <FlatButton
        //     label="Close"
        //     secondary
        //     onClick={this.handleCloseDialog}
        //   />,
        // ],
        view: <PackageCreateForm
          // onChange={(returnFormData) => {
          //   this.setState({
          //     createPackageFormData: returnFormData,
          //   });
          // }}
          callback={() => {
            console.log('callback');
            this.handleCloseDialog();
          }}
        />,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  render() {
    const { cardPackages } = this.props;

    return (<div>
      <Container
        title={strings.heading_packages}
        actions={[{
          title: 'Create Package',
          icon: <IconPrint />,
          onClick: this.handleCreatePackage,
        }]}
      >
        <Table
          paginated
          columns={tableCardLabelsColumns}
          data={cardPackages.data}
          pageLength={30}
        />
      </Container>
      {renderDialog(this.state.dialogConstruct, this.state.openDialog, this.handleCloseDialog)}
    </div>);
  }
}

const mapStateToProps = state => ({
  browser: state.browser,
  cardPackages: state.app.cardPackages,
});

const mapDispatchToProps = dispatch => ({
  dispatchPackages: () => dispatch(getCardPackages()),
  confirmPrintedPackage: packageId => dispatch(confirmPrintedPackage(packageId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PackagesPage);
