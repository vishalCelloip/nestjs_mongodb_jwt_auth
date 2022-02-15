import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema(
  {
    // Type: Personal
    name: { type: String, required: false },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // Type: Comapny
    company_name: { type: String, required: false },
    PIC_fullname: { type: String, required: false },
    PIC_phone: { type: String, required: false },
    user_type: { type: String, required: false },
    status: { type: String, default: 'active' },
    last_login: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

UserSchema.pre('save', async function(next: mongoose.HookNextFunction) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
