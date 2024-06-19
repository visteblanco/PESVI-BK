import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Vehicle } from './vehicle.entity';

@Schema()
export class User {

    _id?: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ minlength: 6, required: true })
    password?: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
    company: mongoose.Schema.Types.ObjectId;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Vehicle' })
    vehicles: Vehicle[];

    @Prop({ type: String })
    activeDevice: string;

}


export const UserSchema = SchemaFactory.createForClass( User );
