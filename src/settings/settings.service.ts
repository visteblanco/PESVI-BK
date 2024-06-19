import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Vehicle } from 'src/entities/vehicle.entity';
import { CreateVehicleDto } from 'src/dto/create-vehicle.dto';

import { MaintenanceRecord } from 'src/entities/maintenanceRecord.entity';
import { CreateMrDto } from 'src/dto/create-mr.dto';

import { CreatePackageDto } from '../dto/create-package';
import { Package } from 'src/entities/package.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel( Vehicle.name ) 
    private userModelV: Model<Vehicle>,
    @InjectModel( MaintenanceRecord.name ) 
    private userModelMr: Model<MaintenanceRecord>,
    @InjectModel( Package.name ) 
    private packageModel: Model<Package>,
  ) {}
  
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
