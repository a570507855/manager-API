import { Service, Inject } from 'typedi';

import { ApiBase } from '../../lib/net';
import { DbFactoryBase } from '../../lib/os/db';
import { User } from '../../model/global';
import { Length } from 'class-validator';

@Service()
export default class LoginApi extends ApiBase {
  @Inject()
  public dbFactory: DbFactoryBase;

  @Length(6, 20)
  public account: string;

  @Length(6, 20)
  public password: string;


  public async invoke(): Promise<any> {
    const db = this.dbFactory.db<User>(User);

    const users = await db
      .query()
      .where({
        account: this.account,
        password: this.password
      })
      .toArray();
    return users.length ? users[0].id : false;
  }
}



// import { SQL } from '../../mysql/SQL';
// const jwt = require('jsonwebtoken');
// //jsonwebtoken是用来生成token给客户端的，express-jwt是用来验证token的。
// const loginAPI = require('express').Router();
// const login = new SQL('user');

// loginAPI.post('/login', (request: any, response: any) => {
//   const sql = `select * from user where account = ${request.body.account} and password = '${request.body.password}'`;
//   login.query(sql).then(
//     (res) => {
//       if (res.length) {
//         let rule = {
//           id: res[0].id,
//           name: res[0].name,
//           sex: res[0].sex,
//           account: res[0].account,
//         };
//         jwt.sign(
//           rule,
//           'xyy',
//           { expiresIn: 60, algorithm: 'HS256' },
//           (err: Error, token: any) => {
//             if (err) throw err;
//             console.log('token_1:', token);
//             response.send({
//               code: 0,
//               isExist: true,
//               token: token,
//             });
//             // setTimeout(() => {
//             //   const ptoken = jwt.verify(
//             //     token,
//             //     'xyy ',
//             //     { algorithm: 'HS256' },
//             //     (err: Error, decoded: any) => {
//             //       if (err) console.log('err:', err);
//             //       else console.log(decoded);
//             //     }
//             //   );
//             //   console.log('ptoken:', ptoken);
//             // }, 5000);
//           }
//         );
//       } else {
//         response.send({
//           code: 5000, //账号不存在
//         });
//       }
//     },
//     (err) => {
//       response.send({ code: 599 });
//       console.log(err);
//     }
//   );
// });
// export { loginAPI };
