import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Project extends Document {
  declare _id: Types.ObjectId;
  declare createdAt: Date;
  declare updatedAt: Date;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['ARS', 'USD', 'EUR'] })
  currency: 'ARS' | 'USD' | 'EUR';

  @Prop({ required: true, enum: ['active', 'completed', 'on-hold', 'cancelled', 'pending'], default: 'active' })
  status: 'active' | 'completed' | 'on-hold' | 'cancelled' | 'pending';

  @Prop()
  deletedAt?: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project); 