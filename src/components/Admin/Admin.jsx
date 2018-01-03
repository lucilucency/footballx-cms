import React from 'react';
import { connect } from 'react-redux';
import strings from 'lang';
import LoginForm from './LoginForm';
import styles from './Admin.css';

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

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

export default connect(mapStateToProps)(Login);
