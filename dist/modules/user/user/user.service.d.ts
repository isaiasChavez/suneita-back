import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Token } from '../token/token.entity';
import { Type } from '../type/type.entity';
import { Role } from '../role/role.entity';
import { Sesion } from '../sesion/sesion.entity';
import { InviteUserDTO, ConfirmUserPassword, CreateSuperAdminDTO, UpdateUserDTO, UpdateUserAdminDTO, DeleteAdminUserDTO, DeleteUserDTO, SimpleRequest, GetAdminDetailDTO, GetUserDetailDTO, UpdateGuestDTO, SetSesionAppId } from './user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Roles, Types, TypesNumbers, Statuses } from 'src/types';
import { SuperAdmin } from './superadmin.entity';
import { Admin } from './admin.entity';
import { Suscription } from 'src/modules/suscription/suscription.entity';
import { AddNewSuscriptionSuscriptionDTO, DeleteSuscriptionSuscriptionDTO } from 'src/modules/suscription/suscription.dto';
import { Asset } from 'src/modules/asset/asset.entity';
import { Invitation } from '../invitation/invitation.entity';
import { SuscriptionService } from 'src/modules/suscription/suscription.service';
import { ReuestSesionLogOutDTO } from '../sesion/sesion.dto';
import { Status } from '../status/status.entity';
export declare class UserService {
    private readonly mailerService;
    private readonly suscriptionService;
    private userRepository;
    private suscripctionRepository;
    private superAdminRepository;
    private adminRepository;
    private tokenRepository;
    private assetRepository;
    private typeRepository;
    private roleRepository;
    private statusRepository;
    private invitationRepository;
    private sesionRepository;
    private suscriptionRepository;
    constructor(mailerService: MailerService, suscriptionService: SuscriptionService, userRepository: Repository<User>, suscripctionRepository: Repository<Suscription>, superAdminRepository: Repository<SuperAdmin>, adminRepository: Repository<Admin>, tokenRepository: Repository<Token>, assetRepository: Repository<Asset>, typeRepository: Repository<Type>, roleRepository: Repository<Role>, statusRepository: Repository<Status>, invitationRepository: Repository<Invitation>, sesionRepository: Repository<Sesion>, suscriptionRepository: Repository<Suscription>);
    roles: Roles;
    types: Types;
    statusNumbers: Statuses;
    typesNumbers: TypesNumbers;
    invite(request: InviteUserDTO): Promise<any>;
    findAllUsers(uuid: number): Promise<any>;
    setSesionOfApp(requestDTO: SetSesionAppId): Promise<any>;
    confirmPassword(requestDTO: ConfirmUserPassword): Promise<any>;
    findUserDetail(requestDetailDTO: SimpleRequest, res: any): Promise<any>;
    getAdminDetail(getAdminDetailDTO: GetAdminDetailDTO): Promise<any>;
    getUserDetail(getUserDetailDTO: GetUserDetailDTO): Promise<any>;
    findUserChildrens(findUserChildrensDTO: SimpleRequest): Promise<any>;
    clearSuscriptionsExpired(): Promise<any>;
    createSuperAdmin(createSuperAdminDTO: CreateSuperAdminDTO): Promise<any>;
    updateGuest(updateGuestDTO: UpdateGuestDTO): Promise<any>;
    updateAdmin(updateUserAdminDTO: UpdateUserAdminDTO): Promise<any>;
    addNewPeriod(addNewSuscription: AddNewSuscriptionSuscriptionDTO): Promise<any>;
    deleteperiod(request: DeleteSuscriptionSuscriptionDTO): Promise<{
        status: number;
        msg: string;
    }>;
    getWhoIsRequesting(request: SimpleRequest): Promise<{
        isAdmin: boolean;
        isSuperAdmin: boolean;
        isGuest: boolean;
        user: SuperAdmin | Admin | User;
    }>;
    updateUser(updateUserDTO: UpdateUserDTO): Promise<any>;
    getTypeAndUser(type: number, adminUuid: string, superAdminUuid: string): Promise<any>;
    deleteUserAdmin(deleteAdminUserDTO: DeleteAdminUserDTO): Promise<any>;
    deleteUser(deleteUserDTO: DeleteUserDTO): Promise<any>;
    updateArrayUsers(users: User[], statusUser: {
        isActive: boolean;
        isDeleted: boolean;
    }, statusSuscription: {
        isActive: boolean;
        isDeleted: boolean;
    }, statusAsset: {
        isActive: boolean;
        isDeleted: boolean;
    }): Promise<any>;
    suspendUserAdmin(pauseAdminUserDTO: DeleteAdminUserDTO): Promise<any>;
    suspendUser(pauseUserDTO: DeleteUserDTO): Promise<any>;
    RequesLogout(reuestSesionLogOutDTO: ReuestSesionLogOutDTO): Promise<any>;
}
