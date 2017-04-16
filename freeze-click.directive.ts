import { Directive, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Directive({
  selector: '[freezeClick]'
})
export class FreezeClickDirective implements OnInit {
  private mouseDown$: Subject<MouseEvent>;
  private mouseMove$: Subject<MouseEvent>;
  private mouseUp$: Subject<MouseEvent>;
  private freezeClick$: Observable<any>;

  @Output()
  public freezeClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this.mouseDown$ = new Subject<MouseEvent>();
    this.mouseMove$ = new Subject<MouseEvent>();
    this.mouseUp$ = new Subject<MouseEvent>();

    const mouseMoveOrUp$ = this.mouseMove$
      .merge(this.mouseUp$);

    this.freezeClick$ = this.mouseUp$
      .bufferToggle(this.mouseDown$, () => mouseMoveOrUp$)
      .map(list => list.length)
      .filter(length => length > 0);
  }

  ngOnInit(): void {
    this.freezeClick$
      .subscribe(() => this.freezeClick.emit());
  }

  @HostListener('mousedown')
  public onMouseDown(event) {
    this.mouseDown$.next(event);
  }

  @HostListener('mousemove')
  public onMouseMove(event) {
    this.mouseMove$.next(event);
  }

  @HostListener('mouseup')
  public onMouseUp(event) {
    this.mouseUp$.next(event);
  }
}
