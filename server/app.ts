import * as Koa from 'koa';
import * as send from 'koa-send';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import * as fs from 'fs';
import List from './list';
import Update from './update';
import GetApi from './getapi';
import * as conf from './config';
import { NextFunction } from 'connect';

export default () => {
  const router = new Router();

  const App = new Koa();

  App.use(koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
  }));

  App.use(router.routes());
  App.use(router.allowedMethods());


  router.get('/api/list', List)
  router.post('/api/update', Update)
  router.post('/api/getapi', GetApi)

  router.get('/static/*', async (ctx: Koa.ParameterizedContext<any>, next: NextFunction) => {
    await send(ctx, ctx.path, { root: `${__dirname}/../build/` });
  })

  router.get('/favicon.ico', async (ctx: Koa.ParameterizedContext<any>, next: NextFunction) => {
    await send(ctx, ctx.path, { root: `${__dirname}/../build/` });
  })

  router.get('/manifest.json', async (ctx: Koa.ParameterizedContext<any>, next: NextFunction) => {
    await send(ctx, ctx.path, { root: `${__dirname}/../build/` });
  })

  router.get('*', async (ctx: Koa.ParameterizedContext<any>, next: NextFunction) => {
    const template = fs.readFileSync(__dirname + '/../build/index.html', { encoding: 'utf-8' });
    ctx.body = template;
  })


  App.listen(conf.port, () => {
    console.log(`Server running on host http://localhost:${conf.port}`);
  });
}