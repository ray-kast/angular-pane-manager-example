// tslint:disable no-implicit-dependencies

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {AngularPaneManagerModule} from 'projects/angular-pane-manager/src/public-api';

import {AppComponent} from './app.component';
import {EditorComponent} from './editor/editor.component';
import {MotdComponent} from './motd/motd.component';

/** The root module of the application */
@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        MotdComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AngularPaneManagerModule,
        MonacoEditorModule.forRoot(),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
