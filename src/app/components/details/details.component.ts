import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  public gameRating: number = 0; 
  public game!: Game;
  public gameId: string = '';
  private routeSub: Subscription = new Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService,
  ) { }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      this.gameId = params['id'];
    });
    this.getGameDetails(this.gameId);
  }

  getColor(value: number): string {
    if (value > 75) {
      return '#5ee432';
    } else if (value > 50) {
      return '#fffa50';
    } else if (value > 30) {
      return '#f7aa38';
    } else {
      return '#ef4655';
    }
  }

  getGameDetails(id: string){
    this.httpService.getApiDetails(id).subscribe((response: Game) => {
      this.game = response;
      console.log(this.game)
      setTimeout(() => {
        this.gameRating = this.game?.metacritic;
      },1000)
    })
  }

  ngOnDestroy(){
    this.routeSub ? this.routeSub.unsubscribe() : 0;
    console.log(this.routeSub)
  }

}
