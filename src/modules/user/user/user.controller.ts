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
    CreateSuperAdminDTO,
    UpdateUserDTO,
    UpdateUserAdminDTO,
    DeleteAdminUserDTO,
    DeleteUserDTO,
    FindUserChildrens,
    SimpleRequest,
} from "./user.dto";
import { validateOrReject } from "class-validator";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {
    }

    @Post("invite")
    async create(@Body() inviteUserDTO: InviteUserDTO): Promise<any> {
        let newinviteUserDTO = new InviteUserDTO(inviteUserDTO)
        try {
            console.log("inviteUser:", { inviteUserDTO })
            await validateOrReject(newinviteUserDTO);
            return await this.userService.invite(newinviteUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
    async getUserChildrens(@Body() findUserChildrens: FindUserChildrens): Promise<any> {
        console.log("--->",{findUserChildrens})
        return await this.userService.findUserChildrens(findUserChildrens);
    }

    


    @Post("confirm")
    async confirmUserPassword(
        @Body() confirmUserPassword: ConfirmUserPassword
    ): Promise<any> {

        let newConfirmUserPassword = new ConfirmUserPassword(confirmUserPassword)
        try {
            await validateOrReject(newConfirmUserPassword);
            // return await this.userService.createSuperAdmin(newcreateSuperAdminDTO);
            return await this.userService.confirmPassword(confirmUserPassword);
            // return await this.userService.create(newCreateUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            }
        }
    }



    @Post("superadmin")
    async createSuperAdmin(@Body() createSuperAdminDTO: CreateSuperAdminDTO): Promise<any> {
        let newcreateSuperAdminDTO = new CreateSuperAdminDTO(createSuperAdminDTO)
        try {
            await validateOrReject(newcreateSuperAdminDTO);
            return await this.userService.createSuperAdmin(newcreateSuperAdminDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            }
        }

    }
   

    @Put('admin')
    async updateAdminUser(@Body() updateUserAdminDTO: UpdateUserAdminDTO): Promise<any> {
        let newupdateUserDTO = new UpdateUserAdminDTO(updateUserAdminDTO)
        try {
            await validateOrReject(newupdateUserDTO);
            return await this.userService.updateAdminUser(newupdateUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
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
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            }
        }
    }






}
