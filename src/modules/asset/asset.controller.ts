import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateAssetDTO, DeleteAssetDto } from './asset.dto';
import { AssetService } from './asset.service';

@Controller('asset')
export class AssetController {
    constructor(private assetService: AssetService) {

    }

    @Get(':uuid')
    async getAllAssetsByAdmin(@Param() uuid): Promise<any> {
        console.log({ uuid })
        try {
            if (uuid.uuid.length < 20) {
                console.log("no se puede")
                return {
                    status: 5
                }
            }
            return await this.assetService.getAllAssetsByAdmin(uuid);
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
