import { IsNotEmpty, IsString } from "class-validator"

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    blogId: string

    @IsString()
    @IsNotEmpty()
    commentText: string
} 
