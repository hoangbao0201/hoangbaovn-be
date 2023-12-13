import { IsNotEmpty, IsString } from "class-validator"

export class CreateReplyCommentDto {
    @IsString()
    @IsNotEmpty()
    blogId: string

    @IsString()
    @IsNotEmpty()
    parentId: string

    @IsString()
    @IsNotEmpty()
    receiverId: string

    @IsString()
    @IsNotEmpty()
    commentText: string
} 
