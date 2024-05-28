import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto, UpdateAuthDto, LoginDto } from './dto';

import { User } from './entities/user.entity';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name ) 
    private userModel: Model<User>,

    private jwtService: JwtService,
  ) {}

  async register( registerDto: CreateUserDto ): Promise<LoginResponse> {

    const user = await this.create( registerDto );

    return {
      user: user,
      token: this.getJwtToken({ id: user._id })
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    try {
      
      const { password, ...userData } = createUserDto;
           
      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });

       await newUser.save();
       const { password:_, ...user } = newUser.toJSON();
       
       return user;
      
    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } already exists!`)
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }

  }

  async login( loginDto: LoginDto ):Promise<LoginResponse> {

    // Verificar si el email está presente antes de convertirlo a mayúsculas
    if (loginDto.email) loginDto.email = loginDto.email.toUpperCase();
    const { email, password } = loginDto;
    
    const user = await this.userModel.findOne({ email });
    if ( !user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    
    if ( !bcryptjs.compareSync( password, user.password ) ) {
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const { password:_, ...rest  } = user.toJSON();

      
    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    }
  
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( id: string,pas:boolean ) {
    const user = await this.userModel.findById( id );
    const { password, ...rest } = user.toJSON();
    if (pas)
      return user.toJSON();
    else
      return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async updateUser( updateUserDto: UpdateAuthDto): Promise<User> {
    // Aquí puedes implementar la lógica para actualizar el usuario en tu base de datos
    // Por ejemplo, podrías usar el método findOneAndUpdate() si estás utilizando MongoDB
    // O el método updateOne() si estás utilizando Mongoose
    const updatedUser = await this.updateUserID(updateUserDto);
  
    if (!updatedUser) {
      // Manejar el caso en el que no se encuentre ningún usuario con el ID proporcionado
      throw new NotFoundException('Usuario no encontrado');
    }
  
    return updatedUser;
  }
  
  async updateUserID(updateAuthDto: UpdateAuthDto): Promise<User> {
    
    try {
      
      
      const us = await this.findUserById( updateAuthDto._id,true );
      if ( !us ) throw new UnauthorizedException('User does not exists');
      if ( !us.isActive ) throw new UnauthorizedException('User is not active');

      // Verificar si el email está presente antes de convertirlo a mayúsculas
      if (updateAuthDto.email) updateAuthDto.email = updateAuthDto.email.toUpperCase();

      // Actualizar el usuario en la base de datos
      await this.userModel.updateOne({ _id: updateAuthDto._id }, updateAuthDto);
      
      // Volver a buscar el usuario actualizado en la base de datos
      const updatedUser = await this.findUserById(updateAuthDto._id, true);
      
      // Crear un nuevo objeto userDoc con el usuario actualizado
      const userDoc = new this.userModel(updatedUser);
      
      // Retornar los datos del usuario actualizados sin la contraseña
      const { password, ...userDataWithoutPassword } = userDoc.toJSON();
      return userDataWithoutPassword;
      
    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ updateAuthDto.email } already exists!`)
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }

  }


  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
