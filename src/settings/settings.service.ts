import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Vehicle } from 'src/entities/vehicle.entity';
import { CreateVehicleDto } from 'src/dto/create-vehicle.dto';

import { MaintenanceRecord } from 'src/entities/maintenanceRecord.entity';
import { CreateMrDto } from 'src/dto/create-mr.dto';

import { CreatePackageDto } from '../dto/create-package';
import { Package } from 'src/entities/package.entity';
import { CreateCompanyDto } from 'src/dto/create-company.dto';
import { Company } from 'src/entities/company.entity';
import * as fs from 'fs';
import * as path from 'path';
import { AuthService } from '../auth/auth.service';
import { UpdateAuthDto } from 'src/auth/dto';
import { UpdateCompanyDto } from 'src/dto/update-comany.dto';

@Injectable()
export class SettingsService {
  private readonly uploadDir: string;
  
  constructor(
    @InjectModel( Vehicle.name ) 
    private userModelV: Model<Vehicle>,
    @InjectModel( MaintenanceRecord.name ) 
    private userModelMr: Model<MaintenanceRecord>,
    @InjectModel( Package.name ) 
    private packageModel: Model<Package>,
    @InjectModel( Company.name ) 
    private companyModel: Model<Company>,
    private authService: AuthService,
  ) {
    this.uploadDir = './uploads';
   }
  //#region Comapny
  async createCompany(createCompanyDto: CreateCompanyDto,file) {
    try {
      const ruta = `${this.uploadDir}/${createCompanyDto.name}`;
      if (!fs.existsSync(ruta)) {
        fs.mkdirSync(ruta, { recursive: true });
        console.log(`Carpeta creada: ${ruta}`);
      }
      // Genera un nombre único para el archivo
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(ruta, fileName);
      // Guarda el archivo en el servidor
      await fs.promises.writeFile(filePath, file.buffer);
      createCompanyDto = {
        ...createCompanyDto,
        logoUrl: fileName,
      };
      const {idUser, ...companyData } = createCompanyDto;
      const newCompany = new this.companyModel(createCompanyDto);
      await newCompany.save();
      let us = await this.authService.findUserById( idUser,true );
      us = {
        ...us,
        company: newCompany.id
      }
      const updateAuthDto: UpdateAuthDto = {
        _id: us._id,
        company: us.company.toString(), 
      };
      this.authService.updateUserID(updateAuthDto)
      return newCompany;
    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ CreateCompanyDto.name } already exists!`)
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }
  }
  async getCompanyById(id: string) {
    try {
      const company = await this.companyModel.findById(id).exec();
      if (!company) {
        throw new NotFoundException('Company not found');
      }
      return company;
    } catch (error) {
      throw new NotFoundException('Company not found');
    }
  }
  async updateCompany(updateCompanyDto: UpdateCompanyDto, file?: Express.Multer.File) {
    try {
      const existingCompany = await this.companyModel.findById(updateCompanyDto._id);
      if (!existingCompany) {
        throw new NotFoundException(`Company with ID ${updateCompanyDto._id} not found`);
      }

      if (file) {
        const ruta = `${this.uploadDir}/${existingCompany.name}`;
        if (!fs.existsSync(ruta)) {
          fs.mkdirSync(ruta, { recursive: true });
          console.log(`Carpeta creada: ${ruta}`);
        }
        // Genera un nombre único para el archivo
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(ruta, fileName);
        // Guarda el archivo en el servidor
        await fs.promises.writeFile(filePath, file.buffer);
        updateCompanyDto = {
          ...updateCompanyDto,
          logoUrl: fileName,
        };
        // Elimina el archivo anterior si existe
        if (existingCompany.logoUrl) {
          const oldFilePath = `${this.uploadDir}/${existingCompany.name}/${existingCompany.logoUrl}`;
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }

      const updatedCompany = await this.companyModel.findByIdAndUpdate(updateCompanyDto._id, updateCompanyDto, { new: true });
      if (!updatedCompany) {
        throw new NotFoundException(`Company with ID ${updateCompanyDto._id} could not be updated`);
      }

      // Si es necesario, actualiza la referencia de la empresa en el usuario
      if (updateCompanyDto.idUser) {
        let user = await this.authService.findUserById(updateCompanyDto.idUser, true);
        user = {
          ...user,
          company: updatedCompany.id,
        };
        const updateAuthDto: UpdateAuthDto = {
          _id: user._id,
          company: user.company.toString(),
        };
        this.authService.updateUserID(updateAuthDto);
      }

      return updatedCompany;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${updateCompanyDto.name} already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happened!!!');
    }
  }

  //#endregion 
  
  //#region Vehicle
  async createVehicle(createVehicleDto: CreateVehicleDto) : Promise<Vehicle> {
    try {
      const newVehicle = new this.userModelV(createVehicleDto);
      if (newVehicle.plateNumber) newVehicle.plateNumber = newVehicle.plateNumber.toUpperCase();
      await newVehicle.save();
      return newVehicle;
    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createVehicleDto.plateNumber } already exists!`)
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }
  }
  //#endregion

  //#region Package
  async createPackage(createPackageDto: CreatePackageDto) : Promise<Package> {
    try {
      const newPackage = new this.packageModel(createPackageDto);
      // if (newPackage.plateNumber) newPackage.plateNumber = newPackage.plateNumber.toUpperCase();
      await newPackage.save();
      return newPackage;
    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createPackageDto.name } already exists!`)
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }
  }
  //#endregion

  //#region Mr
  async createMr(createMrDto: CreateMrDto) : Promise<MaintenanceRecord> {
    try {
      const newMr = new this.userModelMr(createMrDto);
      await newMr.save();
      return newMr;
    } catch (error) {
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createMrDto.date } already exists!`)
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }
  }
  //#endregion

  //#region Package
  findAll() {
    return `This action returns all settings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
  //#endregion

}
