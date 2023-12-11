import {
    Controller,
    Get,
    Post,
    Body,
    Request,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Ip,
    Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { JwtConfirmGuard } from '../auth/guard/jwt.confirm.guard';

@Controller('/api/blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @UseGuards(JwtGuard)
    @Post()
    createBlog(@Request() req, @Body() createBlogDto: CreateBlogDto) {
        return this.blogService.create(req.user.userId, createBlogDto);
    }

    @UseGuards(JwtGuard)
    @Get('/edit')
    getBlogEdit(@Request() req, @Query('blogId') blogId: number) {
        return this.blogService.getEditBlog(req.user.userId, blogId);
    }

    @UseGuards(JwtGuard)
    @Patch('/edit')
    editBlog(
        @Request() req,
        @Query('blogId') blogId: number,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        return this.blogService.updateEditBlog(
            req.user.userId,
            blogId,
            updateBlogDto,
        );
    }

    @Get()
    findAll(
        @Query('search') search: string,
        @Query('byu') byu: string,
        @Query('tag') tag: string,
        @Query('take') take: number,
        @Query('skip') skip: number,
        @Query('sort') sort: 'desc' | 'asc',
    ) {
        return this.blogService.findAll({ search, byu, tag, take, skip, sort });
    }

    @Get('/search')
    searchBlogs(
        @Query('q') search: string,
        @Query('tag') tag: string,
        @Query('take') take: number,
        @Query('skip') skip: number,
        @Query('sort') sort: 'desc' | 'asc',
    ) {
        return this.blogService.searchBlogs({ search, tag, take, skip, sort });
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.blogService.findOne(slug);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.blogService.remove(+id);
    }

    @UseGuards(JwtConfirmGuard)
    @Patch('/view/:id?')
    increaseViews(@Request() req, @Param('id') blogId: string, @Ip() ip) {
        return this.blogService.increaseViews(req.user.userId, +blogId, ip, req.headers['user-agent']);
    }
}
