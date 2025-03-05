import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateVehicleDto {
  
  @IsOptional()
  @IsString()
  _id?: string;
  
  @IsString()
  plate: string;  

  @IsString()
  vehicleModel: string;  

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsString()
  idCompany: string; 
}
