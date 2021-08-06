import { IsNotEmpty, IsNumber, IsOptional, isString, IsString, IsUrl, isURL, IsUUID, MinLength } from "class-validator";
import { SimpleRequest } from "../user/user/user.dto";





export class CreateAssetDTO extends SimpleRequest {
    constructor({ adminUuid,
        superAdminUuid,
        userUuid,
        type,url,typeAsset }) {
        super({adminUuid,
            superAdminUuid,
            userUuid,
            type})
        this.url = url
        this.typeAsset = typeAsset

    }
   
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    url: string;
    @IsNotEmpty()
    @IsNumber()
    typeAsset: number;
  
}

export class DeleteAssetDto extends SimpleRequest {
    constructor({ adminUuid,
        superAdminUuid,
        userUuid,
        type, uuid }) {
        super({adminUuid,
            superAdminUuid,
            userUuid,
            type,})
        this.uuid = uuid
    }
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    uuid: string;

}
