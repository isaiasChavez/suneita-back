"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const body_parser_1 = require("body-parser");
const helmet = require("helmet");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(body_parser_1.json({ limit: '10mb' }));
    app.use(helmet());
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.listen(app_module_1.AppModule.port);
}
bootstrap();
//# sourceMappingURL=main.js.map