import styled, { css } from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  ${props => props.right && css`
    flex-direction: row-reverse;
  `}
`;

export const Col = styled.div`
  margin: 10px;
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
