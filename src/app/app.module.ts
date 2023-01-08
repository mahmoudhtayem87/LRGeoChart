import {Directive, Injector, Input, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {createCustomElement} from "@angular/elements";
import { PointDirective } from './point.directive';



@NgModule({
  declarations: [
    AppComponent,
    PointDirective
  ],
  imports: [
    BrowserModule
  ],
  entryComponents: [
    AppComponent
  ]
})
export class AppModule {
  constructor(private injector: Injector) {

    const appElement = createCustomElement(AppComponent, {
      injector: this.injector
    });
    customElements.define("lr-geo-chart", appElement);
  }
  ngDoBootstrap() { }
}

