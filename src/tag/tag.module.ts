import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TagController],
  providers: [TagService, JwtService],
})
export class TagModule {}
