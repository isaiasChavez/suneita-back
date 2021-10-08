import { Roles, Types, TypesNumbers, Statuses } from 'src/types';
export declare class UserService {
    constructor();
    roles: Roles;
    types: Types;
    statusNumbers: Statuses;
    typesNumbers: TypesNumbers;
    createProduct(uuid: number): Promise<any>;
}
