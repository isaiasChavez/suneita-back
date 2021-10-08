import {
    Controller,
    Body,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Req,
    Res,
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
    InviteUserDTO,
    ConfirmUserPassword,
    UpdateUserDTO,
    UpdateUserAdminDTO,
    DeleteAdminUserDTO,
    DeleteUserDTO,
    FindUserChildrens,
    SimpleRequest,
    GetAdminDetailDTO,
    GetUserDetailDTO,
    ChangeName,
    UpdateGuestDTO,
    SetSesionAppId,
    CreatePublicationDTO,
} from "./user.dto";
import { validateOrReject } from "class-validator";
import { AddNewSuscriptionSuscriptionDTO, DeleteSuscriptionSuscriptionDTO } from "src/modules/suscription/suscription.dto";
import { ReuestSesionLogOutDTO } from "../sesion/sesion.dto";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {
    }

    @Post("invite")
    async create(@Body() inviteUserDTO: InviteUserDTO): Promise<any> {
        let newinviteUserDTO = new InviteUserDTO(inviteUserDTO)
        try {
            await validateOrReject(newinviteUserDTO);
            return await this.userService.invite(newinviteUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }

    @Post("playerid")
    async setSesionOfApp(@Body() setSesionAppId: SetSesionAppId): Promise<any> {
        let newsetSesionAppId = new SetSesionAppId(setSesionAppId)
        try {
            await validateOrReject(newsetSesionAppId);
            return await this.userService.setSesionOfApp(newsetSesionAppId);
        } catch (errors) {
            console.log('Caught promiseee rejection (validation failed)  please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }

    

    @Get('detail')
    async findUserDetail(@Req() request, @Res() response): Promise<any> {
        const requestDetailDTO = new SimpleRequest(request.body)
        try {
            await validateOrReject(requestDetailDTO);
            return await this.userService.findUserDetail(requestDetailDTO,response);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }
    @Get("/:udminUuid")
    async findAllUsers(@Param('udminUuid') udminUuid: number): Promise<any> {
        return await this.userService.findAllUsers(udminUuid);
    }
    @Post("childrens")
    async getUserChildrens(@Body() dto: SimpleRequest): Promise<any> {
        let findUserChildrens = new SimpleRequest(dto)

        try {
            await validateOrReject(findUserChildrens);
            return await this.userService.findUserChildrens(findUserChildrens);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }
    //Información de childrens
    @Post("userinfo")
    async getUserDetail(@Body() dto: GetUserDetailDTO): Promise<any> {
        try {
            let getUserDetailDTO = new GetUserDetailDTO(dto)
            await validateOrReject(getUserDetailDTO);
            return await this.userService.getUserDetail(getUserDetailDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }

    @Post("admininfo")
    async getAdminDetail(@Body() dto: GetAdminDetailDTO): Promise<any> {
        try {
            let getAdminDetailDTO = new GetAdminDetailDTO(dto)
            await validateOrReject(getAdminDetailDTO);
            return await this.userService.getAdminDetail(getAdminDetailDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }

    


    @Post("confirm")
    async confirmUserPassword(
        @Body() confirmUserPassword: ConfirmUserPassword
    ): Promise<any> {

        let newConfirmUserPassword = new ConfirmUserPassword(confirmUserPassword)
        try {
            await validateOrReject(newConfirmUserPassword);
            return await this.userService.confirmPassword(confirmUserPassword);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }



    
   
    @Put('addperiod')
    async addNewPeriod(@Body() addNewSuscription: AddNewSuscriptionSuscriptionDTO): Promise<any> {
        let newaddNewSuscription = new AddNewSuscriptionSuscriptionDTO(addNewSuscription)
        try {
            
            await validateOrReject(newaddNewSuscription);
            return await this.userService.addNewPeriod(newaddNewSuscription);

        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }
    @Put('deleteperiod')
    async deleteperiod(@Body() deleteSuscriptionSuscriptionDTO: DeleteSuscriptionSuscriptionDTO): Promise<any> {
        let newsimpleRequest = new DeleteSuscriptionSuscriptionDTO(deleteSuscriptionSuscriptionDTO)
        try {
            
            await validateOrReject(newsimpleRequest);
            return await this.userService.deleteperiod(newsimpleRequest);

        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }
    
    

    @Put('admin')
    async updateAdmin(@Body() updateUserAdminDTO: UpdateUserAdminDTO): Promise<any> {
        let newupdateUserDTO = new UpdateUserAdminDTO(updateUserAdminDTO)
        try {
            await validateOrReject(newupdateUserDTO);
            return await this.userService.updateAdmin(newupdateUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }
    @Put('guest')
    async updateGuest(@Body() updateGuestDTO: UpdateGuestDTO): Promise<any> {
        let newUpdateGuestDTO = new UpdateGuestDTO(updateGuestDTO)
        try {
            await validateOrReject(newUpdateGuestDTO);
            return await this.userService.updateGuest(newUpdateGuestDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }

    @Put()
    async updateUser(@Body() updateUserDTO: UpdateUserDTO): Promise<any> {
        let newupdateUserDTO = new UpdateUserDTO(updateUserDTO)
        try {
            await validateOrReject(newupdateUserDTO);
            return await this.userService.updateUser(newupdateUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }

    @Put()
    async createPublication(@Body() createPublicationDTO: CreatePublicationDTO): Promise<any> {
        let newcreatePublicationDTO = new CreatePublicationDTO(createPublicationDTO)
        try {
            await validateOrReject(newcreatePublicationDTO);
            return await this.userService.createPublication(newcreatePublicationDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }


    @Put("deleteuser")
    async deleteUser(@Body() deleteUserDTO: DeleteUserDTO): Promise<any> {
        let newdeleteUserDTO = new DeleteUserDTO(deleteUserDTO)
        try {
            await validateOrReject(newdeleteUserDTO);
            return await this.userService.deleteUser(newdeleteUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }


    @Put("deleteadmin")
    async deleteAdminUser(@Body() deleteAdminUserDTO: DeleteAdminUserDTO): Promise<any> {
        let newdeleteAdminUserDTO = new DeleteAdminUserDTO(deleteAdminUserDTO)
        try {
            await validateOrReject(newdeleteAdminUserDTO);
            return await this.userService.deleteUserAdmin(newdeleteAdminUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }
    @Put("suspendadmin")
    async suspendAdminUser(@Body() suspendAdminUserDTO: DeleteAdminUserDTO): Promise<any> {
        let newsuspendAdminUserDTO = new DeleteAdminUserDTO(suspendAdminUserDTO)
        try {
            await validateOrReject(newsuspendAdminUserDTO);
            return await this.userService.suspendUserAdmin(newsuspendAdminUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }
    @Put("suspenduser")
    async suspendUser(@Body() suspendUserDTO: DeleteUserDTO): Promise<any> {
        let newSuspendUserDTO = new DeleteUserDTO(suspendUserDTO)
        try {
            await validateOrReject(newSuspendUserDTO);
            return await this.userService.suspendUser(newSuspendUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed) please check your inputs. Errors: ', errors);
            return {
                errors
            }
        }
    }

    @Post('logout')
    async Logout(
      @Body() requestSesionLogOutDTO: ReuestSesionLogOutDTO,
    ): Promise<any> {
      console.log({requestSesionLogOutDTO})
      return await this.userService.RequesLogout(requestSesionLogOutDTO);
    }





}
