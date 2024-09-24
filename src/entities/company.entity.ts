import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Company extends Document {

  _id?: string;
  
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false })
  logoUrl: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Package' })
  package: Types.ObjectId;

}

export const CompanySchema = SchemaFactory.createForClass(Company);
