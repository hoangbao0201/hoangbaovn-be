import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateCommentDto {
    @IsNumber()
    @IsNotEmpty()
    blogId: number
    
    @IsNumber()
    @IsOptional()
    parentId?: number
    
    @IsNumber()
    @IsOptional()
    receiverId?: number

    @IsString()
    @IsNotEmpty()
    commentText: string
} 
