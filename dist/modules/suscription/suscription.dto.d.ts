import { SimpleRequest } from "../user/user/user.dto";
export declare class UpdateSuscriptionDTO {
    constructor({ adminUuid, startedAt, finishedAt, cost, business }: {
        adminUuid: any;
        startedAt: any;
        finishedAt: any;
        cost: any;
        business: any;
    });
    adminUuid: string;
    startedAt: string;
    finishedAt: string;
    cost: number;
    business: string;
}
export declare class AddNewSuscriptionSuscriptionDTO extends SimpleRequest {
    constructor({ userUuid, adminUuid, superAdminUuid, type, invitations, cost, startedAt, finishedAt, typeToUpdate, adminUuidToUpdate, guestUuidToUpdate }: {
        userUuid: any;
        adminUuid: any;
        superAdminUuid: any;
        type: any;
        invitations: any;
        cost: any;
        startedAt: any;
        finishedAt: any;
        typeToUpdate: any;
        adminUuidToUpdate: any;
        guestUuidToUpdate: any;
    });
    invitations: number;
    cost: number;
    startedAt: string;
    finishedAt: string;
    typeToUpdate: number;
    adminUuidToUpdate: string;
    guestUuidToUpdate: string;
}
