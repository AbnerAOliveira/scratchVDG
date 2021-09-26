import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment.prod';
import { APIResponse, Game } from '../models'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getGameList(ordering: string, search?:string): Observable<APIResponse<Game>>{
    let params = new HttpParams().set('ordering', ordering);

    if(search){
      params = new HttpParams().set('ordering', ordering).set('search', search);
    }

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`,{
      params: params
    });
  }

  getApiDetails(id: string): Observable<Game>{
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`);
    const gameTrailerRequest = this.http.get(`${env.BASE_URL}/games/${id}/movies`);
    const gameScreenShotsRequest = this.http.get(`${env.BASE_URL}/games/${id}/screenshots`);

    return forkJoin({
      gameInfoRequest,
      gameTrailerRequest,
      gameScreenShotsRequest,
    }).pipe(
      map((response:any) => {
        return {
          ...response['gameInfoRequest'],
          screenshots: response['gameTrailerRequest']?.results,
          trailers: response['gameScreenShotsRequest']?.results
        }
      })
    )
  }
}
