export class JWTToken{
  authorities: Array<string>;
  client_id: string;
  aud: string;
  scope: Array<string>;
  username: string;
  timeBeforeExpiration: number;
  graceLoginsRemaining: number;
}
