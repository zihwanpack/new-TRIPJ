let accessToken: string | null = null;

export const tokenManager = {
  set: (token: string | null) => {
    accessToken = token;
  },
  get: () => accessToken,
};
