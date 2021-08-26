export declare class UserDTO {
    constructor({ email, uuid, name, avatar, isActive, lastname }: {
        email: any;
        uuid: any;
        name: any;
        avatar: any;
        isActive: any;
        lastname: any;
    });
    isActive: boolean;
    lastname: string;
    avatar: string;
    name: string;
    uuid: string;
    email: string;
}
export declare class InviteAdminDTO {
    constructor({ email, type }: {
        email: any;
        type: any;
    });
    superAdminUuid: number;
    email: string;
    type: number;
}
export declare class SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type }: {
        adminUuid: any;
        superAdminUuid: any;
        userUuid: any;
        type: any;
    });
    adminUuid: string;
    userUuid: string;
    superAdminUuid: string;
    type: number;
}
export declare class InviteUserDTO extends SimpleRequest {
    constructor({ userUuid, adminUuid, superAdminUuid, type, company, name, invitations, cost, startedAt, finishedAt, email, typeToInvite, }: {
        userUuid: any;
        adminUuid: any;
        superAdminUuid: any;
        type: any;
        company: any;
        name: any;
        invitations: any;
        cost: any;
        startedAt: any;
        finishedAt: any;
        email: any;
        typeToInvite: any;
    });
    email: string;
    company: string;
    name: string;
    invitations: number;
    cost: number;
    startedAt: string;
    finishedAt: string;
    typeToInvite: number;
}
export declare class FindUserChildrens {
    constructor({ adminUuid, superAdminUuid, type }: {
        adminUuid: any;
        superAdminUuid: any;
        type: any;
    });
    adminUuid: string;
    superAdminUuid: string;
    type: number;
}
export declare class ChangeName extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, name }: {
        adminUuid: any;
        superAdminUuid: any;
        userUuid: any;
        type: any;
        name: any;
    });
    name: string;
}
export declare class ConfirmUserPassword {
    constructor({ email, password }: {
        email: any;
        password: any;
    });
    email: string;
    password: string;
}
export declare class SetSesionAppId extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, playerId }: {
        adminUuid: any;
        superAdminUuid: any;
        userUuid: any;
        type: any;
        playerId: any;
    });
    playerId: string;
}
export declare class CreateSuperAdminDTO {
    constructor({ name, lastname, email, password, passwordmaster }: {
        name: any;
        lastname: any;
        email: any;
        password: any;
        passwordmaster: any;
    });
    passwordmaster: string;
    name: string;
    lastname: string;
    email: string;
    password: string;
}
export declare class UpdateUserAdminDTO extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, name, lastname, startedAt, finishedAt, cost, business, adminUuidToUpdate }: {
        adminUuid: any;
        superAdminUuid: any;
        userUuid: any;
        type: any;
        name: any;
        lastname: any;
        startedAt: any;
        finishedAt: any;
        cost: any;
        business: any;
        adminUuidToUpdate: any;
    });
    name: string | null;
    lastname: string | null;
    business: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    cost: number;
    adminUuidToUpdate: string;
}
export declare class UpdateGuestDTO extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, name, lastname, startedAt, finishedAt, cost, userUuidToUpdate }: {
        adminUuid: any;
        superAdminUuid: any;
        userUuid: any;
        type: any;
        name: any;
        lastname: any;
        startedAt: any;
        finishedAt: any;
        cost: any;
        userUuidToUpdate: any;
    });
    name: string;
    lastname: string;
    startedAt: string | null;
    finishedAt: string;
    cost: number;
    userUuidToUpdate: string;
}
export declare class UpdateUserDTO extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, name, avatar, thumbnail }: {
        adminUuid: any;
        superAdminUuid: any;
        userUuid: any;
        type: any;
        name: any;
        avatar: any;
        thumbnail: any;
    });
    name: string;
    avatar: string;
    thumbnail: string;
}
export declare class DeleteAdminUserDTO {
    constructor({ superAdminUuid, adminUuidToStop, status }: {
        superAdminUuid: any;
        adminUuidToStop: any;
        status: any;
    });
    superAdminUuid: number;
    adminUuidToStop: number;
    status: boolean;
}
export declare class GetUserDetailDTO {
    constructor({ adminUuid, superAdminUuid, type, userUuidToGet }: {
        adminUuid: any;
        superAdminUuid: any;
        type: any;
        userUuidToGet: any;
    });
    superAdminUuid: number;
    adminUuid: number;
    userUuidToGet: number;
    type: number;
}
export declare class GetAdminDetailDTO {
    constructor({ adminUuid, superAdminUuid, type, adminUuidToGet }: {
        adminUuid: any;
        superAdminUuid: any;
        type: any;
        adminUuidToGet: any;
    });
    superAdminUuid: number;
    adminUuid: number;
    adminUuidToGet: number;
    type: number;
}
export declare class DeleteUserDTO extends SimpleRequest {
    constructor({ adminUuid, superAdminUuid, userUuid, type, userUuidToChange, status }: {
        adminUuid: any;
        superAdminUuid: any;
        userUuid: any;
        type: any;
        userUuidToChange: any;
        status: any;
    });
    userUuidToChange: number;
    status: boolean;
}
