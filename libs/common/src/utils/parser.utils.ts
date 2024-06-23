import { Injectable } from '@nestjs/common';

class ValidateError extends Error {}

@Injectable()
export class ParserUtils {
  static stringToBool(value: any, defaultValue: boolean | null): boolean | null {
    value = typeof value !== 'string' ? value : value.toLowerCase();
    //'y', 'yes', 'true', true, '1', 1, 'n', 'no', 'false', false, '0', 0, 'on', 'off'
    switch (value) {
      case 'y':
        return true;
      case 'yes':
        return true;
      case 'true':
        return true;
      case true:
        return true;
      case '1':
        return true;
      case 1:
        return true;
      case 'on':
        return true;
      case 'n':
        return false;
      case 'no':
        return false;
      case 'false':
        return false;
      case false:
        return false;
      case '0':
        return false;
      case 0:
        return false;
      case 'off':
        return false;
      default:
        return defaultValue;
    }
  }

  static stringToInt<T>(value: string | void, defaultValue: T): number | T {
    if (value === undefined || value === null) {
      return defaultValue;
    }
    if (typeof value === 'string') {
      value = value.trim().replaceAll(',', '.');
      const valueParsed = parseInt(value, 10);
      return isNaN(valueParsed) ? defaultValue : valueParsed;
    }
    return defaultValue;
  }

  static stringToFloat<T>(value: string | void, defaultValue: T): number | T {
    if (value === undefined || value === null) {
      return defaultValue;
    }
    if (typeof value === 'string') {
      value = value.trim().replaceAll(',', '.');
      const valueParsed = parseFloat(value);
      return isNaN(valueParsed) ? defaultValue : valueParsed;
    }
    return defaultValue;
  }

  static stringToInt_Throw(value: string | void): number {
    if (value === undefined || value === null) {
      throw new ValidateError('error parse Int from ' + value);
    }
    if (typeof value !== 'string') {
      throw new ValidateError('error parse Int from "' + value + '", must be string');
    }

    value = value.trim().replaceAll(',', '.');
    const valueParsed = parseInt(value, 10);
    if (isNaN(valueParsed)) {
      throw new ValidateError('error parse Int from ' + value);
    }
    return valueParsed;
  }
}
