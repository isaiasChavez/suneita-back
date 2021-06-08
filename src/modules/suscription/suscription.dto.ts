import { IsDateString, IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateSuscriptionDTO {
    constructor({ adminUuid, startedAt, finishedAt, cost, business }) {
        this.adminUuid = adminUuid
        this.startedAt = startedAt
        this.finishedAt = finishedAt
        this.cost = cost
        this.business = business
    }

    @IsUUID()
    @IsNotEmpty()
    @IsString()
    adminUuid: string;
    @IsDateString()
    @IsString()
    startedAt: string;
    @IsString()
    @IsDateString()
    finishedAt: string;
    @IsNumber()
    cost: number;
    @IsString()
    @MaxLength(200)
    business: string;

}
