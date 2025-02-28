import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MinLength, ArrayNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @MinLength(6)
  password: string;

  @IsArray()
  @ArrayNotEmpty({ message: "roles must not be empty" })
  roles: string[];

  @Transform(({ value }) => value === 'true' || value === true) 
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value) 
  company?: string;
}
