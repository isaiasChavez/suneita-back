import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigService } from './config/config.service';
export declare class AppModule implements NestModule {
    private readonly _configService;
    static port: number | string;
    constructor(_configService: ConfigService);
    configure(consumer: MiddlewareConsumer): void;
}
