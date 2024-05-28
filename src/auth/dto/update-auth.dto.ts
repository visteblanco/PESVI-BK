import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateUserDto) {
    @IsString()
    _id?: string;
}
