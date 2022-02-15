import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDTO {
  name: string;
  @IsNotEmpty({ message: 'Email Required' })
  @IsString()
  email: string;
  @IsNotEmpty({ message: 'Phone Required' })
  phone: string;
  user_type: string;
  @IsNotEmpty({ message: 'Password Required' })
  @IsString()
  @Matches(
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
    { message: 'Weak password' },
  )
  password: string;

  status: string;
}
