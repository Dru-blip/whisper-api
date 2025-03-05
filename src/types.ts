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
