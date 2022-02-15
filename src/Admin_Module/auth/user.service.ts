import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Admin_Module/interfaces/user.interface';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from 'src/Admin_Module/auth/dto/login.dto';
import { Payload } from 'src/Admin_Module/interfaces/payload.interface';
import { ChangePasswordDTO } from 'src/Admin_Module/auth/dto/changePassword.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async create(RegisterDTO: RegisterDTO) {
    const { email } = RegisterDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(RegisterDTO);

    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }
  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async findByLogin(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await (await this.userModel.findOne({ email }))
      .$set({ last_login: Date.now() })
      .save();
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }
  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async changePassword(userID: string, changePasswordDTO: ChangePasswordDTO) {
    const password = await this.hashPassword(changePasswordDTO.password);
    const user = await this.userModel.findByIdAndUpdate(userID, { password });
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    } else {
      return user;
    }
  }
}
