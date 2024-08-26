const { format } = require('logform');
import * as rTracer from 'cls-rtracer';

export default format((info, opts) => {
    const rid = rTracer.id()
    if (rid) {
        info['X-Request-Id'] = rid;
    }
    return info;
  });