import { IsDate, IsInt, IsMongoId, IsString } from 'class-validator';
import { Type } from 'class-transformer';


export class CreatePackageDto {
    @Type(() => Date)
    @IsDate()
    dateStart: Date;

    @Type(() => Date)
    @IsDate()
    dateEnd: Date;

    @IsMongoId()
    owner: string;

    @IsString()
    name: string;

    @IsInt()
    @Type(() => Number)
    maxCompanies: number;
    
    @IsInt()
    @Type(() => Number)
    maxUsersPerCompany: number;

    @IsInt()
    @Type(() => Number)
    maxVehiclesPerCompany: number;
}
