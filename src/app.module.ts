import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './config/config.keys';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './modules/user/user/user.module';
import { TypeModule } from './modules/user/type/type.module';
import { AssetModule } from './modules/asset/asset.module';
import { TokenModule } from './modules/user/token/token.module';
import { SesionModule } from './modules/user/sesion/sesion.module';
import { RoleModule } from './modules/user/role/role.module';
import { UploadModule } from './upload/upload.module';
import { TargetModule } from './modules/target/target.module';
import { SuscriptionModule } from './modules/suscription/suscription.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          pool: true,
          host: process.env.SMTP_HOST, // "smtp.ethereal.email",
          port: process.env.SMTP_PORT, // 587,
          secure: true, // false,
          auth: {
            user: process.env.SMTP_USER, // 'nicola.bruen@ethereal.email',
            pass: process.env.SMTP_PASS, // 'a3UQAZ3E4yZMu9JG74'
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: '"Bioderma" <noreplay@bioderma.mx>',
        },
        template: {
          dir: __dirname + "/templates",
          adapter: new HandlebarsAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    ConfigModule, UserModule, TypeModule, AssetModule, TokenModule, SesionModule, RoleModule, UploadModule, TargetModule, SuscriptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number | string;
  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT)
  }

}
