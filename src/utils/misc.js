/* eslint-disable */
/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
export const hsvToRgb = (h, s, v) => {
  let r;
  let g;
  let b;

  const i = Math.floor(h * 6);
  const f = (h * 6) - i;
  const p = v * (1 - s);
  const q = v * (1 - (f * s));
  const t = v * (1 - ((1 - f) * s));

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
    default:
      r = v;
      g = t;
      b = p;
  }

  return [r * 255, g * 255, b * 255];
};

function shadeBlendConvert(p = 0, from, to) {
  const sbcRip = function (d) {
    let l = d.length,
      RGB = new Object();
    if (l > 9) {
      d = d.split(',');
      RGB[0] = i(d[0].slice(4)), RGB[1] = i(d[1]), RGB[2] = i(d[2]), RGB[3] = d[3] ? parseFloat(d[3]) : -1;
    } else {
      if (l < 6)d = `#${d[1]}${d[1]}${d[2]}${d[2]}${d[3]}${d[3]}${l > 4 ? `${d[4]}${d[4]}` : ''}`; // 3 digit
      // eslint-disable-next-line no-mixed-operators,no-unused-expressions
      d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = l == 9 || l == 5 ? r(((d >> 24 & 255) / 255) * 10000) / 10000 : -1;
    }
    return RGB;
  };
  var i = parseInt,
    r = Math.round,
    h = typeof (to) === 'string' ? to.length > 9 ? true : to === 'c' ? !h : false : h,
    b = p < 0,
    p = b ? p * -1 : p,
    __to = to && to !== 'c' ? to : b ? '#000000' : '#FFFFFF',
    f = sbcRip(from),
    t = sbcRip(__to);
  if (h) return `rgb(${r((t[0] - f[0]) * p + f[0])},${r((t[1] - f[1]) * p + f[1])},${r((t[2] - f[2]) * p + f[2])}${f[3] < 0 && t[3] < 0 ? ')' : `,${f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3]})`}`;
  return `#${(0x100000000 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255) * 0x1000000 + r((t[0] - f[0]) * p + f[0]) * 0x10000 + r((t[1] - f[1]) * p + f[1]) * 0x100 + r((t[2] - f[2]) * p + f[2])).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3)}`;
}

export function lighten(color, percent) {
  return shadeBlendConvert(percent, color);
}

export function darken(color, percent) {
  return shadeBlendConvert(-percent, color);
}

export function percentage(input, toFixed) {
  return (input * 100).toFixed(toFixed || 2);
}

export function createConstants(...constants) {
  return constants.reduce((acc, constant) => {
    acc[constant] = constant;
    return acc;
  }, {});
}

export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];


    return reducer
      ? reducer(state, action.payload)
      : state;
  };
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
