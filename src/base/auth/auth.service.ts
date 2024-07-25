import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  register(createAuthDto: CreateAuthDto) {
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
