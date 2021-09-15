export declare const newIdSession: (id: string) => string;
declare type NewInvitation = {
    token: string;
    invitations: number;
    start: string;
    finish: string;
    cost: number;
};
export declare const newInvitationTemplate: (newInvitation: NewInvitation) => string;
export declare const newResetPassTemplate: (token: string) => string;
export declare const newInfoLanding: () => string;
export {};
