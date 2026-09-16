import { Role } from '../enums/role.enum';

export enum Permission {
	ETUDIANT_FORMATIONS_PAYEES = 'student:paid-trainings',
	ETUDIANT_COURS = 'student:courses',
	ETUDIANT_QUIZ = 'student:quizzes',
	ETUDIANT_PROGRESSION = 'student:progress',
	ETUDIANT_POINTS = 'student:points',
	ETUDIANT_PAIEMENTS = 'student:payments',

	FORMATEUR_ETUDIANTS = 'tutor:students',
	FORMATEUR_PROGRESSION = 'tutor:progress',
	FORMATEUR_RESULTATS = 'tutor:results',
	FORMATEUR_NOTES = 'tutor:notes',
	FORMATEUR_MARQUEURS = 'tutor:markers',
	FORMATEUR_RELANCES = 'tutor:reminders',

	CONTENU_FORMATIONS = 'content:trainings',
	CONTENU_COURS = 'content:courses',
	CONTENU_LECONS = 'content:lessons',
	CONTENU_DOCUMENTS = 'content:documents',
	CONTENU_VIDEOS = 'content:videos',
	CONTENU_QUIZ = 'content:quizzes',

	ADMINISTRATEUR_UTILISATEURS = 'admin:users',
	ADMINISTRATEUR_FORMATIONS = 'admin:trainings',
	ADMINISTRATEUR_AFFECTATIONS_FORMATEURS = 'admin:tutor-assignments',
	ADMINISTRATEUR_SUPERVISION = 'admin:supervision',
	SUPER_ADMINISTRATEUR_COMPTES_ADMINISTRATEURS = 'super-admin:admin-accounts',
}

const permissionsEtudiant = [
	Permission.ETUDIANT_FORMATIONS_PAYEES,
	Permission.ETUDIANT_COURS,
	Permission.ETUDIANT_QUIZ,
	Permission.ETUDIANT_PROGRESSION,
	Permission.ETUDIANT_POINTS,
	Permission.ETUDIANT_PAIEMENTS,
];

const permissionsFormateur = [
	Permission.FORMATEUR_ETUDIANTS,
	Permission.FORMATEUR_PROGRESSION,
	Permission.FORMATEUR_RESULTATS,
	Permission.FORMATEUR_NOTES,
	Permission.FORMATEUR_MARQUEURS,
	Permission.FORMATEUR_RELANCES,
];

const permissionsAdminContenu = [
	Permission.CONTENU_FORMATIONS,
	Permission.CONTENU_COURS,
	Permission.CONTENU_LECONS,
	Permission.CONTENU_DOCUMENTS,
	Permission.CONTENU_VIDEOS,
	Permission.CONTENU_QUIZ,
];

const permissionsAdministrateur = [
	Permission.ADMINISTRATEUR_UTILISATEURS,
	Permission.ADMINISTRATEUR_FORMATIONS,
	Permission.ADMINISTRATEUR_AFFECTATIONS_FORMATEURS,
	Permission.ADMINISTRATEUR_SUPERVISION,
];

export const PERMISSIONS_PAR_ROLE: Record<Role, readonly Permission[]> = {
	[Role.ETUDIANT]: permissionsEtudiant,
	[Role.FORMATEUR]: permissionsFormateur,
	[Role.ADMIN_CONTENU]: permissionsAdminContenu,
	[Role.ADMINISTRATEUR]: permissionsAdministrateur,
	[Role.SUPER_ADMINISTRATEUR]: [
		...permissionsAdministrateur,
		Permission.SUPER_ADMINISTRATEUR_COMPTES_ADMINISTRATEURS,
	],
};