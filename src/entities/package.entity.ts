import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema()
export class Package extends Document {
    @Prop({ required: true })
    dateStart: Date;

    @Prop({ required: true })
    dateEnd: Date;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  })
    owner: Types.ObjectId;

    @Prop({ required: true })
    name: string;
    
    @Prop({ required: false })
    maxCompanies: number;
    
    @Prop({ required: false })
    maxUsersPerCompany: number;
    
    @Prop({ required: false })
    maxVehiclesPerCompany: number;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
