import * as express from 'express';
import { ComponentBase } from './base';
import { useContainer, useExpressServer } from 'routing-controllers';
import Container from 'typedi';
const bodyParser = require('body-parser');
const cors = require('cors');
export class ExpressServer extends ComponentBase {
  public constructor(private m_controllers: Function[]) {
    super();
  }

  public async load(): Promise<void> {
    useContainer(Container);

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(cors());

    app.all('*', (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Max-Age', '2592000'); //将options缓存起来，避免发送多次options
      }
      next();
    });
    useExpressServer(app, {
      controllers: this.m_controllers,
    }).listen(8888);
  }
}
