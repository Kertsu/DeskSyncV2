import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParamsBuilderService {
  constructor() {}

  buildParams(event: any) {
    let params = new HttpParams();

    if (event.filters) {
      params = params.set('filters', JSON.stringify(event.filters));
    }
    if (event.first !== undefined) {
      params = params.set('first', event.first);
    }
    if (event.rows !== undefined) {
      params = params.set('rows', event.rows);
    }
    if (event.sortField) {
      params = params.set('sortField', event.sortField);
    }
    if (event.sortOrder !== undefined) {
      params = params.set('sortOrder', event.sortOrder);
    }
    if (event.globalFilter !== undefined) {
      params = params.set('globalFilter', event.globalFilter);
    }
    if (event.mode !== undefined) {
      params = params.set('mode', event.mode);
    }

    if (event.id !== undefined) {
      params = params.set('id', event.id);
    }
    if (event.startDate !== undefined) {
      params = params.set('startDate', event.startDate);
    }
    if (event.endDate !== undefined) {
      params = params.set('endDate', event.endDate);
    }

    return params;
  }
}
