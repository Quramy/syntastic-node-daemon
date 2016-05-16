import fs from 'fs';
import path from 'path';
import { Dispatcher } from './dispatcher';

export class StdioServer {

  constructor() {
    this._dispatcher = new Dispatcher(this);
    this._enableLog = !!process.env['SYNTASTIC_NODE_DAEMON_LOG'];
    this._logFilePath = path.join(process.cwd(), 'snd-debug.log'); 
  }

  createCommand(msg) {
    if(!msg || !msg.length) return null;
    try {
      return JSON.parse(msg);
    }catch(e) {
      this.log('request must be a JSON ' + msg);
      return null;
    }
  }

  log(msg, newLine = true) {
    if(!this._enableLog) return;
    if(newLine) {
      fs.appendFileSync(this._logFilePath, msg + '\n', 'utf-8');
    }else{
      fs.appendFileSync(this._logFilePath, msg, 'utf-8');
    }
  }

  write(msg) {
    const outMsg = JSON.stringify(msg);
    this.log(outMsg);
    process.stdout.write("Content: " + outMsg + '\n');
  }

  start() {
    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', () => {
      const chunks = process.stdin.read();
      if(!chunks) return;
      chunks.split('\n').forEach(chunk => {
        if(!chunk.length) return;
        this.log(`data: ${chunk}`);
        const cmd = this.createCommand(chunk);
        if (cmd) {
          this._dispatcher.dispatch(cmd);
        } else {
          this.write({type: 'error', message: 'request must bu a JSON', request: chunk});
        }
      });
    });

    process.stdin.on('end', () => {
      this.log('Bye!');
    });

    process.on('uncaughtException', err => {
      this.log(err);
      console.error(err);
    });

    if(this._enableLog) {
      fs.writeFileSync(this._logFilePath, 'listening on STDIN...\n', 'utf-8');
    }
  }
}

const server = new StdioServer();
server.start();
