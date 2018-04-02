/* eslint-disable import/no-extraneous-dependencies,no-proto,no-use-before-define,no-param-reassign,no-unused-expressions,one-var,prefer-const,no-multi-assign,no-return-assign,func-names,prefer-rest-params,max-len */


const _createClass = (function () { function defineProperties(target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }());

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === 'object' || typeof call === 'function') ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError(`Super expression must either be null or a function, not ${typeof superClass}`); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const PropTypes = require('prop-types');
// qr.js doesn't handle error level of zero (M) so we need to do it right,
// thus the deep require.
const QRCodeImpl = require('qr.js/lib/QRCode');
const ErrorCorrectLevel = require('qr.js/lib/ErrorCorrectLevel');

function getBackingStorePixelRatio(ctx) {
  return (
    // $FlowFixMe
    ctx.webkitBackingStorePixelRatio ||
    // $FlowFixMe
    ctx.mozBackingStorePixelRatio ||
    // $FlowFixMe
    ctx.msBackingStorePixelRatio ||
    // $FlowFixMe
    ctx.oBackingStorePixelRatio ||
    // $FlowFixMe
    ctx.backingStorePixelRatio || 1
  );
}

const MrSuicideGoatQRCode = (function (_React$Component) {
  _inherits(QRCode, _React$Component);

  function QRCode() {
    _classCallCheck(this, QRCode);

    return _possibleConstructorReturn(this, (QRCode.__proto__ || Object.getPrototypeOf(QRCode)).apply(this, arguments));
  }

  _createClass(QRCode, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      const _this2 = this;

      return Object.keys(QRCode.propTypes).some(k => _this2.props[k] !== nextProps[k]);
    },
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.update();
    },
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.update();
    },
  }, {
    key: 'update',
    value: function update() {
      let _props = this.props,
        value = _props.value,
        size = _props.size,
        level = _props.level,
        bgColor = _props.bgColor,
        fgColor = _props.fgColor;

      // We'll use type===-1 to force QRCode to automatically pick the best type

      const qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
      qrcode.addData(value);
      qrcode.make();

      if (this._canvas != null) {
        const canvas = this._canvas;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return;
        }
        const cells = qrcode.modules;
        if (cells === null) {
          return;
        }
        const tileW = size / cells.length;
        const tileH = size / cells.length;
        const scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
        canvas.height = canvas.width = size * scale;
        ctx.scale(scale, scale);

        cells.forEach((row, rdx) => {
          row.forEach((cell, cdx) => {
            ctx && (ctx.fillStyle = cell ? fgColor : bgColor);
            const w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
            const h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
            ctx && ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
          });
        });

        this.props.getCanvas(this._canvas);
      }
    },
  }, {
    key: 'render',
    value: function render() {
      const _this3 = this;

      return React.createElement('canvas', {
        style: { height: this.props.size, width: this.props.size },
        height: this.props.size,
        width: this.props.size,
        ref: function ref(_ref) {
          return _this3._canvas = _ref;
        },
      });
    },
  }]);

  return QRCode;
}(React.Component));

Object.defineProperty(MrSuicideGoatQRCode, 'defaultProps', {
  enumerable: true,
  writable: true,
  value: {
    size: 128,
    level: 'L',
    bgColor: '#FFFFFF',
    fgColor: '#000000',
  },
});
Object.defineProperty(MrSuicideGoatQRCode, 'propTypes', {
  enumerable: true,
  writable: true,
  value: {
    value: PropTypes.string.isRequired,
    size: PropTypes.number,
    level: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
    bgColor: PropTypes.string,
    fgColor: PropTypes.string,
    getCanvas: PropTypes.func,
  },
});


module.exports = MrSuicideGoatQRCode;
