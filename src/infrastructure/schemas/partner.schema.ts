import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PartnerDocument = Partner & Document;

@Schema({ timestamps: true })
export class Partner {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  number: string;

  @Prop({ 
    required: true, 
    enum: ['owner', 'collaborator']
  })
  partnerRole: 'owner' | 'collaborator';

    @Prop({
    required: true,
    enum: ['developer', 'designer', 'manager', 'rrhh', 'accountant', 'marketing', 'sales', 'other']
  })
  pistechRole: 'developer' | 'designer' | 'manager' | 'rrhh' | 'accountant' | 'marketing' | 'sales' | 'other';

  @Prop()
  deletedAt?: Date;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner); 