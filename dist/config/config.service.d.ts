export declare class ConfigService {
    private readonly envConfig;
    private readonly oneOur;
    private readonly defaultThumbnail;
    private readonly defaultRoomImage;
    constructor();
    get(key: string): string;
    getExpirationTokenTime(): number;
    getDefaultThumbnail(): string;
    getDefaultRoomImage(): string;
}
