import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BlogController],
  providers: [BlogService, JwtService],
})
export class BlogModule {}
