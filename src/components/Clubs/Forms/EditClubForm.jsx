/* eslint-disable react/forbid-prop-types,max-len */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { bindAll, FormWrapper } from 'utils';
import { editLeagueClub as defaultEditFn } from 'actions';
import strings from 'lang';
import constants from 'components/constants';
import styled from 'styled-components';
/* components */
import {
  Dialog,
  FlatButton,
  List,
  ListItem,
  TextField,
} from 'material-ui';
import IconFail from 'material-ui/svg-icons/content/clear';
import IconSuccess from 'material-ui/svg-icons/navigation/check';
import CircularProgress from 'material-ui/CircularProgress';

import Error from 'components/Error/index';
import Spinner from 'components/Spinner/index';

const initialState = ({
  formData: {
    name: {},
    short_name: {},
    icon: {},
    popularity: {},
    type: {},
  },
  payload: {},
  submitResults: {
    data: [],
    show: false,
  },
});

class EditClubForm extends React.Component {
  static propTypes = {
    display: PropTypes.bool,
    toggle: PropTypes.bool,
    popup: PropTypes.bool,
    // mode: PropTypes.string,
    loading: PropTypes.bool,
    callback: PropTypes.func,

    club: PropTypes.object,
  };

  static defaultProps = {
    display: true,
    toggle: false,
    popup: false,
    mode: 'edit',
    loading: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
    };
    bindAll([
      'getFormData',
      'submit',
      'closeDialog',
    ], this);
  }

  componentWillMount() {
    const newProps = this.props;
    if (newProps.mode === 'edit') {
      this.setState({
        formData: {
          club_id: { value: newProps.club.id },
          name: { value: newProps.club.name, text: newProps.club.name && newProps.club.name.toString() },
          short_name: { value: newProps.club.short_name, text: newProps.club.short_name && newProps.club.short_name.toString() },
          icon: { value: newProps.club.icon, text: newProps.club.icon && newProps.club.icon.toString() },
          popularity: { value: newProps.club.popularity, text: newProps.club.popularity && newProps.club.popularity.toString() },
        },
      });
    }
  }

  componentDidMount() {

  }

  getFormData() {
    const formData = this.state.formData;

    return {
      name: formData.name.value,
      short_name: formData.short_name.value,
      icon: formData.icon.value,
      popularity: formData.popularity.value,
    };
  }

  clearState() {
    this.setState(initialState(this.props));
  }

  submit() {
    const that = this;

    this.setState({
      submitResults: update(that.state.submitResults, {
        show: { $set: true },
      }),
    }, () => {
      const createFn = that.props.dispatch ? that.props.dispatch : that.props.defaultCreateFunction;
      // const editFn = (clubId, submitData) => ajaxPut(`club/${clubId}`, submitData);
      const editFn = that.props.dispatch ? that.props.dispatch : that.props.defaultEditFunction;

      const doSubmit = new Promise((resolve) => {
        that.setState({
          submitResults: update(that.state.submitResults, {
            data: {
              $push: [{
                submitAction: 'Submitting',
                submitting: true,
              }],
            },
          }),
        });
        const submitData = this.getFormData();
        if (that.props.mode === 'edit') {
          const leagueID = this.props.club.leagueID;
          const clubID = this.props.club.id;
          resolve(editFn(leagueID, clubID, submitData));
        } else {
          resolve(createFn(submitData, this.state.payload));
        }
      });

      Promise.all([doSubmit]).then((results) => {
        const resultsReport = [];
        if (results[0].type.indexOf('OK') === 0) {
          resultsReport.push({
            submitAction: 'Edit team successfully',
            submitting: false,
          });

          if (that.props.mode === 'create') {
            that.setState({
              formData: update(that.state.formData, {
                club_id: {
                  $set: {
                    value: results[0].payload.data.id,
                  },
                },
              }),
            });
          }
        } else {
          resultsReport.push({
            submitAction: 'Edit team failed',
            submitting: false,
            error: results[0].error,
          });
        }

        that.setState({
          submitResults: update(that.state.submitResults, {
            data: { $set: resultsReport },
          }),
        });
      });
    });
  }

  closeDialog() {
    this.setState({
      submitResults: update(this.state.submitResults, {
        show: { $set: false },
      }),
    });
  }

  render() {
    const props = this.props;
    const { toggle, loading, display, popup } = this.props;

    const __renderClubName = () => (<TextField
      type="text"
      hintText={strings.tooltip_team_name}
      floatingLabelText={strings.tooltip_team_name}
      onChange={(e, value) => this.setState({
        formData: update(this.state.formData, {
          name: { $set: { value } },
        }),
      })}
      value={this.state.formData.name && this.state.formData.name.value}
    />);

    const __renderClubShortName = () => (<TextField
      type="text"
      hintText={strings.tooltip_team_short_name}
      floatingLabelText={strings.tooltip_team_short_name}
      onChange={(e, value) => this.setState({
        formData: update(this.state.formData, {
          short_name: { $set: { value } },
        }),
      })}
      value={this.state.formData.short_name && this.state.formData.short_name.value}
    />);

    const __renderClubIconText = () => (<TextField
      type="text"
      hintText={strings.tooltip_team_icon}
      floatingLabelText={strings.tooltip_team_icon}
      onChange={(event, value) => this.setState({
        formData: update(this.state.formData, {
          icon: { $set: { value } },
        }),
      })}
      value={this.state.formData.icon && this.state.formData.icon.value}
    />);

    const IMG = styled.img`
      max-width: 100%;
      max-height: 20vh;
      box-shadow: 0 0 5px ${constants.defaultPrimaryColor};
      background-color: rgba(255,255,255,0.1);
    `;
    const __renderClubIcon = () => (<div style={{ textAlign: 'center' }}>
      <IMG src={this.state.formData.icon && this.state.formData.icon.value} alt="" />
    </div>);

    const __renderClubPopularity = () => (<TextField
      type="text"
      hintText={strings.hint_club_popularity}
      floatingLabelText={strings.tooltip_team_popularity}
      onChange={(event, value) => this.setState({
        formData: update(this.state.formData, {
          popularity: { $set: { value } },
        }),
      })}

      value={this.state.formData.popularity && this.state.formData.popularity.value}
    />);

    const actions = [
      null && <FlatButton
        key="reset"
        type="reset"
        label="Reset"
        secondary
        style={{ float: 'left' }}
      />,
      <FlatButton
        key="cancel"
        label={strings.form_general_close}
        primary
        onClick={this.props.callback}
      />,
      <FlatButton
        key="submit"
        type="submit"
        label={strings.form_general_submit}
        primary
      />,
    ];

    return (<FormWrapper
      data-toggle={toggle}
      data-popup={popup}
      data-display={display}
      onSubmit={this.submit}
      // onError={errors => console.log(errors)}
    >
      {loading && <Spinner />}
      {this.state.error && <Error text={this.state.error} />}
      <div>
        {__renderClubName()}
        {__renderClubShortName()}
        {__renderClubPopularity()}
        {__renderClubIconText()}
        {__renderClubIcon()}
      </div>
      <div className="actions">
        {actions}
      </div>
      <Dialog
        title={strings.form_general_dialog_title}
        actions={<FlatButton
          label="Close"
          primary
          keyboardFocused
          onClick={() => {
            this.closeDialog();
            if (this.props.callback) {
              return this.props.callback();
            }
            return props.history.push('/clubs');
          }}
        />}
        modal={false}
        open={this.state.submitResults.show}
        // onRequestClose={this.closeDialog}
      >
        <List>
          {this.state.submitResults.data.map(r => (<ListItem
            primaryText={r.submitAction}
            leftIcon={r.submitting ? <CircularProgress size={24} /> : r.error ?
              <IconFail color={constants.colorRed} title={strings.form_general_fail} />
              : <IconSuccess
                color={constants.colorSuccess}
                title={strings.form_general_success}
              />}
            secondaryText={r.error && r.error}
            secondaryTextLines={1}
          />))}
        </List>
      </Dialog>
    </FormWrapper>);
  }
}

const mapDispatchToProps = dispatch => ({
  defaultCreateFunction: () => {},
  defaultEditFunction: (leagueID, clubID, params) => dispatch(defaultEditFn(leagueID, clubID, params)),
});

export default withRouter(connect(null, mapDispatchToProps)(EditClubForm));
