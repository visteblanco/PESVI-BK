import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vehicle extends Document {

  _id: string;

  @Prop({ required: true, unique: true })
  plate: string;

  @Prop({ required: true })
  vehicleModel: string;

  @Prop()
  brand: string;

  @Prop()
  year: number;

  @Prop()
  color: string;

  @Prop({ type: String, required: true })
  idCompany: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
