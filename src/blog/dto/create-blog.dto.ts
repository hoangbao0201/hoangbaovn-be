import { Tag } from "@prisma/client"
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateBlogDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    summary?: string
    
    @IsString()
    slug: string
    
    // @IsBoolean()
    @IsOptional()
    published?: boolean

    @IsString()
    @IsOptional()
    content?: string

    @IsString()
    @IsOptional()
    thumbnailUrl?: string

    @IsOptional()
    blogTags?: {
        name: string
        slug: string
    }[]
}
