import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import strings from 'lang';
import FacebookLogin from 'react-facebook-login';
import { ButtonsDiv } from './Styled';


const Button = (propsVar) => {
  const { user, userHotspot, userGroup } = propsVar;
  return (<ButtonsDiv>
    <div>
      {!user && <FlatButton
        label={<span className={'label'}>{strings.home_login} <b>{strings.home_login_desc}</b></span>}
        containerElement={<Link to="login">{strings.home_parse}</Link>}
      />}
    </div>
    <div className={'bottomButtons'}>
      <FacebookLogin
        appId="161873251167984"
        autoLoad={true}
        fields="name,email,picture"
        onClick={() => {
          console.log('clicked');
        }}
        callback={(response) => {
          console.log(response);
        }} />
      {user && user.user_type === 1 && <div>
        <FlatButton
          label={<span className={'label'}>{strings.home_view} <b>{strings.general_events}</b></span>}
          containerElement={<Link to={'/events'} />}
        />
        <FlatButton
          label={<span className={'label'}>{strings.home_view} <b>{strings.home_hotspots}</b></span>}
          containerElement={<Link to={'/hotspots'} />}
        />
      </div>}
      {user && user.user_type === 2 && <div>
        {userHotspot && userHotspot.id && <FlatButton
          label={<span className={'label'}>{strings.home_view_your} <b>{strings.home_hotspot}</b></span>}
          containerElement={<Link to={`/hotspot/${userHotspot.id}`} />}
        />}

      </div>}
      {user && user.user_type === 3 && <div>
        {userGroup && userGroup.id && <FlatButton
          label={<span className={'label'}>{strings.home_view_your} <b>{strings.home_group}</b></span>}
          containerElement={<Link to={`/group/${userGroup.id}`} />}
        />}
      </div>}
    </div>
  </ButtonsDiv>);
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
  userHotspot: state.app.metadata.data.hotspot,
  userGroup: state.app.metadata.data.group,
});

export default connect(mapStateToProps, null)(Button);
