export enum UserSecretType {
  LOCAL,
  GOOGLE,
  APPLE,
}

export class UserCheckSecretDTO {
  userId: string;
  secret: string;
  type: UserSecretType;
}
