"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_keys_1 = require("./config/config.keys");
const config_module_1 = require("./config/config.module");
const config_service_1 = require("./config/config.service");
const user_module_1 = require("./modules/user/user/user.module");
const type_module_1 = require("./modules/user/type/type.module");
const asset_module_1 = require("./modules/asset/asset.module");
const token_module_1 = require("./modules/user/token/token.module");
const sesion_module_1 = require("./modules/user/sesion/sesion.module");
const role_module_1 = require("./modules/user/role/role.module");
const upload_module_1 = require("./upload/upload.module");
const target_module_1 = require("./modules/target/target.module");
const suscription_module_1 = require("./modules/suscription/suscription.module");
const user_middleware_1 = require("./modules/user/user.middleware");
let AppModule = AppModule_1 = class AppModule {
    constructor(_configService) {
        this._configService = _configService;
        AppModule_1.port = this._configService.get(config_keys_1.Configuration.PORT);
    }
    configure(consumer) {
        consumer
            .apply(user_middleware_1.UserMiddleware)
            .forRoutes('user', 'asset');
    }
};
AppModule = AppModule_1 = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(),
            mailer_1.MailerModule.forRootAsync({
                useFactory: () => ({
                    transport: {
                        pool: true,
                        host: process.env.SMTP_HOST,
                        port: process.env.SMTP_PORT,
                        secure: true,
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS,
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
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                }),
            }),
            config_module_1.ConfigModule, user_module_1.UserModule, type_module_1.TypeModule, asset_module_1.AssetModule, token_module_1.TokenModule, sesion_module_1.SesionModule, role_module_1.RoleModule, upload_module_1.UploadModule, target_module_1.TargetModule, suscription_module_1.SuscriptionModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    }),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map