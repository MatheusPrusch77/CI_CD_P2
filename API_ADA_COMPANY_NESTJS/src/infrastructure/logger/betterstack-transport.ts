import Transport from 'winston-transport';
import axios from 'axios';

export class BetterStackTransport extends Transport {
  private endpoint: string;

  constructor(opts: any) {
    super(opts);
    this.endpoint = opts.endpoint;
  }

  log(info: any, callback: () => void) {
    setImmediate(() => this.emit('logged', info));
    axios.post(this.endpoint, {
      level: info.level,
      message: info.message,
      meta: info.meta || {},
      timestamp: new Date().toISOString(),
    }).catch(() => { /* ignore errors */ });
    callback();
  }
}