import React from 'react';
/* css */
import styled from 'styled-components';

class IssueViewer extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    package: React.PropTypes.object,
  };

  static defaultProps = {
    package: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const Ul = styled.div`
      font-size: 1em;
      & li {
        list-style-type: square;
        transition: .4s linear color;
      }
      & li:hover {
        color: white;
      }
    `;

    const { package: thisPackage } = this.props;

    return (
      <div style={{ textAlign: 'left' }}>
        <Ul>
          <li>Created at: </li>
          <li>Requester: </li>
          <li>{thisPackage.total_card} card(s) with label: <code>{thisPackage.card_label_name}</code></li>
        </Ul>
      </div>
    );
  }
}

export default IssueViewer;
