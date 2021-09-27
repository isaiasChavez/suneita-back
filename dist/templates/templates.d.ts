export declare const newIdSession: () => string;
declare type NewInvitation = {
    token: string;
    invitations: number;
    start: string;
    finish: string;
    cost: number;
};
export declare const newInvitationTemplate: (newInvitation: NewInvitation) => string;
declare type NewInvitationGuest = {
    token: string;
};
export declare const newInvitationGuestTemplate: (newInvitation: NewInvitationGuest) => string;
export declare const newResetPassTemplate: (token: string) => string;
export declare const newInfoLanding: ({ name, company, email, phone }: {
    name: string;
    company: string;
    email: string;
    phone: string;
}) => string;
export {};
