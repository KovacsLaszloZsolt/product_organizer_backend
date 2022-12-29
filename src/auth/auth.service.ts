import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signUp(dto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(dto.password, salt);

    const createdUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return createdUser;
  }

  signIn() {
    return 'iam ifn';
  }
}
