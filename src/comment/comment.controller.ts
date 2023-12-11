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

    @Post(':id')
    getComments(
        @Param('id') blogId: string,
        @Query('take') take: number,
        @Query('skip') skip: number,
    ) {
        return this.commentService.getComments({ blogId: +blogId, take, skip });
    }

    // @Get()
    // findAll() {
    //   return this.commentService.findAll();
    // }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //   return this.commentService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    //   return this.commentService.update(+id, updateCommentDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //   return this.commentService.remove(+id);
    // }
}
