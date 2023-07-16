import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto, SignUpDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async signUp(dto: SignUpDto) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(dto.password, salt);

    const { password, ...rest } = dto;
    try {
      const user = await this.prisma.user.create({
        data: {
          ...rest,
          password: hash,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      return user;
    } catch (err) {
      // if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw new BadRequestException('User already exists');
      }
      // }
    }
  }

  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user || !bcrypt.compareSync(dto.password, user.password)) {
      throw new BadRequestException('Invalid email/password');
    }

    const token = await this.signToken(user.id, user.email);
    const { password, ...rest } = user;

    return { ...rest, token };
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = { id: userId, email: email };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '90min',
      secret: process.env.JWT_SECRET_KEY,
    });
    return token;
  }
}
