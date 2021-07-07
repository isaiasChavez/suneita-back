export declare class InviteAdminDTO {
    constructor({ email, type }: {
        email: any;
        type: any;
    });
    superAdminUuid: number;
    email: string;
    type: number;
}
export declare class InviteUserDTO {
    constructor({ adminUuid, superAdminUuid, company, name, invitations, cost, startedAt, finishedAt, email, type, typeToInvite, }: {
        adminUuid: any;
        superAdminUuid: any;
        company: any;
        name: any;
        invitations: any;
        cost: any;
        startedAt: any;
        finishedAt: any;
        email: any;
        type: any;
        typeToInvite: any;
    });
    adminUuid: string;
    superAdminUuid: string;
    email: string;
    company: string;
    name: string;
    invitations: number;
    cost: number;
    startedAt: string;
    finishedAt: string;
    type: number;
    typeToInvite: number;
}
export declare class ConfirmUserPassword {
    constructor({ email, password }: {
        email: any;
        password: any;
    });
    email: string;
    password: string;
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
export declare class UpdateUserAdminDTO {
    constructor({ superAdminUuid, adminUuid, name, lastname, avatar, startedAt, finishedAt, cost, business, }: {
        superAdminUuid: any;
        adminUuid: any;
        name: any;
        lastname: any;
        avatar: any;
        startedAt: any;
        finishedAt: any;
        cost: any;
        business: any;
    });
    superAdminUuid: string;
    adminUuid: string;
    name: string | null;
    lastname: string | null;
    avatar: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    cost: number;
    business: string | null;
}
export declare class UpdateUserDTO {
    constructor({ userUuid, adminUuid, name, lastname, avatar }: {
        userUuid: any;
        adminUuid: any;
        name: any;
        lastname: any;
        avatar: any;
    });
    userUuid: string;
    adminUuid: string;
    name: string;
    avatar: string;
    lastname: string;
}
export declare class DeleteAdminUserDTO {
    constructor({ superAdminUuid, adminUuid, status }: {
        superAdminUuid: any;
        adminUuid: any;
        status: any;
    });
    superAdminUuid: number;
    adminUuid: number;
    status: boolean;
}
export declare class DeleteUserDTO {
    constructor({ adminUuid, userUuid }: {
        adminUuid: any;
        userUuid: any;
    });
    adminUuid: number;
    userUuid: number;
}
