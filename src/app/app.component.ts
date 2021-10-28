import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { StopWatch } from './stop-watch';
import { StopWatchService } from './stop-watch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  public stopwatch!: StopWatch;
  public startBtn = true;
  private subscriptions: Subscription = new Subscription();
  private subscriptionsDbClick: Subscription = new Subscription();
  @ViewChild('dbClick') dbClick!: ElementRef
  constructor(private stopWatchService: StopWatchService) {
    this.subscriptions.add(
      this.stopWatchService.stopWatch.subscribe(
        (val: StopWatch) => (this.stopwatch = val)
      )
    );
  }
  public startCount(): void {
    this.startBtn = !this.startBtn;
    this.stopWatchService.startCount();
  }

  public waitTimer(): void {
    this.stopWatchService.stopTimer();
    this.startBtn = !this.startBtn;
  }

  public resetTimer(): void {
    this.stopWatchService.resetTimer();
    this.stopWatchService.startCount();
  }

  public stopTimer(): void {
    this.startBtn = true;
    this.stopWatchService.resetTimer();
  }

  public dbClickCheck(): void {
    let lastClicked = 0;
    this.subscriptionsDbClick = fromEvent(this.dbClick.nativeElement, 'click').pipe(take(2), tap(v => {
      const timeNow = new Date().getTime();
      if (timeNow < (lastClicked + 500)) this.waitTimer();
      lastClicked = timeNow;
    })).subscribe();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.subscriptionsDbClick.unsubscribe();
  }

}
