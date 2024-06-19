import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MaintenanceRecord } from './maintenanceRecord.entity';

@Schema()
export class Vehicle  {

  @Prop({ unique: true, required: true })
  plateNumber: string;

  @Prop({ required: true })
  model: string;

  @Prop()
  brand: string;

}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
