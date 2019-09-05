import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AngularPaneManagerModule} from 'projects/angular-pane-manager/src/public-api';

import {AppComponent} from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AngularPaneManagerModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
