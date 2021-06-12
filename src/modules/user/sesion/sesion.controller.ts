import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { PasswordRecovery, ReuestSesionDTO, ReuestSesionLogOutDTO } from './sesion.dto';
import { validateOrReject } from 'class-validator';

@Controller('sesion')
export class SesionController {

    constructor(private sesionService: SesionService) { }

    @Post()
    async Login(@Body() reuestSesionDTO: ReuestSesionDTO): Promise<any> {
        console.log({ reuestSesionDTO })
        let newreuestSesionDTO = new ReuestSesionDTO(reuestSesionDTO)
        try {
            await validateOrReject(newreuestSesionDTO);
            return await this.sesionService.RequesLogin(reuestSesionDTO);
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
            return await this.sesionService.passwordRecovery(newPasswordRecovery);
        } catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            }
        }
    }
    @Get("requestreset/:email")
    async requestPasswordReset(@Param("email") email): Promise<any> {
        return await this.sesionService.requestPasswordReset(email);
    }

    @Post('logout')
    async Logout(@Body() requestSesionLogOutDTO: ReuestSesionLogOutDTO): Promise<any> {
        return await this.sesionService.RequesLogout(requestSesionLogOutDTO);
    }
    @Post('des/:token')
    async Decifring(@Param("token") token: string): Promise<any> {
        return await this.sesionService.decifreToken(token);
    }

}