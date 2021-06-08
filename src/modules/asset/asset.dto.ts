import { IsNotEmpty, IsNumber, isString, IsString, IsUUID } from "class-validator";

export class CreateAssetDTO {
    constructor({ adminUuid, url }) {
        this.adminUuid = adminUuid
        this.url = url
    }
    @IsUUID()
    @IsNotEmpty()
    @IsString()
    adminUuid: string;
    @IsNotEmpty()
    @IsString()
    url: string;
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
