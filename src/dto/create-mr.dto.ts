import { IsDate, IsMongoId, IsString } from 'class-validator';
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
