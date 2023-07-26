
import { LoginDTO, RegisterDTO } from "./dtos";
import { TokenData, User } from "./entities";


export interface AuthRepository {
  register(dto: RegisterDTO): Promise<User>;
  login(dto: LoginDTO): Promise<TokenData>
}