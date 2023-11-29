import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagService {

  constructor(private prismaService: PrismaService) {}

  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }

  async findAll(tag?: string, take?: number, skip?: number, sort?: "desc" | "asc") {
    try {
      const tags = await this.prismaService.tag.findMany({
        where: {
          
        },
        select: {
          tagId: true,
          name: true,
          slug: true,
          _count: {
            select: {
              blogTags: true
            }
          }
        },
        skip: skip,
        take: take,
        orderBy: {
          blogTags: {
            _count: "desc"
          }
        }
      });
      return {
        success: true,
        tags: tags,
      };
    } catch (error) {
      return {
        success: false,
        error: error
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
