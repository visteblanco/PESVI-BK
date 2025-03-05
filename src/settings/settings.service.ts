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
import { Types } from 'mongoose';

@Injectable()
export class SettingsService {
  private readonly uploadDir: string;
  
  constructor(
    @InjectModel( Vehicle.name ) 
    private vehicleModel: Model<Vehicle>,
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
  async createVehicle(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    try {
        createVehicleDto.plate = createVehicleDto.plate.toUpperCase(); 

        const existingVehicle = await this.vehicleModel.findOne({ plate: createVehicleDto.plate });
        if (existingVehicle) {
            throw new BadRequestException(`Plate ${createVehicleDto.plate} already exists!`);
        }

        const newVehicle = new this.vehicleModel(createVehicleDto);
        await newVehicle.save();
        return newVehicle;
    } catch (error) {
        if (error.status  === 400) {
            throw new BadRequestException(`Plate ${createVehicleDto.plate} already exists!`);
        }
        throw new InternalServerErrorException('An unexpected error occurred while creating the vehicle.');
    }
  }

  async getVehiclesByCompanyId(idCompany: string): Promise<Vehicle[]> {
    try {
      const vehicles = await this.vehicleModel.find({ idCompany }).lean();
      if (!vehicles || vehicles.length === 0) {
        throw new NotFoundException(`No vehicles found for company ID: ${idCompany}`);
      }
      return vehicles;
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while fetching the vehicles.');
    }
  }
  
  async updateVehicle(id: string, updateVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      const objectId = new Types.ObjectId(id);   
      const replacedVehicle = await this.vehicleModel.findOneAndReplace(
        { _id: objectId }, 
        updateVehicleDto, 
        { new: true }
      );
      if (!replacedVehicle) {
        throw new NotFoundException(`Vehicle with ID ${id} not found.`);
      }
      return replacedVehicle;
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
      throw new InternalServerErrorException('An error occurred while replacing the vehicle.');
    }
  }
  
  async deteleVehicle(id:string):Promise<{ message: string }>{    
    const deletedUser = await this.vehicleModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return { message: 'Vehicle deleted successfully'};
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
