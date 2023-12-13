import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateReplyCommentDto } from './dto/create-replycomment.dto';

@Controller('/api/comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(JwtGuard)
    @Post()
    createComment(@Request() req, @Body() createCommentDto: CreateCommentDto) {
        return this.commentService.createComment(
            req.user.userId,
            createCommentDto,
        );
    }

    @UseGuards(JwtGuard)
    @Post("/reply")
    createReplyComment(@Request() req, @Body() createReplyCommentDto: CreateReplyCommentDto) {
        return this.commentService.createReplyComment(
            req.user.userId,
            createReplyCommentDto,
        );
    }

    @Get('/')
    getComments(
        @Query('blogId') blogId: number,
        @Query('take') take: number,
        @Query('skip') skip: number,
    ) {
        return this.commentService.getComments({ blogId, take, skip });
    }

    @Get('/reply')
    getReplyComments(
        @Query('blogId') blogId: number,
        @Query('parentId') parentId: number,
        @Query('take') take: number,
        @Query('skip') skip: number,
    ) {
        return this.commentService.getReplyComments({ blogId, parentId, take, skip });
    }

}
