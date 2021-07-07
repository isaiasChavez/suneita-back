export declare class InvitationAdminDTO {
    constructor({ company, email, invitations, cost, startedAt, finishedAt }: {
        company: any;
        email: any;
        invitations: any;
        cost: any;
        startedAt: any;
        finishedAt: any;
    });
    company: string;
    email: string;
    invitations: number;
    cost: number;
    startedAt: string;
    finishedAt: string;
    type: number;
}
export declare class InvitationUserDTO {
    constructor({ name, email, cost, startedAt, finishedAt }: {
        name: any;
        email: any;
        cost: any;
        startedAt: any;
        finishedAt: any;
    });
    name: string;
    email: string;
    invitations: number;
    cost: number;
    startedAt: string;
    finishedAt: string;
    type: number;
}
