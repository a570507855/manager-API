import { Service } from 'typedi';

@Service()
export default class UserApi {
  public async invoke(): Promise<any> {
    return 'test';
  }
}
