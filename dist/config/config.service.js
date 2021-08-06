"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const fs = require("fs");
const dotenv_1 = require("dotenv");
class ConfigService {
    constructor() {
        const isDevelopmentEnv = process.env.NODE_ENV !== "production";
        if (isDevelopmentEnv) {
            const envFilePath = __dirname + '/../../.env';
            const existPath = fs.existsSync(envFilePath);
            if (!existPath) {
                console.log(".env file doesn't exist");
                process.exit(0);
            }
            this.envConfig = dotenv_1.parse(fs.readFileSync(envFilePath));
            console.log("this.envConfig:", this.envConfig);
        }
        else {
            this.envConfig = {
                PORT: process.env.PORT
            };
        }
    }
    get(key) {
        return this.envConfig[key];
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map