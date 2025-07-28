import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/interfaces/user.interface';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();
    return this.mapToDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? this.mapToDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this.mapToDomain(user) : null;
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .exec();
    return updatedUser ? this.mapToDomain(updatedUser) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  private mapToDomain(userDocument: UserDocument): User {
    return {
      id: userDocument._id.toString(),
      email: userDocument.email,
      password: userDocument.password,
      role: userDocument.role,
      createdAt: userDocument.createdAt,
      updatedAt: userDocument.updatedAt,
    };
  }
} 