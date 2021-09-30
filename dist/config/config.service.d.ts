export declare class ConfigService {
    private readonly envConfig;
    private readonly oneOur;
    constructor();
    get(key: string): string;
    getExpirationTokenTime(): number;
}
