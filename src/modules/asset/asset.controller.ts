import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { SimpleRequest } from '../user/user/user.dto';
import { CreateAssetDTO, DeleteAssetDto } from './asset.dto';
import { AssetService } from './asset.service';

@Controller('asset')
export class AssetController {
    constructor(private assetService: AssetService) {

    }

    @Get()
    async getAllAssetsByUser(@Body()getAssetDTO: SimpleRequest): Promise<any> {
        try {
            return await this.assetService.getAllAssetsByUser(getAssetDTO);
        } catch (error) {
            return error
        }
    }

    @Post()
    async create(@Body() createAssetDTO: CreateAssetDTO): Promise<any> {
        let newcreateAssetDTO = new CreateAssetDTO(createAssetDTO)
        try {
            await validateOrReject(newcreateAssetDTO);
            return await this.assetService.create(newcreateAssetDTO);

        } catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            }
        }

    }
    @Put()
    async delete(@Body() deleteAssetDTO: DeleteAssetDto): Promise<any> {
        let newdeleteAssetDTO = new DeleteAssetDto(deleteAssetDTO)
        try {
            await validateOrReject(newdeleteAssetDTO);
            return await this.assetService.delete(newdeleteAssetDTO);

        } catch (errors) {
            console.log('Caught promise rejection (validation failed). Errors: ', errors);
            return {
                errors
            }
        }

    }

}
