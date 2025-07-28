import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClientChargeDocument = ClientCharge & Document;

@Schema({ timestamps: true })
export class ClientCharge {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ 
    required: true, 
    enum: ['ARS', 'USD', 'EUR']
  })
  currency: 'ARS' | 'USD' | 'EUR';

  @Prop({ required: true })
  date: Date;

  @Prop({ 
    required: true, 
    enum: ['cash', 'transfer', 'card', 'check', 'other']
  })
  paymentMethod: 'cash' | 'transfer' | 'card' | 'check' | 'other';

  @Prop()
  description?: string;

  @Prop()
  deletedAt?: Date;
}

export const ClientChargeSchema = SchemaFactory.createForClass(ClientCharge); 