import { LoginDTO, RegisterDTO } from "./dtos";
import { TokenData } from "./entities";
import { User } from "./schemas";

export interface AuthRepository {
  register(dto: RegisterDTO): Promise<User>;
  login(dto: LoginDTO): Promise<TokenData>;
}
