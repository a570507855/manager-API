import 'reflect-metadata'; // 引入必要库
import * as express from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container, Service } from 'typedi';
import {
  JsonController,
  Post,
  Req,
  UseAfter,
  UseBefore,
} from 'routing-controllers';

async function handleAfter(
  req: any,
  _: any,
  next: () => Promise<any>
): Promise<void> {
  try {
    console.log('handleAfter');
    console.log(req.liteApi);
    if (req.liteApi) {
      await req.liteApi.instance.after();
    }
  } catch {}

  try {
  } catch {}
  return next();
}

function handleBefore(
  req: any,
  resp: any,
  next: () => Promise<any>
): Promise<void> {
  console.log('handleBefore');
  req.liteApi = {};
  resp;
  try {
    const Api = require(`./api/${req.params.service}/${req.params.action}`)
      .default;
    console.log('Api:', Api);
    req.liteApi.instance = Container.get(Api);
    console.log('instance', req.liteApi.instance);
    Container.remove(Api);

    // req.liteApi.validationMetadatas = getMetadataStorage().getTargetValidationMetadatas(
    //     Api,
    //     undefined
    // );
  } catch (ex) {
    console.log(ex);
    req.liteApi.err = ex;
  }

  return next();
}

@JsonController()
@Service()
export class HttpPostController {
  @Post('/:service/:action')
  @UseAfter(handleAfter)
  @UseBefore(handleBefore)
  public async post(@Req() req: any): Promise<any> {
    try {
      if (req.liteApi.err) {
        throw req.liteApi.err;
      }

      const api = req.liteApi.instance as any;
      api.$route = req.path;
      console.log(api.$route);
      return {
        err: 0,
        data: await api.invoke(),
      };
    } catch (ex) {
      return {
        err: 'error',
        data: '',
      };
    }
  }
}

useContainer(Container);
const app = express();
useExpressServer(app, {
  controllers: [HttpPostController],
}).listen(3000);
