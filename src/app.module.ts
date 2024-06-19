import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';


import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot( process.env.MONGO_URI,{dbName: process.env.MONGO_DB_NAME}  ),

    SettingsModule,
    AuthModule,


  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}
