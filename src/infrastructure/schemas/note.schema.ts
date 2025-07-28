import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop()
  deletedAt?: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note); 