import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    required: true, 
    enum: ['admin', 'user'],
    default: 'user'
  })
  role: 'admin' | 'user';
}

export const UserSchema = SchemaFactory.createForClass(User); 