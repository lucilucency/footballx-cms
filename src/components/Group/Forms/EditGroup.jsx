/* global FX_API, FX_VERSION */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
/* actions & helpers */
import { editGroup } from 'actions';
import { toggleShowForm } from 'actions/formActions';
import _ from 'lodash';
/* data & components */
import strings from 'lang';
import { TextField, RaisedButton } from 'material-ui';
import Error from 'components/Error/index';
import MapWithSearchBox from 'components/Visualizations/GoogleMap/MapWithSearchBox';
/* css */
import styled, { css } from 'styled-components';

const FormContainer = styled.div`
    transition: max-height 1s;
    padding: 15px;
    box-sizing: border-box;
    overflow: hidden;
    padding: 0 15px;
    box-sizing: border-box;
    ${props => (props.show ? css`
        max-height: 2000px;
    ` : css`
        max-height: 0;
    `)}
`;

const setShowFormState = (props) => {
  if (Boolean(props.currentQueryString.substring(1)) !== props.showForm) {
    // If query string state has a filter, turn on the form
    props.toggleShowForm('editGroup');
  }
};

class EditGroupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: {},
    };
    this.submitEditGroup = this.submitEditGroup.bind(this);
  }

  componentDidMount() {
    // setShowFormState(this.props);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.group.id !== this.props.group.id) {
      setShowFormState(nextProps);
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      group: {
        name: { value: newProps.group.name },
        short_name: { value: newProps.group.short_name },
        fanpage: { value: newProps.group.fanpage || '' },
        icon: { value: newProps.group.icon || '' },
      },
    });
  }

  submitEditGroup(e) {
    const that = this;
    const editedGroup = {
      name: that.state.group.name.value,
      short_name: that.state.group.short_name.value,
      fanpage: that.state.group.fanpage.value,
      icon: that.state.group.icon.value,
    };

    that.props.editGroup(that.props.group.id, editedGroup).then((dispatch) => {
      if (dispatch.type.indexOf('OK') === 0) {
        console.log('success');
        that.props.toggleShowForm();
      } else {
        console.log('fail');
      }
    });
  }

  render() {
    const {
      showForm,
    } = this.props;

    return (
      <div>
        {this.props.error && <Error text={this.props.error} />}
        <FormContainer show={showForm}>
          <div>
            {/* input name */}
            <TextField
              type="text"
              hintText={strings.tooltip_group_name}
              floatingLabelText={strings.tooltip_group_name}
              onChange={(event, name) => this.setState({
                group: update(this.state.group, {
                  name: { $set: { value: name } },
                }),
              })}
              fullWidth
              value={this.state.group.name && this.state.group.name.value}
            />

            {/* input short_name */}
            <TextField
              type="text"
              hintText={strings.tooltip_group_short_name}
              floatingLabelText={strings.tooltip_group_short_name}
              onChange={(event, short_name) => this.setState({
                group: update(this.state.group, {
                  short_name: { $set: { value: short_name } },
                }),
              })}
              fullWidth
              value={this.state.group.short_name && this.state.group.short_name.value}
            />

            <TextField
              type="text"
              name="fanpage"
              hintText={strings.tooltip_group_fanpage}
              floatingLabelText={strings.tooltip_group_fanpage}
              onChange={(event, fanpage) => this.setState({
                group: update(this.state.group, {
                  fanpage: { $set: { value: fanpage } },
                }),
              })}
              fullWidth
              value={this.state.group.fanpage && this.state.group.fanpage.value}
            />

            <TextField
              type="text"
              name="icon"
              hintText={strings.tooltip_group_icon}
              floatingLabelText={strings.tooltip_group_icon}
              onChange={(event, icon) => this.setState({
                group: update(this.state.group, {
                  icon: { $set: { value: icon } },
                }),
              })}
              fullWidth
              value={this.state.group.icon && this.state.group.icon.value}
            />

          </div>

          <RaisedButton
            style={{ float: 'right' }}
            label={strings.form_edit_group_submit}
            primary
            onClick={event => this.submitEditGroup(event)}
          />
        </FormContainer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  showForm: state.app.formEditGroup.show,
  currentQueryString: window.location.search,
  error: state.app.group.error,
  loading: state.app.group.loading,
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: () => dispatch(toggleShowForm('editGroup')),
  editGroup: (groupId, params) => dispatch(editGroup(groupId, params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditGroupForm));
