import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('/api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtGuard)
  @Get("/users")
  findAllByAdmin(@Request() req) {
    return this.adminService.findAllUser(req.user);
  }
}
