import {
    Controller,
    Body,
    Get,
    Post,
    Put,
    Delete,
    Param,
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
    InviteUserDTO,
    CreateUserDTO,
    ConfirmUserPassword,
    PasswordRecovery,
    CreateSuperAdminDTO,
    UpdateUserDTO,
    UpdateUserAdminDTO,
    DeleteAdminUserDTO,
    DeleteUserDTO,
    CreateAdminDTO
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
            await validateOrReject(newinviteUserDTO);
            return await this.userService.invite(newinviteUserDTO);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            }
        }
    }

    @Get()
    async findAllUsers(): Promise<any> {
        return await this.userService.findAll();
    }
    @Get(":email")
    async findUserDetail(@Param("email") email): Promise<any> {
        return await this.userService.findUserDetail(email);
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

    @Get("requestreset/:email")
    async requestPasswordReset(@Param("email") email): Promise<any> {
        return await this.userService.requestPasswordReset(email);
    }

    @Post()
    async createUser(@Body() createUserDTO: CreateUserDTO): Promise<any> {
        let newCreateUserDTO = new CreateUserDTO(createUserDTO)
        try {
            await validateOrReject(newCreateUserDTO);
            // return await this.userService.createSuperAdmin(newcreateSuperAdminDTO);
            return await this.userService.create(newCreateUserDTO);
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
    @Post("admin")
    async createAdmin(@Body() createAdminDTO: CreateAdminDTO): Promise<any> {
        let newcreateAdminDTO = new CreateAdminDTO(createAdminDTO)
        try {
            await validateOrReject(newcreateAdminDTO);
            return await this.userService.createAdmin(newcreateAdminDTO);
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



    @Put("deleteuser/:email")
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


    @Put("deleteadmin/:email")
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

    @Put("recovery")
    async recoveryPassword(
        @Body() passwordRecovery: PasswordRecovery
    ): Promise<any> {

        let newPasswordRecovery = new PasswordRecovery(passwordRecovery)
        try {
            await validateOrReject(newPasswordRecovery);
            return await this.userService.passwordRecovery(newPasswordRecovery);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            }
        }
    }




}
