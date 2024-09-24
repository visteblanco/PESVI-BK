import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';



export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;
    
    @IsString()
    roles: string;
    
    @IsString()
    @IsOptional() 
    company: string;

    setEmail(email: string) {
        this.email = email.toUpperCase();
    }
}
