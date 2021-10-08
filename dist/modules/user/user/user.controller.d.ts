import { UserService } from "./user.service";
import { InviteUserDTO, ConfirmUserPassword, UpdateUserDTO, UpdateUserAdminDTO, DeleteAdminUserDTO, DeleteUserDTO, SimpleRequest, GetAdminDetailDTO, GetUserDetailDTO, ChangeName, UpdateGuestDTO, SetSesionAppId, CreatePublicationDTO } from "./user.dto";
import { AddNewSuscriptionSuscriptionDTO } from "src/modules/suscription/suscription.dto";
import { ReuestSesionLogOutDTO } from "../sesion/sesion.dto";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    create(inviteUserDTO: InviteUserDTO): Promise<any>;
    setSesionOfApp(setSesionAppId: SetSesionAppId): Promise<any>;
    findUserDetail(request: any, response: any): Promise<any>;
    findAllUsers(udminUuid: number): Promise<any>;
    getUserChildrens(dto: SimpleRequest): Promise<any>;
    getUserDetail(dto: GetUserDetailDTO): Promise<any>;
    getAdminDetail(dto: GetAdminDetailDTO): Promise<any>;
    confirmUserPassword(confirmUserPassword: ConfirmUserPassword): Promise<any>;
    addNewPeriod(addNewSuscription: AddNewSuscriptionSuscriptionDTO): Promise<any>;
    updateAdmin(updateUserAdminDTO: UpdateUserAdminDTO): Promise<any>;
    updateGuest(updateGuestDTO: UpdateGuestDTO): Promise<any>;
    updateName(changeName: ChangeName): Promise<any>;
    updateUser(updateUserDTO: UpdateUserDTO): Promise<any>;
    createPublication(createPublicationDTO: CreatePublicationDTO): Promise<any>;
    deleteUser(deleteUserDTO: DeleteUserDTO): Promise<any>;
    deleteAdminUser(deleteAdminUserDTO: DeleteAdminUserDTO): Promise<any>;
    suspendAdminUser(suspendAdminUserDTO: DeleteAdminUserDTO): Promise<any>;
    suspendUser(suspendUserDTO: DeleteUserDTO): Promise<any>;
    Logout(requestSesionLogOutDTO: ReuestSesionLogOutDTO): Promise<any>;
}
