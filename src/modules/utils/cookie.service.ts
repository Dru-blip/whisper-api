import { Injectable } from '@nestjs/common';

@Injectable()
export class CookieService {
  constructor() {}

  getCookie(cookie: string, name: string): string | null {
    const cookies = cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }
}
