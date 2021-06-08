import { Repository } from "typeorm";
import { User } from "./user.entity";
import { Token } from "../token/token.entity";
import { Type } from "../type/type.entity";
import { Role } from "../role/role.entity";
import { Sesion } from "../sesion/sesion.entity";
import { InviteUserDTO, CreateUserDTO, ConfirmUserPassword, PasswordRecovery, CreateSuperAdminDTO, UpdateUserDTO, CreateAdminDTO, UpdateUserAdminDTO, DeleteAdminUserDTO, DeleteUserDTO } from "./user.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { Roles, Types } from "src/types";
import { SuperAdmin } from "./superadmin.entity";
import { Admin } from "./admin.entity";
import { Suscription } from "src/modules/suscription/suscription.entity";
export declare class UserService {
    private readonly mailerService;
    private userRepository;
    private suscripctionRepository;
    private superAdminRepository;
    private adminRepository;
    private tokenRepository;
    private typeRepository;
    private roleRepository;
    private sesionRepository;
    private suscriptionRepository;
    constructor(mailerService: MailerService, userRepository: Repository<User>, suscripctionRepository: Repository<Suscription>, superAdminRepository: Repository<SuperAdmin>, adminRepository: Repository<Admin>, tokenRepository: Repository<Token>, typeRepository: Repository<Type>, roleRepository: Repository<Role>, sesionRepository: Repository<Sesion>, suscriptionRepository: Repository<Suscription>);
    roles: Roles;
    types: Types;
    invite(request: InviteUserDTO): Promise<any>;
    findAllUsers(uuid: number): Promise<any>;
    confirmPassword(requestDTO: ConfirmUserPassword): Promise<any>;
    findUserDetail(requestEmail: string): Promise<any>;
    createSuperAdmin(createSuperAdminDTO: CreateSuperAdminDTO): Promise<any>;
    createAdmin(createAdminDTO: CreateAdminDTO): Promise<any>;
    create(createUserDTO: CreateUserDTO): Promise<any>;
    updateAdminUser(updateUserAdminDTO: UpdateUserAdminDTO): Promise<any>;
    updateUser(updateUserDTO: UpdateUserDTO): Promise<any>;
    deleteUserAdmin(deleteAdminUserDTO: DeleteAdminUserDTO): Promise<any>;
    deleteUser(deleteUserDTO: DeleteUserDTO): Promise<any>;
    suspendUserAdmin(pauseAdminUserDTO: DeleteAdminUserDTO): Promise<any>;
    pauseUser(pauseUserDTO: DeleteUserDTO): Promise<any>;
    requestPasswordReset(requestEmail: string): Promise<any>;
    passwordRecovery(requestDTO: PasswordRecovery): Promise<any>;
}
