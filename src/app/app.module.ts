import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgPaneManager2Module} from 'projects/ng-pane-manager2/src/public-api';

import {AppComponent} from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, NgPaneManager2Module],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
