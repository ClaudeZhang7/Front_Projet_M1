import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() {}

  filterData<T>(data: T[], searchTerm: string, property: keyof T): T[] {
    if (!searchTerm) {
      return data; 
    }

    const regex = new RegExp(searchTerm, 'i'); 
    return data.filter(item => regex.test(item[property] as string));
  }
}
