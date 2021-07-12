export declare class GetAssetDTO {
    constructor({ adminUuid, userUuid, type }: {
        adminUuid: any;
        userUuid: any;
        type: any;
    });
    userUuid: string;
    adminUuid: string;
    type: number;
}
export declare class CreateAssetDTO {
    constructor({ adminUuid, userUuid, url, type, typeAsset }: {
        adminUuid: any;
        userUuid: any;
        url: any;
        type: any;
        typeAsset: any;
    });
    userUuid: string;
    adminUuid: string;
    url: string;
    typeAsset: number;
    type: number;
}
export declare class DeleteAssetDto {
    constructor({ adminUuid, uuid }: {
        adminUuid: any;
        uuid: any;
    });
    adminUuid: string;
    uuid: string;
}
