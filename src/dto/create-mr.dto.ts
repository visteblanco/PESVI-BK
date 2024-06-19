import { IsArray, IsDate, IsEmail, IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';
import { Vehicle } from '../entities/vehicle.entity';
import { Type } from 'class-transformer';



export class CreateMrDto {

    @Type(() => Date)
    @IsDate()
    date: Date;

    @IsString()
    description: string;
    
    @IsMongoId()
    vehicle: string;
}
