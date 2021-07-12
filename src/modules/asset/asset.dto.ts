import { IsNotEmpty, IsNumber, IsOptional, isString, IsString, IsUrl, isURL, IsUUID, MinLength } from "class-validator";



export class GetAssetDTO {
    constructor({ adminUuid,userUuid, type }) {
        this.adminUuid = adminUuid
        this.userUuid = userUuid
        this.type = type
    }
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    userUuid: string;
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    adminUuid: string;
    @IsNotEmpty()
    @IsString()
    type: number;
}


export class CreateAssetDTO {
    constructor({ adminUuid,userUuid, url,type,typeAsset }) {
        this.adminUuid = adminUuid
        this.userUuid = userUuid
        this.url = url
        this.type = type
        this.typeAsset = typeAsset

    }
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    
    userUuid: string;
    @IsUUID()
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    adminUuid: string;
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    url: string;

    @IsNotEmpty()
    @IsNumber()
    typeAsset: number;
    @IsNotEmpty()
    @IsNumber()
    type: number;
}

export class DeleteAssetDto {
    constructor({ adminUuid, uuid }) {
        this.adminUuid = adminUuid
        this.uuid = uuid
    }
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    adminUuid: string;
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    uuid: string;

}
