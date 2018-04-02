import styled, { css } from 'styled-components';
import { ValidatorForm } from 'react-form-validator-core';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  ${props => props.right && css`
    flex-direction: row-reverse;
  `}
`;

export const Col = styled.div`
  //margin: 10px;
  width: 100%;
  ${props => props.flex && css`
    flex: ${props.flex};
  `}
`;

export const Ul = styled.ul`
  font-size: 1.1em;
  font-weight: 300;
  line-height: 2;
  & li {
    list-style-type: square;
    transition: .4s linear color;
  }
  & li:hover {
    color: white;
  }
`;

export const FormWrapper = styled(ValidatorForm)`
  margin-top: 20px;
  transition: max-height 1s;
  box-sizing: border-box;
  ${props => ((props['data-display']) ? css`
      max-height: 10000px;
  ` : css`
      max-height: 0;
  `)}
  
  ${props => (props['data-toggle'] && css`
    overflow: hidden;
    padding: 0 15px;
 `)}

  .actions {
    text-align: right;
    ${props => (props['data-popup'] && css`
      margin: 24px -24px -24px -24px;
      padding: 8px;
   `)}
  }
`;
