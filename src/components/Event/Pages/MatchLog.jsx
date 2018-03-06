import React from 'react';
import { connect } from 'react-redux';
import QRCode from 'qrcode.react';

class MatchLog extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.app.metadata.data.user,
});

export default connect(mapStateToProps, null)(MatchLog);
