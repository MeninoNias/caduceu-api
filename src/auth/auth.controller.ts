import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseClientDto } from 'src/clients/dto/response-client.dto';
import { HashedPasswordPipe } from 'src/shared/pipes/hashed-password.pipe';
import { YupValidationPipe } from 'src/shared/pipes/yup-validation.pipe';
import { AuthService } from './auth.service';
import { Public } from './decorators/is-public.decorator';
import { LoginDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { loginSchema } from './schemas/login.schema';
import { registerSchema } from './schemas/register.schema';

@ApiTags('🔐 Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @Public()
  @UsePipes(new YupValidationPipe(loginSchema))
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Token JWT',
    schema: { example: { access_token: 'jwt_token' } }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public()
  @UsePipes(new YupValidationPipe(registerSchema))
  @ApiOperation({ summary: 'Registrar novo cliente' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Cliente registrado com sucesso',
    type: ResponseClientDto
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Body('password', HashedPasswordPipe) password: string
  ) {
    return this.authService.register({ ...registerDto, password });
  }

}
