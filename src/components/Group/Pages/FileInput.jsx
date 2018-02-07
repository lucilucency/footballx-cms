import React from 'react';
import ReactFileReader from 'react-file-reader';
import { RaisedButton } from 'material-ui';

/* list of supported file types */
const SheetJSFT = [
  'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', 'csv', 'txt', 'ods', 'fods', 'uos', 'sylk', 'dif', 'dbf', 'prn', 'qpw', '123', 'wb*', 'wq*', 'html', 'htm',
].map(x => `.${x}`).join(',');


class DataInput extends React.Component {
  static propTypes = {
    handleFile: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.props.handleFile(files[0]);
  }

  handleFiles(files) {
    if (files && files[0]) this.props.handleFile(files[0]);
  }

  render() {
    return (<div>
      {<ReactFileReader
        fileTypes={SheetJSFT}
        handleFiles={this.handleFiles}
      >
        <RaisedButton
          label={'Open XLSX file'}
        />
      </ReactFileReader>}

      {false && <input
        type="file"
        accept={SheetJSFT}
        onChange={this.handleChange}
      />}
    </div>
    );
  }
}

export default DataInput;

