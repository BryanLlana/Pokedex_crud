import { IsInt, IsNumber, IsOptional, Min } from "class-validator"

export class PaginationDto {
  @IsNumber() @IsInt() @IsOptional() @Min(1)
  limit?: number

  @IsNumber() @IsInt() @IsOptional()
  offset?: number
}