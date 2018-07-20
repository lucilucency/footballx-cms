/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import ui from 'components/constants';

const LinkStyled = styled.a`
  font-size: ${ui.fontSizeNormal};
  font-weight: ${ui.fontWeightLight};
  color: ${ui.textColorPrimary} !important;
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-right: 15px;
  width: 100%;

  & svg {
    margin-right: 5px;

    /* Override material-ui */
    color: currentColor !important;
    width: 18px !important;
    height: 18px !important;
  }
`;

export {
  LinkStyled,
};
