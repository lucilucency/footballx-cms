import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';

/* actions & helpers */
import { getCardIssues } from 'actions';
/* components */
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container';
import { FlatButton, Dialog, IconButton } from 'material-ui';
import IconAdd from 'material-ui/svg-icons/action/note-add';
import strings from 'lang';
import { subTextStyle } from 'utils/style';

import IssueCreateForm from './IssueCreateForm';


const tableCardLabelsColumns = browser => [{
  displayName: strings.th_id,
  field: 'id',
  sortFn: true,
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/cards/issues/${field}`}>{field}</TableLink>
  </div>),
}, {
  displayName: 'Requester',
  field: 'user_id',
  displayFn: (row, col, field) => (<div>
    User_id: {field} - {row.user_type}
  </div>),
}, browser.greaterThan.medium && {
  displayName: 'Notes',
  field: 'notes',
  sortFn: true,
}, {
  displayName: 'Cards',
  field: 'card_label_id',
  displayFn: (row, col, field) => (<div>
    <TableLink to={`/cards/labels/${field}`}>{field}</TableLink>
    {browser.greaterThan.small &&
    <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} >
      x{row.total_card} card(s)
    </span>}
  </div>),
}, {
  displayName: 'Price',
  field: 'price',
}, {
  displayName: '',
  displayFn: () => (<div>
    <span className="subText ellipsis" style={{ display: 'block', marginTop: 1 }}>
      +Reture card
    </span>
    <span className="subText ellipsis" style={{ display: 'block', marginTop: 1 }}>
      +Close
    </span>
  </div>),
}];


const getData = (props) => {
  props.dispatchCardIssues();
};

class IssuesPage extends React.Component {
  static propTypes = {
    browser: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    cardIssues: PropTypes.shape([]),
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
        view: <div>123</div>,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  handleCreatePackage() {
    this.setState({
      dialogConstruct: {
        title: 'More cards more fun!',
        view: <IssueCreateForm
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
    const { cardIssues } = this.props;
    return (<div>
      <Container
        title={strings.heading_issues}
        actions={[{
          title: 'Create Issue',
          icon: <IconAdd />,
          onClick: this.handleCreatePackage,
        }]}
      >
        <Table
          paginated
          columns={tableCardLabelsColumns(this.props.browser)}
          data={cardIssues.data}
          pageLength={30}
        />
      </Container>
      {this.renderDialog(this.state.dialogConstruct, this.state.openDialog)}
    </div>);
  }
}

const mapStateToProps = state => ({
  browser: state.browser,
  cardIssues: state.app.cardIssues,
});

const mapDispatchToProps = dispatch => ({
  dispatchCardIssues: () => dispatch(getCardIssues()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IssuesPage);

