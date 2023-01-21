import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async signUp(dto: AuthDto) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(dto.password, salt);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
        select: {
          id: true,
          email: true,
        },
      });

      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new BadRequestException('User already exists');
        }
      }
    }
  }

  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new BadRequestException('Invalid email/password');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { id: userId, email: email };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15min',
      secret: process.env.JWT_SECRET_KEY,
    });
    return { access_token: token };
  }
}
