import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Req,
  UsePipes,
  Query,
  Put,
  Res,
  HttpStatus,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RegisterDTO } from 'src/Admin_Module/auth/dto/register.dto';
import { UserService } from 'src/Admin_Module/auth/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { ChangePasswordDTO } from 'src/Admin_Module/auth/dto/changePassword.dto';
import { User } from 'src/Admin_Module/interfaces/user.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
// import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('/onlyauth')
  @UseGuards(AuthGuard('jwt'))
  async hiddenInformation() {
    return 'hidden information';
  }
  @Get('/anyone')
  async publicInformation() {
    return 'this can be seen by anyone';
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerDTO: RegisterDTO) {
    const user = await this.userService.create(registerDTO);
    const payload = {
      email: user.email,
    };

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.userService.findByLogin(loginDTO);
    const payload = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
  @Get('logout')
  async logout() {
    return { message: 'Logout Successfully' };
  }

  @Put('/changepassword')
  @UsePipes(ValidationPipe)
  async changepassword(
    @Query('userID') userID,
    @Body() changePasswordDTO: ChangePasswordDTO,
  ) {
    return await this.userService.changePassword(userID, changePasswordDTO);
  }
  // upload image
  @Post('upload_image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtention = file.originalname.split('.')[1];
          const newFileName =
            name.split('').join('') + Date.now() + '.' + fileExtention;
          cb(null, newFileName);
        },
      }),
      // fileFilter: (req, file, cb) => {
      //   if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      //     return cb(null, false);
      //   }
      //   cb(null, true);
      // },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not an Image');
    } else {
      const response = {
        filePath: `http://localhost:9000/auth/uploads/${file.filename}`,
      };
      return response;
    }
  }

  // get image
  @Get('uploads/:filename')
  getProfileImage(@Param('filename') filename, @Res() res) {
    return res.sendFile(filename, { root: 'uploads' });
  }
}
