import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Vehicle } from './vehicle.entity';


@Schema()
export class MaintenanceRecord  {

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Vehicle;
}

export const MaintenanceRecordSchema = SchemaFactory.createForClass(MaintenanceRecord);
