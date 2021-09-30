"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const fs = require("fs");
const dotenv_1 = require("dotenv");
class ConfigService {
    constructor() {
        this.oneOur = 3600;
        const isDevelopmentEnv = process.env.NODE_ENV !== "production";
        if (isDevelopmentEnv) {
            const envFilePath = __dirname + '/../../.env';
            const existPath = fs.existsSync(envFilePath);
            if (!existPath) {
                console.log(".env file doesn't exist");
                process.exit(0);
            }
            this.envConfig = dotenv_1.parse(fs.readFileSync(envFilePath));
        }
        else {
            this.envConfig = {
                PORT: process.env.PORT,
                BUCKET_NAME: process.env.BUCKET_NAME,
                AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
                AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
                S3_ENDPOINT: process.env.S3_ENDPOINT,
                BUCKED_ENDPOINT: process.env.BUCKED_ENDPOINT,
            };
        }
    }
    get(key) {
        return this.envConfig[key];
    }
    getExpirationTokenTime() {
        return this.oneOur * 2;
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map