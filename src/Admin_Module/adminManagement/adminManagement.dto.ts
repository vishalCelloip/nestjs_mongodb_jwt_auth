import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class AdminManagementDTO {
  name: string;
  @IsNotEmpty({ message: 'Email Required' })
  @IsString()
  email: string;
  @IsNotEmpty({ message: 'Password Required' })
  @IsString()
  @MinLength(8, { message: 'Password is too short (8 characters min)' })
  @MaxLength(20, { message: 'Password is too long (20 characters max)' })
  password: string;
  user_type: string;
  last_login: Date;
  updated_at: Date;
  created_at: Date;
}
