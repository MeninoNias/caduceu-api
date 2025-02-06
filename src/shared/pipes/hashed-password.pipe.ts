import { Injectable, PipeTransform } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashedPasswordPipe implements PipeTransform {
  private readonly saltRounds: number;

  constructor(private configService: ConfigService) {
    this.saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 10;
  }

  async transform(value: string): Promise<string> {
    if (!value) {
      return value;
    }

    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(value, salt);
  }
}