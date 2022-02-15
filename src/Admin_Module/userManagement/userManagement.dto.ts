import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class UserManagementDTO {
  name: string;
  @IsNotEmpty({ message: 'Email Required' })
  @IsString()
  email: string;
  @IsNotEmpty({ message: 'Password Required' })
  @IsString()
  @MinLength(8, { message: 'Password is too short (8 characters min)' })
  @MaxLength(20, { message: 'Password is too long (20 characters max)' })
  password: string;
  company_name: string;
  PIC_fullname: string;
  PIC_phone: string;
  last_login: Date;
  updated_at: Date;
  created_at: Date;
  user_type: string;
}
