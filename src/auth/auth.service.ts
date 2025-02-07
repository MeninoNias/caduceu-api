import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { ClientsService } from '../clients/clients.service';
import { LoginDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register-auth.dto';
import { UserPayload } from './interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private clientsService: ClientsService,
    private jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (user && !user.emailConfirm) {
      throw new UnauthorizedException('Email não confirmado, por favor verifique seu email');
    }

    const payload: UserPayload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const client = await this.clientsService.create({
      ...registerDto,
    });

    return {
      client
    };
  }

}
