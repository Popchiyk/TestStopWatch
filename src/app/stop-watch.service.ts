import { Injectable } from "@angular/core";
import { Observable,timer,BehaviorSubject,Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { StopWatch } from "./stop-watch";

@Injectable({
  providedIn: 'root'
})
export class StopWatchService {
  private initTime = 0; 
  
  private timer: BehaviorSubject<number> = new BehaviorSubject(this.initTime);
  private lastStoppedTime: number = this.initTime;
  private timerSubscript: any;
  private isWorks : boolean = false;
  private intervalSeconds = 0;

  constructor() { }

  public get stopWatch(): Observable<StopWatch> {
    return this.timer.pipe(
      map((miliseconds: number): StopWatch => this.secondsToStopWatch(miliseconds))
    );
  }

  startCount(): void {
    if (this.isWorks) {
      return;
    }
    this.timerSubscript = timer(0, 100).pipe(map((value: number): number => value + this.lastStoppedTime)).subscribe(this.timer);
    this.isWorks = true;
  }

  stopTimer(): void {
    this.lastStoppedTime = this.timer.value;
    this.timerSubscript.unsubscribe();
    this.isWorks = false;
  }

  resetTimer(): void {
    this.timerSubscript.unsubscribe();
    this.lastStoppedTime = this.initTime;
    this.timer.next(this.initTime);
    this.isWorks = false;
  }

  private secondsToStopWatch(ms: number): StopWatch {
    let rest = ms % 10;
    let miliseconds = rest;
    if(ms % 10 === 0) this.intervalSeconds = Math.floor(ms / 10);
    const seconds = this.intervalSeconds % 60;
    const hours = Math.floor(ms / 36000);
    rest = ms % 36000;
    const minutes = Math.floor(rest / 600);

    return {
      hours: this.convertToNumberString(hours),
      minutes: this.convertToNumberString(minutes),
      seconds: this.convertToNumberString(seconds),
      ms: miliseconds + ''
    };
  }

  private convertToNumberString(value: number): string {
    return `${value < 10 ? "0" + value : value}`;
  }
}
