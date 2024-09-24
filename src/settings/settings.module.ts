import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from 'src/entities/vehicle.entity';
import { MaintenanceRecord, MaintenanceRecordSchema } from 'src/entities/maintenanceRecord.entity';
import { Package, PackageSchema } from 'src/entities/package.entity';
import { Company, CompanySchema } from 'src/entities/company.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService],
  imports: [
    AuthModule,
    // ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: MaintenanceRecord.name, schema: MaintenanceRecordSchema },
      { name: Package.name, schema: PackageSchema },
      { name: Company.name, schema: CompanySchema }
    ]),
  ]
})
export class SettingsModule {}
