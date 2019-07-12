import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  shortDescLength = 150;

  constructor() { }

  convertToFormattedString(date: string, format: string): string {
    return moment.utc(new Date(date)).format(format);
  }

  convertStringToFormattedDateString(date: string, origin_format: string, format: string): string {
    return moment.utc(date, origin_format).format(format);
  }

  shortDescription(description: string): string {
    if (description && description.length > this.shortDescLength) {
      return description.slice(0, this.shortDescLength) + '...';
    } else {
      return description;
    }
  }

  cityNameFromAutoComplete(cityValue: string): string {
    let city;
    if (cityValue.includes(', ')) {
      city = cityValue.split(', ')[0];
    }
    return city;
  }

}
