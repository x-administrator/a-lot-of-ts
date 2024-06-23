import * as dayjs from 'dayjs';
import * as isLeapYear from 'dayjs/plugin/isLeapYear';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(isLeapYear);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export class TimeUtils {
  static dayjs = dayjs;

  static parseDate(dateString: string, format = 'YYYY-MM-DD', defaultValue = null) {
    const dateJs = dayjs(dateString, format);
    if (dateJs.isValid()) {
      return dateJs.toDate();
    }
    return defaultValue;
  }
}
