import { IsString } from 'class-validator';



export class CreateVehicleDto {

    @IsString()
    plateNumber: string;

    @IsString()
    model: string;
    
    @IsString()
    brand: string;
    
}
