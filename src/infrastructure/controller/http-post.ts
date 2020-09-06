import { Container, Service, Inject } from 'typedi';
import {
  JsonController,
  Post,
  Req,
  UseAfter,
  UseBefore,
  Body,
} from 'routing-controllers';
import { ApiBase, ApiError, ApiResponse } from '../../lib/net';
import { ErrCode } from '../../model/enum';
import { getMetadataStorage, validate } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import { LogBase } from '../../lib/os/log';

//拦截器 - 前
function handleBefore(
  req: any,
  _: any,
  next: () => Promise<any>
): Promise<void> {
  req.liteApi = {};
  try {
    const Api = require(`../../api/${req.params.service}/${req.params.action}`)
      .default;
    req.liteApi.instance = Container.get<ApiBase>(Api);
    Container.remove(Api);
    req.liteApi.validationMetadatas = getMetadataStorage().getTargetValidationMetadatas(
      Api,
      undefined
    );
  } catch (ex) {
    req.liteApi.err = ex;
  }
  return next();
}

//拦截器 - 后
async function handleAfter(
  req: any,
  _: any,
  next: () => Promise<any>
): Promise<void> {
  try {
    if (req.liteApi) {
      await req.liteApi.instance.after();
    }
  } catch { }

  return next();
}

@JsonController()
@Service()
export class HttpPostController {
  @Inject()
  public log: LogBase;

  @Post('/:service/:action')
  @UseBefore(handleBefore)
  @UseAfter(handleAfter)
  public async post(@Body() body: any, @Req() req: any): Promise<ApiResponse> {
    try {
      if (req.liteApi.err) {
        throw req.liteApi.err;
      }

      const api = req.liteApi.instance as ApiBase;
      api.$route = req.path;
      const validationMetadatas = req.liteApi
        .validationMetadatas as ValidationMetadata[];
      validationMetadatas.forEach((r) => {
        api[r.propertyName] = body[r.propertyName];
      });
      if (validationMetadatas.length) {
        const errors = await validate(api);
        if (errors.length) {
          if (errors.length) {
            this.log.warn(
              errors
                .reduce(
                  (memo, r): string[] => {
                    memo.push(r.toString());
                    return memo;
                  },
                  [req.path]
                )
                .join('\n-')
            );
            throw new ApiError(ErrCode.JieKouCanShu);
          }
        }
      }
      return {
        err: 0,
        data: await api.invoke(),
      };
    } catch (ex) {
      if (ex.constructor == ApiError) {
        const err = ex as ApiError;
        return {
          err: err.code,
          data: err.message,
        };
      }
      console.log(new Date(), ex);
      return {
        err: ErrCode.YiChang,
        data: '',
      };
    }
  }
}
