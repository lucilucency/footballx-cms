import React from 'react';
import { connect } from 'react-redux';
import strings from 'lang';
import styled from 'styled-components';
import LoginForm from './LoginForm';

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

const AppName = styled.div`
  text-transform: uppercase;
  font-size: 90px;
  font-weight: var(--fontWeightMedium);
  line-height: 1.2;
  text-shadow: #000 0 0 3px;

  @media only screen and (max-width: 425px) {
    font-size: 60px;
  }
    
  @media only screen and (max-width: 375px) {
    font-size: 42px;
  }
`;

const AppDesc = styled.div`
  font-size: 32px;
  font-weight: var(--fontWeightLight);
  margin-bottom: 20px;
  text-shadow: #000 0 0 3px;
  @media only screen and (max-width: 768px) {
    font-size: 25px;
  }
`;

const Login = (propsVar) => {
  if (propsVar.user) {
    propsVar.history.push('/');
  }

  return (
    <div>
      <Wrapper>
        <AppName>{strings.app_name}</AppName>
        <AppDesc>{strings.app_description}</AppDesc>
        <LoginForm />
      </Wrapper>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

export default connect(mapStateToProps)(Login);
