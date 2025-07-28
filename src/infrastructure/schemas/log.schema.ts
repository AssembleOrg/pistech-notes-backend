import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Log {
  _id: Types.ObjectId;
  createdAt: Date;

  @Prop({ required: true })
  userId: string;

  @Prop({ 
    required: true, 
    enum: ['CREATE', 'UPDATE', 'DELETE']
  })
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @Prop({ 
    required: true, 
    enum: ['Note', 'Project', 'ClientCharge', 'PartnerPayment', 'Partner', 'User']
  })
  entityType: 'Note' | 'Project' | 'ClientCharge' | 'PartnerPayment' | 'Partner' | 'User';

  @Prop({ required: true })
  entityId: string;

  @Prop({ type: Object })
  oldData?: any;

  @Prop({ type: Object })
  newData?: any;

  @Prop({ type: [String] })
  changes?: string[];

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;
}

export const LogSchema = SchemaFactory.createForClass(Log); 