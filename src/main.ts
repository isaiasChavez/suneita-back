import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { json } from 'body-parser';
import * as helmet from 'helmet';
const crPath = '/etc/letsencrypt/live/testapi.leiva.io/fullchain.pem';
const pkPath = '/etc/letsencrypt/live/testapi.leiva.io/privkey.pem';
const options: any = {};

if (fs.existsSync(crPath) && fs.existsSync(pkPath)) {
  // cargamos los archivos sobre las options
  options.httpsOptions = {
    cert: fs.readFileSync(crPath),
    key: fs.readFileSync(pkPath)
  }

}

async function bootstrap() {

  console.log({ options })
  const app = await NestFactory.create(AppModule, options);
  app.use(json({ limit: '10mb' }));
  app.use(helmet());
  app.enableCors();

  app.setGlobalPrefix('api')

  await app.listen(AppModule.port);
}
bootstrap();
