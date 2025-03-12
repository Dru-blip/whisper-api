export type AccessTokenPayload = {
  id: string;
  email: string;
};

export type RefreshTokenPayload = {
  id: string;
  email: string;
  version: number;
};

export type OnboardingTokenPayload = {
  email: string;
};

export type VerificationTokenPayload = {
  email: string;
  cid: string;
};

export type Session = {
  id: string;
  userId: string;
  email: string;
  expiresAt: Date;
};
