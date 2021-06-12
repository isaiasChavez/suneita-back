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
    constructor({ adminUuid, superAdminUuid, email, type }: {
        adminUuid: any;
        superAdminUuid: any;
        email: any;
        type: any;
    });
    adminUuid: string;
    superAdminUuid: string;
    email: string;
    type: number;
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
export declare class CreateAdminDTO {
    constructor({ superAdminUuid, name, lastname, email, password, startedAt, finishedAt, business, cost }: {
        superAdminUuid: any;
        name: any;
        lastname: any;
        email: any;
        password: any;
        startedAt: any;
        finishedAt: any;
        business: any;
        cost: any;
    });
    superAdminUuid: number;
    name: string;
    lastname: string;
    email: string;
    password: string;
    startedAt: string;
    finishedAt: string;
    cost: number;
    business: string;
}
export declare class CreateUserDTO {
    constructor({ adminUuid, name, lastname, email, password }: {
        adminUuid: any;
        name: any;
        lastname: any;
        email: any;
        password: any;
    });
    adminUuid: number;
    name: string;
    lastname: string;
    email: string;
    password: string;
}
export declare class UpdateUserAdminDTO {
    constructor({ superAdminUuid, adminUuid, name, lastname, avatar, startedAt, finishedAt, cost, business }: {
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
