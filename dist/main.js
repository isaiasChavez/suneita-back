"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fs = require("fs");
const body_parser_1 = require("body-parser");
const helmet = require("helmet");
const crPath = '/etc/letsencrypt/live/bioderma.inmersys.xyz/fullchain.pem';
const pkPath = '/etc/letsencrypt/live/bioderma.inmersys.xyz/privkey.pem';
const options = {};
if (fs.existsSync(crPath) && fs.existsSync(pkPath)) {
    options.httpsOptions = {
        cert: fs.readFileSync(crPath),
        key: fs.readFileSync(pkPath)
    };
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, options);
    app.use(body_parser_1.json({ limit: '10mb' }));
    app.use(helmet());
    app.enableCors();
    app.setGlobalPrefix('api');
    await app.listen(app_module_1.AppModule.port);
    console.log(`Ocupath api running on port ${app_module_1.AppModule.port} `);
}
bootstrap();
//# sourceMappingURL=main.js.map