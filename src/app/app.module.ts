// tslint:disable no-implicit-dependencies

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AngularPaneManagerModule} from 'projects/angular-pane-manager/src/public-api';

import {AppComponent} from './app.component';

/** The root module of the application */
@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AngularPaneManagerModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
