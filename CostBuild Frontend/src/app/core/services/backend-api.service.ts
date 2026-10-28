import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:17944/api';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  private readonly http = inject(HttpClient);

  list<T>(collection: string): Observable<T[]> {
    return this.http.get<T[]>(`${API_URL}/${collection}`);
  }

  saveAll<T>(collection: string, records: T[]): Observable<T[]> {
    return this.http.put<T[]>(`${API_URL}/${collection}`, records);
  }

  save<T extends { id: string }>(collection: string, record: T): Observable<T> {
    return this.http.put<T>(`${API_URL}/${collection}/${encodeURIComponent(record.id)}`, record);
  }

  delete(collection: string, id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${collection}/${encodeURIComponent(id)}`);
  }
}
