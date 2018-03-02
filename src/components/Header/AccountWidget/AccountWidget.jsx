import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import strings from 'lang';
import Spinner from 'components/Spinner';
import Error from 'components/Error';
import LoggedIn from './LoggedIn';

const AccountWidget = (propsVar) => {
  const { loading, error, user, style } = propsVar;
  console.log('================');
  console.log(propsVar);
  return (
    <div style={style}>
      {error && <Error />}
      {!error && !loading && user
        ? <LoggedIn user={user} />
        : <Link to={'/login'}>
          {strings.app_login}
        </Link>
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  const { error, loading, data } = state.app.metadata;
  return {
    loading,
    error,
    user: data.user,
  };
};


// const mapDispatchToProps = dispatch => ({
  // getPlayer: playerId => dispatch(getPlayer(playerId)),
// });


class RequestLayer extends React.Component {
  componentDidMount() {

  }

  componentWillUpdate() {

  }

  render() {
    return <AccountWidget {...this.props} />;
  }
}

export default connect(mapStateToProps, null)(RequestLayer);
