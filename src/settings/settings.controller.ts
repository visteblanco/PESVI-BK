import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CreateVehicleDto } from 'src/dto/create-vehicle.dto';
import { CreateMrDto } from 'src/dto/create-mr.dto';
import { CreatePackageDto } from 'src/dto/create-package';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.settingsService.createVehicle(createVehicleDto);
  }

  @Post('registervehicle')
  registervehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.settingsService.createVehicle(createVehicleDto);
  }

  @Post('registermr')
  registerMr(@Body() createMrDto: CreateMrDto) {
    return this.settingsService.createMr(createMrDto);
  }

  @Post('registerpackage')
  registerPackage(@Body() createPackageDto: CreatePackageDto) {
    return this.settingsService.createPackage(createPackageDto);
  }

  // @Get()
  // findAll() {
  //   return this.settingsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.settingsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
  //   return this.settingsService.update(+id, updateSettingDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.settingsService.remove(+id);
  // }
}
