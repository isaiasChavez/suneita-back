import * as fs from 'fs'
import { parse } from 'dotenv'
export class ConfigService {

    private readonly envConfig: { [key: string]: string }


    constructor() {
        const isDevelopmentEnv = process.env.NODE_ENV !== "production";

        if (isDevelopmentEnv) {

            const envFilePath = __dirname + '/../../.env'
            const existPath = fs.existsSync(envFilePath)
            if (!existPath) {
                console.log(".env file doesn't exist")
                process.exit(0)
            }
            this.envConfig = parse(fs.readFileSync(envFilePath))
        } else {
            this.envConfig = {
                PORT: process.env.PORT,
                BUCKET_NAME: process.env.BUCKET_NAME,
                AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
                AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
                S3_ENDPOINT: process.env.S3_ENDPOINT,
                BUCKED_ENDPOINT: process.env.BUCKED_ENDPOINT,
            }
        }

    }
    get(key: string): string {
        return this.envConfig[key]
    }

}