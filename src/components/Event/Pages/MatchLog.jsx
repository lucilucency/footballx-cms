import React from 'react';
import { connect } from 'react-redux';
import QRCode from 'qrcode.react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: white;
  
  & h1 {
    color: black;
  }
`;

const QRWrapper = styled.div`
  margin: auto;
  border: 10px solid white;
  width: 300px;
`;

class MatchLog extends React.Component {
  componentDidMount() {}

  render() {
    return (<Container>
      <div style={{ textAlign: 'center' }}>
        <h1>Join Event</h1>
        <QRWrapper>
          <QRCode
            size={300}
            value={JSON.stringify({
              object: 'event',
              data: {
                event_id: this.props.event.data.event_id,
                notification: null,
              },
            })}
          />
        </QRWrapper>
      </div>
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h1>Mini-game</h1>
        <QRWrapper>
          <QRCode
            size={300}
            value={JSON.stringify({
              object: 'scan-minigame',
              data: {
                event_id: this.props.event.data.event_id,
              },
            })}
          />
        </QRWrapper>
      </div>
    </Container>);
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

export default connect(mapStateToProps, null)(MatchLog);
