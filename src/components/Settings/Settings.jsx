import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import strings from 'lang';
import styled from 'styled-components';
import LoginForm from './SettingsForm';

const Wrapper = styled.div`
  width: 600px;
  height: 380px;
  margin: 0 auto;
  text-align: center;
  padding-top: 120px;

  @media only screen and (max-width: 768px) {
    width: auto;
  }
`;

const Settings = (props) => {
  return (
    <div>
      <Wrapper>
        <LoginForm />
      </Wrapper>
    </div>
  );
};

Settings.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

export default connect(mapStateToProps)(Settings);
