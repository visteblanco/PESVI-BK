import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class CreateCompanyDto {
  
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  phone?: string;

  @IsOptional() 
  @IsString()
  logoUrl: string;

  @IsOptional() 
  @IsMongoId()
  package: string;
  
  @IsOptional() 
  @IsMongoId()
  idUser: string;

}
