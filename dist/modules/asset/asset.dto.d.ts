import { SimpleRequest } from "../user/user/user.dto";
export declare class CreateAssetDTO extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, url, typeAsset, thumbnail }: {
        adminUuid: any;
        superAdminUuid: any;
        userUuid: any;
        type: any;
        url: any;
        typeAsset: any;
        thumbnail: any;
    });
    url: string;
    thumbnail: string;
    typeAsset: number;
}
export declare class DeleteAssetDto extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, uuid }: {
        adminUuid: any;
        superAdminUuid: any;
        userUuid: any;
        type: any;
        uuid: any;
    });
    uuid: string;
}
