import { IsString, IsOptional, IsBoolean, IsEmail, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  password?: string;  

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: "roles must not be empty" })
  roles?: string[];

  @IsOptional()
  @IsArray()
  vehicles?: string[];
}
