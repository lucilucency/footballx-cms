import React from 'react';
import { connect } from 'react-redux';
import strings from 'lang';
import Buttons from './Buttons';
// import Why from './Why';
import Sponsors from './Sponsors';
import { HeadContainerDiv, HeadlineDiv, DescriptionDiv, BottomTextDiv } from './Styled';

const Home = () => (
  <div>
    <HeadContainerDiv>
      <HeadlineDiv>
        {strings.app_name}
      </HeadlineDiv>
      <DescriptionDiv>
        {strings.app_description}
      </DescriptionDiv>
      <Buttons />
    </HeadContainerDiv>
    {/* <Why /> */}
    <Sponsors />
    <BottomTextDiv>
      {/**/}
    </BottomTextDiv>
  </div>
);

function mapStateToProps(data) {
  return { content: data.content };
}

export default connect(mapStateToProps)(Home);
