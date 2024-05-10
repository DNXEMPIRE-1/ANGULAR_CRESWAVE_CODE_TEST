export class AuthData {
  token: string;
  decodedToken: DecodedAuthToken;
  expiration: Date;

  private constructor(token: string, decodedToken: DecodedAuthToken) {
    this.token = token;
    this.decodedToken = decodedToken;
    this.expiration = new Date(this.decodedToken.exp * 1000);
  }

  get isValid(): boolean {
    return !!this.token && !this.isExpired;
  }

  get isExpired(): boolean {
    return Date.now() > this.expiration.getTime();
  }

  static fromSelf(self: AuthData | null | undefined): AuthData | null | undefined {
    if (self == null) return self;

    return new AuthData(self.token, self.decodedToken);
  }

  static fromToken(token: string, decodedAuthToken: DecodedAuthToken): AuthData {
    return new AuthData(token, decodedAuthToken);
  }
}

export interface DecodedAuthToken {
  unique_name: string;
  email: string;
  UserId: string;
  nbf: number;
  exp: number;
  iat: number;
  role?: string;
  roles?: string[];
}
