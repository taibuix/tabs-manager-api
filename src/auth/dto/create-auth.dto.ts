import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({ message: "email can not be empty" })
    email!: string;

    @IsNotEmpty({ message: "Password cannot be empty" })
    password!: string
}
