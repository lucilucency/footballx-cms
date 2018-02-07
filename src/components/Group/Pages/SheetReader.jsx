import React from 'react';
import XLSX from 'xlsx';
import FileInput from './FileInput';
import Table from 'components/Table';
import { Row } from 'utils';

/* generate an array of column objects */
const makeCols = (refstr) => {
  const o = [];
  const C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (let i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};

class SheetReader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataRaw: [],
      cols: [],
    };
    this.handleFile = this.handleFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
  }
  handleFile(file) {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const dataRaw = Object.assign([], data);
      /* remove 1st row */
      data.shift();
      data = data.map(row => ({
        name: row[0],
        email: row[1],
        phone: row[2],
        city: row[3],
        address: row[4],
        membership_code: row[7],
      }));
      this.setState({ data, cols: makeCols(ws['!ref']), dataRaw });
    };
    if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  }
  exportFile() {
    const ws = XLSX.utils.aoa_to_sheet(this.state.dataRaw);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    XLSX.writeFile(wb, 'output-file.xlsx');
  }

  render() {
    return (<div>
      <DragDropFile handleFile={this.handleFile}>
        <Row>
          <FileInput handleFile={this.handleFile} />
        </Row>
      </DragDropFile>

      {this.state.data.length ? <Table
        paginated
        columns={[{
          displayName: 'Name',
          field: 'name',
        }, {
          displayName: 'Email',
          field: 'email',
        }, {
          displayName: 'Phone',
          field: 'phone',
        }, {
          displayName: 'City',
          field: 'city',
        }, {
          displayName: 'Address',
          field: 'address',
        }, {
          displayName: 'Membership Code',
          field: 'membership_code',
        }]}
        data={this.state.data}
      /> : null}
      {false ? <Row>
        <button onClick={this.exportFile}>Export</button>
      </Row> : null}
    </div>);
  }
}

/* -------------------------------------------------------------------------- */

/*
  Simple HTML5 file drag-and-drop wrapper
  usage: <DragDropFile handleFile={handleFile}>...</DragDropFile>
    handleFile(file:File):void;
*/
class DragDropFile extends React.Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }
  suppress(evt) { evt.stopPropagation(); evt.preventDefault(); }
  onDrop(evt) {
    evt.stopPropagation(); evt.preventDefault();
    const files = evt.dataTransfer.files;
    if (files && files[0]) this.props.handleFile(files[0]);
  }
  render() {
    return (
      <div onDrop={this.onDrop} onDragEnter={this.suppress} onDragOver={this.suppress}>
        {this.props.children}
      </div>
    );
  }
}


export default SheetReader;