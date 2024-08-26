import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, UpdateAuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // 注册
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    throw new Error('Method Not Allowed');
    return this.authService.register(createAuthDto);
  }
  // 登录
  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  // 登出
  @Post('logout')
  logout(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.logout(createAuthDto);
  }

  // 获取用户信息
  @Get('getUser')
  findOne(@Query('id') id: string) {
    return this.authService.findOne(id);
  }

  // 修改用户信息
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }
}
