import { UserService } from "./user.service";
import { InviteUserDTO, CreateUserDTO, ConfirmUserPassword, CreateSuperAdminDTO, UpdateUserDTO, UpdateUserAdminDTO, DeleteAdminUserDTO, DeleteUserDTO, CreateAdminDTO } from "./user.dto";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    create(inviteUserDTO: InviteUserDTO): Promise<any>;
    findAllUsers(udminUuid: number): Promise<any>;
    findUserDetail(email: any): Promise<any>;
    confirmUserPassword(confirmUserPassword: ConfirmUserPassword): Promise<any>;
    createSuperAdmin(createSuperAdminDTO: CreateSuperAdminDTO): Promise<any>;
    createAdmin(createAdminDTO: CreateAdminDTO): Promise<any>;
    createUser(createUserDTO: CreateUserDTO): Promise<any>;
    updateAdminUser(updateUserAdminDTO: UpdateUserAdminDTO): Promise<any>;
    updateUser(updateUserDTO: UpdateUserDTO): Promise<any>;
    deleteUser(deleteUserDTO: DeleteUserDTO): Promise<any>;
    deleteAdminUser(deleteAdminUserDTO: DeleteAdminUserDTO): Promise<any>;
    suspendAdminUser(suspendAdminUserDTO: DeleteAdminUserDTO): Promise<any>;
}
