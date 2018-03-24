/* eslint-disable react/forbid-prop-types */
import React from 'react';
import XLSX from 'xlsx';
import Table from 'components/Table/index';
import { Row, toDateString, validateEmail } from 'utils';
import strings from 'lang';
// import Container from 'components/Container';
import styled, { css } from 'styled-components';
import FileInput from './FileInput';

const fileHeader = {
  name: strings.th_name,
  email: strings.th_email,
  phone: strings.th_phone,
  dob: strings.th_dob,
  city: strings.th_city,
  address: strings.th_address,
  gender: strings.th_gender,
  size: strings.th_membership_t_shirt_size,
  joined_year: strings.th_membership_joined_year,
  is_purchase: strings.th_membership_is_purchase,
  membership_code: strings.th_membership_code,
};

const State = styled.div`
  ${props => (props.isValid ? css`
    color: lightgreen;
  ` : css`
    color: red;
  `)}
`;

const isValidHeader = header => header.indexOf(fileHeader.name) !== -1 &&
    header.indexOf(fileHeader.email) !== -1 &&
    header.indexOf(fileHeader.phone) !== -1 &&
    header.indexOf(fileHeader.city) !== -1 &&
    header.indexOf(fileHeader.address) !== -1 &&
    header.indexOf(fileHeader.membership_code) !== -1;

const downloadExampleFile = () => {
  const data = [
    [
      fileHeader.name,
      fileHeader.email,
      fileHeader.phone,
      fileHeader.dob,
      fileHeader.city,
      fileHeader.address,
      fileHeader.gender,
      fileHeader.size,
      fileHeader.joined_year,
      fileHeader.is_purchase,
      fileHeader.membership_code,
    ],
    ['Lê Thuý Ngọc', 'ngocle@gmaill.com', '1633456789', 'Đà Nẵng', 'Liên Chiểu', '26/5/1996', 'Nữ', 'DNA17001'],
    ['Lê Thuý Ngọc', 'ngocle@gmaill.com', '1633456789', 'Đà Nẵng', 'Liên Chiểu', '26/5/1996', 'Nữ', 'DNA17001'],
    ['Lê Thuý Ngọc', 'ngocle@gmaill.com', '1633456789', 'Đà Nẵng', 'Liên Chiểu', '26/5/1996', 'Nữ', 'DNA17001'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  XLSX.writeFile(wb, 'example.xlsx');
};

const toGenderString = (input) => {
  if (input) {
    const __input = input.trim();
    if (__input === 'Nam' || __input === 'NAM' || __input === 'nam' || __input === 'male' || __input === 'Male') {
      return 'male';
    } else if (__input === 'Nữ' || __input === 'NỮ' || __input === 'nữ' || __input === 'Female' || __input === 'female') {
      return 'female';
    }
    return '';
  }
  return '';
};

class SheetReader extends React.Component {
  static propTypes = {
    groupMembers: React.PropTypes.array,
    onUpload: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      cols: [],
    };
    this.handleFile = this.handleFile.bind(this);
    this.isValidRow = this.isValidRow.bind(this);
  }

  componentWillReceiveProps(props) {
    this.groupMembersPhone = props.groupMembers.map(o => o.phone);
    this.groupMembersEmail = props.groupMembers.map(o => o.email);
  }

  isValidRow(row) {
    const isValidEmail = validateEmail(row[2]);
    const notExistPhone = this.groupMembersPhone.indexOf(row[3]) === -1;
    // const notExistEmail = this.groupMembersEmail.indexOf(row[2]) === -1;
    return isValidEmail && notExistPhone;
  }


  handleFile(file) {
    this.setState({ errorText: null });
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
      /* remove 1st row */
      const header = data.shift();
      if (true || isValidHeader(header)) {
        data = data.filter(o => o[0]).map(row => ({
          name: row[1],
          email: row[2],
          phone: row[3],
          dob: toDateString(row[6]),
          city: row[4],
          address: row[5],
          gender: toGenderString(row[7]),
          // size: row[8],
          // joined_year: row[9],
          // is_purchase: Boolean(row[10]),
          membership_code: row[8],
          is_valid: this.isValidRow(row),
        }));
        this.setState({ data }, () => {
          console.log(this.state.data);
          this.props.onUpload(this.state.data);
        });
      } else {
        this.setState({ errorText: 'Invalid format!' });
      }
    };
    if (rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  }

  render() {
    return (<div>
      {this.state.errorText && <Row>
        {this.state.errorText} - <button onClick={downloadExampleFile}>Download template file</button>
      </Row>}

      <Row>
        <FileInput handleFile={this.handleFile} />
      </Row>

      {this.state.data.length ? <Table
        paginated
        pageLength={30}
        columns={[{
          displayName: fileHeader.name,
          field: 'name',
        }, {
          displayName: fileHeader.email,
          field: 'email',
        }, {
          displayName: fileHeader.phone,
          field: 'phone',
        }, {
          displayName: fileHeader.dob,
          field: 'dob',
        }, {
          displayName: fileHeader.city,
          field: 'city',
        }, {
          displayName: fileHeader.address,
          field: 'address',
        }, {
          displayName: fileHeader.gender,
          field: 'gender',
        }, false && {
          displayName: fileHeader.size,
          field: 'size',
        }, false && {
          displayName: fileHeader.joined_year,
          field: 'joined_year',
        }, false && {
          displayName: fileHeader.is_purchase,
          field: 'is_purchase',
          displayFn: (row, col, field) => (<div>
            {field && <img src="/assets/images/paid-rectangle-stamp-300.png" alt="" width={50} />}
          </div>),
        }, {
          displayName: fileHeader.membership_code,
          field: 'membership_code',
        }, {
          displayName: '',
          field: 'is_valid',
          displayFn: (row, col, field) => (<div>
            <State isValid={field}>{field.toString()}</State>
          </div>),
        }]}
        data={this.state.data}
      /> : null}
    </div>);
  }
}

export default SheetReader;
