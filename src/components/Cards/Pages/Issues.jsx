import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import { Link } from 'react-router-dom';
/* actions & helpers */
import { getCardIssues } from 'actions';
import { subTextStyle, bindAll, toDateTimeString } from 'utils';
import strings from 'lang';
import Table, { TableLink } from 'components/Table';
import Container from 'components/Container';
import { FlatButton, Dialog } from 'material-ui';
import IconAdd from 'material-ui/svg-icons/action/note-add';

import IssueCreateForm from './IssueCreateForm';
import IssueViewer from './IssueViewer';


const tableCardLabelsColumns = (that, browser) => [{
  displayName: strings.th_id,
  field: 'id',
  sortFn: true,
  displayFn: (row, col, field) => (<Link to={`/cards/issues/${field}`}>{field}</Link>),
}, {
  displayName: 'Requester',
  field: 'user_id',
  displayFn: (row, col, field) => (<div>
    User_id: {field} - {row.user_type}
    <span style={{ ...subTextStyle, maxWidth: browser.greaterThan.medium ? 300 : 150 }} >
      {toDateTimeString(row.created_at)}
    </span>
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
  displayName: 'Status',
  field: 'is_closed',
  displayFn: (row, col, field) => (<div>{field === true ? 'Closed' : 'Not close'}</div>),
}, {
  displayName: '',
  field: 'id',
  displayFn: row => (<Link
    to={'/cards/issues'}
    onClick={() => that.setState({
      previewingIssue: row,
    }, that.previewIssue)}
  >
    {'DETAIL'}
  </Link>),
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

    bindAll(['handleOpenDialog', 'handleCloseDialog', 'renderDialog', 'handleViewIssue', 'handleCreatePackage', 'previewIssue'], this);
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

  handleViewIssue() {
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
        title: 'Create new Issue',
        view: <IssueCreateForm
          callback={() => {
            console.log('callback create new issue');
            this.handleCloseDialog();
          }}
        />,
      },
    }, () => {
      this.handleOpenDialog();
    });
  }

  previewIssue() {
    this.setState({
      dialogConstruct: {
        title: 'Preview Issue',
        view: <IssueViewer
          issue={this.state.previewingIssue}
          callback={() => {
            console.log('callback close issue previewer');
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
          columns={tableCardLabelsColumns(this, this.props.browser)}
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

