import { Body, Controller, Post, Route, Tags } from 'tsoa';
import { injectable, registry } from 'tsyringe';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dtos';
import userModel from './schemas/user.schema';

@registry([
  {
    token: 'USER',
    useFactory: () => userModel
  }
])
@Tags('auth')
@Route('auth')
@injectable()
export class AuthController extends Controller {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('/login')
  login(@Body() payload: LoginDTO) {
    return this.authService.login(payload);
  }

  @Post('/register')
  register(@Body() payload: RegisterDTO) {
    return this.authService.register(payload);
  }
}
