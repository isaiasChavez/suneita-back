import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, MaxLength } from "class-validator";
import { SimpleRequest } from "../user/user/user.dto";

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
export class AddNewSuscriptionSuscriptionDTO extends SimpleRequest {
    constructor({
      userUuid,
      adminUuid,
      superAdminUuid,
      type,
      invitations,
      cost,
      startedAt,
      finishedAt,
      typeToUpdate,
      adminUuidToUpdate,
    guestUuidToUpdate
    }) {
        super({adminUuid,
            userUuid,
            superAdminUuid,
            type}
            )
      this.invitations = parseInt(invitations);
      this.cost = parseFloat(cost);
      this.startedAt = startedAt;
      this.finishedAt = finishedAt;
      this.typeToUpdate = typeToUpdate;
      this.guestUuidToUpdate = guestUuidToUpdate
    this.adminUuidToUpdate = adminUuidToUpdate
    }
    @IsOptional()
    @IsNumber()
    invitations: number;
    @IsOptional()
    @IsNumber()
    @IsPositive()
    cost: number;
    @IsDateString()
    @IsString()
    @IsNotEmpty()
    startedAt: string;
    @IsString()
    @IsDateString()
    @IsNotEmpty()
    finishedAt: string;
    @IsNumber()
    @IsNotEmpty()
    typeToUpdate: number;

    @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  adminUuidToUpdate: string;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  guestUuidToUpdate: string;

  }





