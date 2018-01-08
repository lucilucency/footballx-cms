import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import strings from 'lang';
import LoginForm from './LoginForm';
import styles from './Login.css';

const Login = (props) => {
  if (props.user) {
    props.history.push('/');
  }

  return (
    <div>
      <div className={styles.HeadContainer}>
        <div className={styles.headline}>
          {strings.app_name}
        </div>
        <div className={styles.description}>
          {strings.app_description}
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

Login.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

export default connect(mapStateToProps)(Login);
