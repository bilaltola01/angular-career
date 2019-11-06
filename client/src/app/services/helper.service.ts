import { Injectable } from '@angular/core';
import moment from 'moment';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  shortDescLength = 500;

  helper = new JwtHelperService();

  constructor() { }
  convertToDays(date: string) {
    const PostDate = moment(date);
    const result = PostDate.fromNow();
    return result;

  }

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

  extractLinkString(link: string): string {
    if (link.includes('http://')) {
      return link.replace('http://', '');
    } else if (link.includes('https://')) {
      return link.replace('https://', '');
    } else {
      return link;
    }
  }

  checkSpacesString(str: string): string {
    if (str) {
      if (!str.replace(/\s/g, '').length) {
        return null;
      } else {
        return str;
      }
    } else {
      return null;
    }
  }

  extractUserId() {
    const token = localStorage.getItem('token');
    const decodedToken = this.helper.decodeToken(token);
    if (decodedToken && decodedToken.user_id) {
      return decodedToken.user_id;
    } else {
      return null;
    }
  }

}
