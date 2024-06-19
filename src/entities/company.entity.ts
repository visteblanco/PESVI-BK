import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Company extends Document {

  @Prop({ unique: true, required: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'Package' })
  package: Types.ObjectId;

}

export const CompanySchema = SchemaFactory.createForClass(Company);
