import { SECRET_KEY } from "@src/shared/configs/config";
import { UnauthorizedException } from "@src/shared/exceptions/unauthorized.exception";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { Model } from "mongoose";
import { inject, injectable } from "tsyringe";
import { AuthRepository } from "./auth.repository";
import { LoginDTO, RegisterDTO } from "./dtos";
import { TokenData, User } from "./entities";

@injectable()
export class AuthService implements AuthRepository {
  constructor(@inject('USER') private userModel: Model<User>) {}

  async register(dto: RegisterDTO): Promise<User> {
    const hashedPassword = await hash(dto.password, 10);
    const createdUser = new this.userModel({
      name: dto.name,
      username: dto.username,
      password: hashedPassword
    });
    return createdUser.save();
  }

  async login(dto: LoginDTO): Promise<TokenData> {
    const user = await this.userModel.findOne({ username: dto.username });

      if(!user) throw new UnauthorizedException();

     const hashedPassword = user.password;
     const isMatch = await compare(dto.password, hashedPassword);
     if (isMatch) return this.createToken(user);
  }

  private createToken(user: User): TokenData {
    const dataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn = 1000 * 60 * 60 * 24 * 365;

    return {
      expiresIn,
      token: sign(dataStoredInToken, secretKey, { expiresIn })
    };
  }
}