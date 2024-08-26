const { format } = require('logform');
const jsonStringify = require('safe-stable-stringify');

export default format((info, opts) => {
    info.context && (info.context = jsonStringify(info.context))
    info.stack && (info.stack = jsonStringify(info.stack))
    return info;
  });