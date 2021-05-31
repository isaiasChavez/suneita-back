import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { ReuestSesionDTO, UpdatePlayerID, ReuestSesionLogOutDTO } from './sesion.dto';
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




    @Post('logout')
    async Logout(@Body() requestSesionLogOutDTO: ReuestSesionLogOutDTO): Promise<any> {
        return await this.sesionService.RequesLogout(requestSesionLogOutDTO);
    }

}