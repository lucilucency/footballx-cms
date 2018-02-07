import React from 'react';
import ReactFileReader from 'react-file-reader';

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
  }

  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.props.handleFile(files[0]);
  }

  handleFiles(files) {
    console.log(files);
  }

  render() {
    return (<div>
      {false && <ReactFileReader handleFiles={this.handleFiles} multipleFiles>
        <button className="btn">Upload</button>
      </ReactFileReader>}

      <input
        type="file"
        accept={SheetJSFT}
        onChange={this.handleChange}
      />
    </div>
    );
  }
}

export default DataInput;

