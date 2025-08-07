declare module 'google-libphonenumber' {
  export class PhoneNumberUtil {
    static getInstance(): PhoneNumberUtil;
    parse(number: string, countryCode: string): any;
    isValidNumber(number: any): boolean;
  }
} 