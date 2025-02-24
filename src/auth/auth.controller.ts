import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginDto, UpdateAuthDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
//#region login
  @Post('/login')
  login( @Body() loginDto: LoginDto  ) {
    return this.authService.login( loginDto );
  }

  @Post('/register')
  register( @Body() registerDto: CreateUserDto  ) {
    return this.authService.register( registerDto );
  }

  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req: Request ): LoginResponse {
      
    const user = req['user'] as User;

    return {
      user,
      token: this.authService.getJwtToken({ id: user._id })
    }
  }
  //#endregion login
//#region users
  @Get('/users')
  findAll(  req: User ) {
    return this.authService.findAll();
  }

  @Get('/users/:id')
  async findUserByCompanyId(@Param('id')  id: string ) {
    return this.authService.findUserByCompanyId(id);
  }

  @Put('/update/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser({ ...updateUserDto, id: id });
  }
  @Delete('/delete/:id')
    async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.authService.deleteUser(id);
  }

//#endregion users
}
