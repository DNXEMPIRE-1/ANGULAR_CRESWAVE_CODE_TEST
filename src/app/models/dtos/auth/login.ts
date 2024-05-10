export class Login {
  private constructor(public password: string, public email?: string, public userName?: string) {}

  static withEmail(email: string, password: string): Login {
    return new Login(password, email);
  }

  static withUserName(userName: string, password: string): Login {
    return new Login(password, undefined, userName);
  }
}
