export type AccessTokenPayload = {
  id: number;
  email: string;
};

export type RefreshTokenPayload = {
  id: number;
  email: string;
  version: number;
};

export type OnboardingTokenPayload = {
  email: string;
};

export type VerificationTokenPayload = {
  email: string;
  cid: string;
  ip: string;
};
