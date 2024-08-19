import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByGithubId(githubId: string) {
    // Find one user by GitHub ID and explicitly project _id if needed
    return this.userModel.findOne({ githubId }).select('+_id').exec();
  }

  async create(userData: {
    githubId: string;
    username: string;
    accessToken: string;
  }): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }
}
