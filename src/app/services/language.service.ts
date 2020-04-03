import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
//https://www.lan-play.com/data/servers.json
export class LanguageService {
  constructor(private http: HttpClient) { }
}
