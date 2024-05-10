import { TestBed } from '@angular/core/testing';
import { TOKEN_DECODER_FN, TokenService } from '../token.service';
import { assertAreEqual } from './test-utils';
import jwtDecode from 'jwt-decode';

describe('Service: Token', () => {
  const validJwtToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InVzZXIxMjMiLCJlbWFpbCI6ImVtYWlsQGV4YW1wbGUuY29tIiwibmJmIjoxNjgyNzEwMDM1LCJleHAiOjE2ODUzMDIwMzUsImlhdCI6MTY4MjcxMDAzNX0.m3a9rgOSS6I-h2yOMGmU-SPSTaJ9WhWveNkS2jhFPVc';
  const invalidToken = 'invalid-token';
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService, { provide: TOKEN_DECODER_FN, useValue: jwtDecode }],
    });
    service = TestBed.inject(TokenService);
  });

  describe('decode', () => {
    it('should return the decoded token', () => {
      const decodedToken = service.decode(validJwtToken) as unknown as Record<string, unknown>;

      assertAreEqual(decodedToken, {
        unique_name: 'user123',
        email: 'email@example.com',
        nbf: 1682710035,
        exp: 1685302035,
        iat: 1682710035,
      });
    });

    it('should throw an error if the token is invalid', () => {
      expect(() => service.decode(invalidToken)).toThrowError();
    });

    it('should return null if the token is null', () => {
      const decodedToken = service.decode(null as unknown as string);

      expect(decodedToken).toBeNull();
    });
  });
});
