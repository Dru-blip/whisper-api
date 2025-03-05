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
