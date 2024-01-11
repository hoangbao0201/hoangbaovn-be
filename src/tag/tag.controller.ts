import { Controller, Request, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('/api/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll(
    @Query('q') q: string,
    @Query('tag') tag: string,
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query('sort') sort: 'desc' | 'asc',
  ) {
    return this.tagService.findAll({q, tag, take, skip, sort });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(+id, updateTagDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':blogTagId')
  remove(
    @Request() req,
    @Query('blogId') blogTagId: number
  ) {
    return this.tagService.remove(+req.user.userId, +blogTagId);
  }
}
