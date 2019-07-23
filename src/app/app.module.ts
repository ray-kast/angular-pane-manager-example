import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgPaneManagerModule} from 'projects/ng-pane-manager2/src/public-api';

import {AppComponent} from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, NgPaneManagerModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
