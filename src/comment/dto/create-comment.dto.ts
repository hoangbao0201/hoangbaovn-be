import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateCommentDto {
    @IsNumber()
    @IsNotEmpty()
    blogId: string

    @IsString()
    @IsNotEmpty()
    commentText: string
} 
