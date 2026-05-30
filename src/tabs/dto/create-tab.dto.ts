import { IsString, IsUrl, IsUUID } from "class-validator";

export class CreateTabDto {
    @IsUUID()
    sessionId!: string;

    @IsString()
    name?: string;

    @IsUrl()
    url!: string;
}
