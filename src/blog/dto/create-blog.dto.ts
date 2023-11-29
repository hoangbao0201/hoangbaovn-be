import { Tag } from "@prisma/client"
import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    summary: string
    
    @IsString()
    @IsNotEmpty()
    slug: string
    
    // @IsBoolean()
    @IsNotEmpty()
    published: boolean

    @IsString()
    @IsNotEmpty()
    content: string

    @IsString()
    thumbnailUrl?: string

    @IsNotEmpty()
    blogTags: {
        name: string
        slug: string
    }[]
}
