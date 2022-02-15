import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  company_name: string;
  PIC_fullname: string;
  PIC_phone: string;
  user_type: string;
  last_login: Date;
  updated_at: Date;
  created_at: Date;
}
