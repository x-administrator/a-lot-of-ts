export type JWTPayload = {
  id: string;
  sessionId: string;
};

export type JWTStrategyValidatePayload = JWTPayload & {
  iat: number;
  exp: number;
};



export type TokenResponse = {
  accessToken: string;
}

export type RegisterPayload ={
  nikName: string;
  password: string;
}

export type LoginPayload ={
  nikName: string;
  password: string;
}