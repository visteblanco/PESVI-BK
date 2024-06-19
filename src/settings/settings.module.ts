import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from 'src/entities/vehicle.entity';
import { MaintenanceRecord, MaintenanceRecordSchema } from 'src/entities/maintenanceRecord.entity';
import { Package, PackageSchema } from 'src/entities/package.entity';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [
    // ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: MaintenanceRecord.name, schema: MaintenanceRecordSchema },
      { name: Package.name, schema: PackageSchema },
    ]),
  ]
})
export class SettingsModule {}
