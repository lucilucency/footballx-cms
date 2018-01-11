import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import update from 'react-addons-update';
/* actions & helpers */
import { toggleShowForm } from 'actions/dispatchForm';
import { createGroup } from 'actions';
/* data */
import strings from 'lang';
/* components */
import { TextField, RaisedButton } from 'material-ui';
import Error from 'components/Error/index';
/* css */
import styles from './index.css';

export const FORM_NAME_CREATE_EVENT = 'createGroup';

class CreateGroupForm extends React.Component {
  constructor() {
    super();
    this.state = {
      group: { name: {}, short_name: {}, lon: {}, lat: {}, fanpage: {}, icon: {} },
    };

    this.submitCreateGroup = this.submitCreateGroup.bind(this);
  }

  componentDidMount() {
    //
  }

  submitCreateGroup() {
    const that = this;
    const newGroup = {
      name: that.state.group.name.value,
      short_name: that.state.group.short_name.value,
      fanpage: that.state.group.fanpage && that.state.group.fanpage.value,
      icon: that.state.group.icon && that.state.group.icon.value,
    };

    that.props.postGroup(newGroup).then((dispatch) => {
      if (dispatch.type.indexOf('OK') === 0) {
        console.log('success');
        that.props.history.push('/groups/all');
      } else {
        console.log('fail');
      }
    });
  }

  render() {
    return (
      <div>
        {this.state.error && <Error text={this.state.error} />}

        <div className={styles.formGroup}>
          <TextField
            name="name"
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

          <TextField
            name="short_name"
            type="text"
            hintText={strings.tooltip_group_short_name}
            floatingLabelText={strings.tooltip_group_short_name}
            onChange={(event, shortName) => this.setState({
              group: update(this.state.group, {
                short_name: { $set: { value: shortName } },
              }),
            })}
            fullWidth
            value={this.state.group.short_name && this.state.group.short_name.value}
          />

          <TextField
            name="fanpage"
            type="text"
            hintText={strings.tooltip_group_fanpage}
            floatingLabelText={strings.tooltip_group_fanpage}
            onChange={(event, text) => this.setState({
              group: update(this.state.group, {
                fanpage: { $set: { value: text } },
              }),
            })}
            fullWidth
            value={this.state.group.fanpage && this.state.group.fanpage.value}
          />

          <TextField
            name="icon"
            type="text"
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
        <RaisedButton style={{ float: 'right' }} label={strings.form_edit_group_submit} primary onClick={event => this.submitCreateGroup(event)} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentQueryString: window.location.search,
  loading: state.app.groups.loading,
});

const mapDispatchToProps = dispatch => ({
  toggleShowForm: () => dispatch(toggleShowForm(FORM_NAME_CREATE_EVENT)),
  postGroup: params => dispatch(createGroup(params)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateGroupForm));
