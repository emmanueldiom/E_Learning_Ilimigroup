export enum Role {
	ETUDIANT = 'student',
	FORMATEUR = 'tutor',
	COMMERCIAL = 'commercial',
	ADMIN_CONTENU = 'content_admin',
	ADMINISTRATEUR = 'admin',
	SUPER_ADMINISTRATEUR = 'super_admin',
}

export const CORRESPONDANCE_ANCIENS_ROLES: Record<string, Role> = {
	etudiant: Role.ETUDIANT,
	formateur: Role.FORMATEUR,
	admin_formateur: Role.ADMIN_CONTENU,
	admin: Role.ADMINISTRATEUR,
};

export function normaliserRole(role: unknown): Role | undefined {
	if (typeof role !== 'string') {
		return undefined;
	}

	return Object.values(Role).includes(role as Role)
		? (role as Role)
		: CORRESPONDANCE_ANCIENS_ROLES[role];
}