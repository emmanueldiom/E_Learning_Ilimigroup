import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
	@IsEmail({}, { message: "L'email n'est pas valide" })
	@IsNotEmpty()
	email!: string;
}
