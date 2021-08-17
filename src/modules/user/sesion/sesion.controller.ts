import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { SesionService } from './sesion.service';
import {
  CreateAdminDTO,
  CreateUserDTO,
  PasswordRecovery,
  ReuestSesionDTO,
  ReuestSesionLogOutDTO,
} from './sesion.dto';
import { validateOrReject } from 'class-validator';
@Controller('sesion')
export class SesionController {
  constructor (private sesionService: SesionService) { }
  @Post()
  async Login(@Body() reuestSesionDTO: ReuestSesionDTO): Promise<any> {
    console.log({ reuestSesionDTO });

    const newreuestSesionDTO = new ReuestSesionDTO(reuestSesionDTO);
    try {
      await validateOrReject(newreuestSesionDTO);
      console.log('Validado');
      return await this.sesionService.RequesLogin(reuestSesionDTO);
    } catch (errors) {
      console.log(
        'Caught promise rejection (validation failed). Errors: ',
        errors,
      );
      return {
        errors,
      };
    }
  }
  @Post('login')
  async LoginFromApp(@Body() reuestSesionDTO: ReuestSesionDTO): Promise<any> {
    const newreuestSesionDTO = new ReuestSesionDTO(reuestSesionDTO);
    try {
      await validateOrReject(newreuestSesionDTO);
      return await this.sesionService.RequesLoginFromApp(reuestSesionDTO);
    } catch (errors) {
      console.log(
        'Caught promise rejection (validation failed). Errors: ',
        errors,
      );
      return {
        errors,
      };
    }
  }


  @Post('validate/:token')
  async validating(@Param('token') token: string): Promise<any> {
    if (token.length<50) {
        return {
          status:5
        }
    }
    return await this.sesionService.validateIfExistToken(token);
  }

  @Put('recovery')
  async recoveryPassword(
    @Body() passwordRecovery: PasswordRecovery,
  ): Promise<any> {
    const newPasswordRecovery = new PasswordRecovery(passwordRecovery);
    try {
      await validateOrReject(newPasswordRecovery);
      return await this.sesionService.passwordRecovery(newPasswordRecovery);
    } catch (errors) {
      console.log(
        'Caught promise rejection (validation failed). Errors: ',
        errors,
      );
      return {
        errors,
      };
    }
  }
  @Put('requestreset/:email')
  async requestPasswordReset(@Param('email') email): Promise<any> {
    console.log("requestPasswordReset")
    return await this.sesionService.requestPasswordReset(email);
  }

  @Post('logout')
  async Logout(
    @Body() requestSesionLogOutDTO: ReuestSesionLogOutDTO,
  ): Promise<any> {
    console.log({requestSesionLogOutDTO})
    return await this.sesionService.RequesLogout(requestSesionLogOutDTO);
  }
  @Get('des/:email')
  async Decifring(@Param('email') email: string): Promise<any> {
    return await this.sesionService.decifreToken(email);
  }

  @Post("admin")
  async createAdmin(@Body() createAdminDTO: CreateAdminDTO): Promise<any> {
    let newcreateAdminDTO = new CreateAdminDTO(createAdminDTO)
    try {
      await validateOrReject(newcreateAdminDTO);
      return await this.sesionService.createAdmin(newcreateAdminDTO);
    } catch (errors) {
      console.log('Caught promise rejection (validation failed). Errors: ', errors);
      return {
        errors
      }
    }

  }
  @Post("user")
  async createUser(@Body() createUserDTO: CreateUserDTO): Promise<any> {
    let newCreateUserDTO = new CreateUserDTO(createUserDTO)
    try {
      await validateOrReject(newCreateUserDTO);
      // return await this.userService.createSuperAdmin(newcreateSuperAdminDTO);
      return await this.sesionService.createGuest(newCreateUserDTO);
    } catch (errors) {
      console.log('Caught promise rejection (validation failed). Errors: ', errors);
      return {
        errors
      }
    }
  }


}
