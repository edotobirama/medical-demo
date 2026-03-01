export type User = {
    id: string;
    name: string | null;
    email: string;
    emailVerified?: Date | null;
    image?: string | null;
    password?: string | null;
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
};
