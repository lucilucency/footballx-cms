import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
/* actions & helpers */
import { getCardPackages } from 'actions';
import strings from 'lang';
import { toDateTimeString } from 'utils';
/* components */
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container/index';
import { FlatButton, Dialog, IconButton } from 'material-ui';
import IconPrint from 'material-ui/svg-icons/action/print';
import constants from 'components/constants';

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
  displayName: strings.th_cards,
  field: 'total_card',
  sortFn: true,
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
  displayFn: () => (<IconButton tooltip={strings.tooltip_print} onClick={that.handleViewPackage}>
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
      openDialog: false,
      createPackageFormData: {},
    };

    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.renderDialog = this.renderDialog.bind(this);
    this.handleViewPackage = this.handleViewPackage.bind(this);
    this.handleCreatePackage = this.handleCreatePackage.bind(this);
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

  renderDialog(dialogConstruct = {}, trigger) {
    const defaultDialogCons = {
      title: 'Example Dialog',
      actions: [],
      view: <h1>Welcome!</h1>,
    };
    const { title, actions, view } = Object.assign(defaultDialogCons, dialogConstruct);

    return (
      <Dialog
        title={title}
        actions={actions}
        modal={false}
        open={trigger}
        onRequestClose={this.handleCloseDialog}
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
          title: 'Create Package',
          icon: <IconPrint />,
          onClick: this.handleCreatePackage,
        }]}
      >
        <Table
          paginated
          columns={tableCardLabelsColumns(this)}
          data={cardPackages.data}
          pageLength={30}
        />
      </Container>
      {this.renderDialog(this.state.dialogConstruct, this.state.openDialog)}
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
