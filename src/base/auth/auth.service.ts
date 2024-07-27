import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAuthDto } from './dto/auth.dto';
import { PrismaService } from 'nestjs-prisma';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(createAuthDto: CreateAuthDto) {
    const hasUser = await this.prisma.user.findUnique({
      where: { username: createAuthDto.username } 
    })
    if (hasUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST)
    }
    await this.prisma.user.create({ data: createAuthDto })
    return '创建成功'
  }
  login(createAuthDto: CreateAuthDto) {
    return createAuthDto;
  }
  logout(createAuthDto: CreateAuthDto) {
    return 'This action logs out a user';
  }
  update(a,b) {
    return 'This action updates a user';
  }
  findOne(id: string) {
    return `This action returns a #${id} user`;
  }
  
}
