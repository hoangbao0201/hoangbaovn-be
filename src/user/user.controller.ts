import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { MyJwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET .../api/users/me
  @UseGuards(MyJwtGuard)
  @Get('me')
  async me(@GetUser() user: User) {
    return user;
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
