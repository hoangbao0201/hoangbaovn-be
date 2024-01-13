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
        @Query('q') q: string,
        @Query('byu') byu: string,
        @Query('tags') tags: string,
        @Query('take') take: number,
        @Query('skip') skip: number,
        @Query('otherId') otherId: number,
        @Query('sort') sort: 'desc' | 'asc',
    ) {
        return this.blogService.findAll({ q, byu, tags, take: take, skip: skip, sort, otherId });
    }

    @Get("/seo")
    findAllSEO() {
        return this.blogService.findAllSEO();
    }

    @Get('/search')
    searchBlogs(
        @Query('q') q: string,
        @Query('tags') tags: string,
        @Query('take') take: number,
        @Query('skip') skip: number,
        @Query('sort') sort: 'desc' | 'asc',
    ) {
        return this.blogService.searchBlogs({ q, tags, take: take, skip: skip, sort });
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.blogService.findOne(slug);
    }

    @UseGuards(JwtGuard)
    @Delete(':blogId')
    remove(@Param('blogId') blogId: number, @Request() req,) {
        return this.blogService.remove(+blogId, +req.user.userId);
    }

    @UseGuards(JwtConfirmGuard)
    @Patch('/view/:id?')
    increaseViews(@Request() req, @Param('id') blogId: number) {
        return this.blogService.increaseViews(req.user.userId, blogId);
    }
}
