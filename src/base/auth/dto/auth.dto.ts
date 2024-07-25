import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateAuthDto {
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string;
}

export class UpdateAuthDto { 
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    password: string;
}