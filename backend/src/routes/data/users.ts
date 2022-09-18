export type UserCredentialData = {
  email: string;
  password: string;
}

export type UserFormData = { name: string; } & UserCredentialData;