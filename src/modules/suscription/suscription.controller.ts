import { Body, Controller, Post, Put } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { UpdateSuscriptionDTO } from './suscription.dto';
import { SuscriptionService } from './suscription.service';

@Controller('suscription')
export class SuscriptionController {
    // constructor(private suscriptionService: SuscriptionService) {

    // }
    // @Put("")
    // async create(@Body() updateSuscriptionDTO: UpdateSuscriptionDTO): Promise<any> {
    //     let newupdateSuscriptionDTO = new UpdateSuscriptionDTO(updateSuscriptionDTO)
    //     try {
    //         await validateOrReject(newupdateSuscriptionDTO);
    //         return await this.suscriptionService.update(newupdateSuscriptionDTO);
    //     } catch (errors) {
    //         console.log('Caught promise rejection (validation failed). Errors: ', errors);
    //         return {
    //             errors
    //         }
    //     }
    // }



}
