import formattedResponse from "@src/shared/commons/fotmat-response";
import { RequestWithUser } from "@src/shared/interfaces/request";
import isAuthenticated from "@src/shared/middlewares/auth.middleware";
import {
  Body,
  Controller,
  Get,
  Middlewares,
  Post,
  Request,
  Route,
  Tags,
} from "tsoa";
import { injectable, registry } from "tsyringe";
import { AuthService } from "./auth.service";
import { LoginDTO, RegisterDTO } from "./dtos";
import userModel from "./schemas/user.schema";

@registry([
  {
    token: "USER",
    useFactory: () => userModel,
  },
])
@Tags("auth")
@Route("auth")
@injectable()
export class AuthController extends Controller {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Get("/me")
  @Middlewares(isAuthenticated)
  getMe(@Request() req: RequestWithUser) {
    return formattedResponse({
      data: req.user,
    });
  }

  @Post("/login")
  async login(@Body() payload: LoginDTO) {
    const token = await this.authService.login(payload);
    return formattedResponse({
      data: token,
    });
  }

  @Post("/register")
  async register(@Body() payload: RegisterDTO) {
    await this.authService.register(payload);
    return formattedResponse({
      message: "user registered successfully",
    });
  }
}
