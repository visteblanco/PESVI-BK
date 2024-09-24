import { Controller, Get, Post, Body,  Param,  UseInterceptors, UploadedFile, NotFoundException, Res, Header } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateVehicleDto } from 'src/dto/create-vehicle.dto';
import { CreateMrDto } from 'src/dto/create-mr.dto';
import { CreatePackageDto } from 'src/dto/create-package';
import { CreateCompanyDto } from 'src/dto/create-company.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as mime from 'mime-types';
import { UpdateCompanyDto } from 'src/dto/update-comany.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}
  // @UseInterceptors(
  //   FileInterceptor(
  //     'logo',
  //     {
  //       storage : diskStorage({
  //           destination : './uploads',
  //           filename : (req, file, cb) => {
  //             cb(null, file.originalname.split('.')[0] + '_' + Date.now() + '.pdf');
  //           }
  //       })
  //     }
  //   )
  // )
  //#region comapny
  @Post('registercompany')
  @UseInterceptors(FileInterceptor('logo'))
  registerCompany(@UploadedFile() file, @Body() createCompanyDto: CreateCompanyDto) {
    return this.settingsService.createCompany(createCompanyDto, file);
  }
  @Post('updatecompany')
  @UseInterceptors(FileInterceptor('logo'))
  updateCompany(@UploadedFile() file, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.settingsService.updateCompany(updateCompanyDto, file);
  }
  @Get('getcompany/:id/logo')
  async getCompanyLogo(@Param('id') id: string, @Res() res: Response) {
    const uploadDir = './uploads';
    const company = await this.settingsService.getCompanyById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const ruta = `${uploadDir}/${company.name}/${company.logoUrl}`;

    // Verificar si el archivo existe
    if (!fs.existsSync(ruta)) {
      throw new NotFoundException('Logo file not found');
    }

    const logoFile = fs.readFileSync(ruta);
    const logoMimeType = mime.lookup(ruta) || 'application/octet-stream';

    // Configurar respuesta de la imagen
    res.setHeader('Content-Type', logoMimeType);
    res.send(logoFile);
  }

  @Get('getcompany/:id')
  async getCompany(@Param('id') id: string) {
    return this.settingsService.getCompanyById(id);
  }
  //#endregion
  
  //#region Vehicle

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.settingsService.createVehicle(createVehicleDto);
  }

  @Post('registervehicle')
  registervehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.settingsService.createVehicle(createVehicleDto);
  }
  
  //#endregion

  //#region MR

  @Post('registermr')
  registerMr(@Body() createMrDto: CreateMrDto) {
    return this.settingsService.createMr(createMrDto);
  }
  //#endregion

  //#region Package
  @Post('registerpackage')
  registerPackage(@Body() createPackageDto: CreatePackageDto) {
    return this.settingsService.createPackage(createPackageDto);
  }
  //#endregion

}
