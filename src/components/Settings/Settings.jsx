import React from 'react';
import { connect } from 'react-redux';
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

const Settings = () => (
  <div>
    <Wrapper>
      <LoginForm />
    </Wrapper>
  </div>
);

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

export default connect(mapStateToProps)(Settings);
