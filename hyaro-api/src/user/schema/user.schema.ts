import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  SHOPPER = 'shopper',
  ADMIN = 'admin',
  DELIVERY = 'delivery',
  SUPPLIER = 'supplier',
  VENDOR = 'vendor',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: false })
  address: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: false, unique: false })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [String],
    enum: ['shopper', 'admin', 'delivery', 'supplier', 'vendor'],
    required: true,
  })
  roles: Role[];

  @Prop({ required: true, default: true })
  verified: boolean;

  @Prop({ default: [] })
  deliveryAddress: Array<{
    detailAddress: string;
  }>;

  comparePassword: (password: string) => boolean;
  generateJwt: () => string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(password: string) {
  const isMatch = bcrypt.compare(password, this.password);
  return isMatch;
};

UserSchema.methods.generateJwt = function() {
  return jwt.sign(
    {
      userId: this._id,
      phone: this.phone,
      email: this.email,
      fullName: this.fullName,
      roles: this.roles,
      address: this.address,
      verified: this.verified,
      deliveryAddress: this.deliveryAddress,
    },
    'jdf02jlsf0jsk0203840980avnno230',
    {
      expiresIn: '5000d',
    },
  );
};
