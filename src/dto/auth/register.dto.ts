import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
	@IsString()
	@IsNotEmpty()
	nom!: string;

	@IsString()
	@IsNotEmpty()
	prenom!: string;

	@IsEmail()
	email!: string;

    @IsString()
    telephone!:string;

	@IsString()
	@MinLength(8)
	@Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
			message: 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre',
		})
	password!: string;
}
