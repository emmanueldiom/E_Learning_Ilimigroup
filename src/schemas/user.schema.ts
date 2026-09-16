import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../common/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true, trim: true })
	nom!: string;

	@Prop({ required: true, trim: true })
	prenom!: string;

	@Prop({ required: true, unique: true, lowercase: true, trim: true })
	email!: string;

    @Prop({required:true, trim:true})
    telephone!:string;

	@Prop({ required: true, select: false })
	password!: string;

	@Prop({ type: String, enum: Role, default: Role.ETUDIANT })
	role!: Role;

	@Prop({ default: true })
	isActive!: boolean;

	@Prop({ default: false })
	isEmailVerified?: boolean;

	// --- Vérification d'email (lien magique) ---
	// On ne stocke jamais le token en clair : uniquement son hash SHA-256.
	@Prop({ select: false })
	emailVerificationTokenHash?: string;

	@Prop({ select: false })
	emailVerificationExpires?: Date;

	// --- Réinitialisation du mot de passe ---
	@Prop({ select: false })
	passwordResetTokenHash?: string;

	@Prop({ select: false })
	passwordResetExpires?: Date;

	// --- Refresh token (rotation) ---
	// Hash du dernier refresh token valide émis pour cet utilisateur.
	@Prop({ select: false })
	refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
