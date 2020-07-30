// tslint:disable no-implicit-dependencies
import {Component, Input, Output} from '@angular/core';
import {PaneHeaderMode, PaneHeaderStyle} from 'projects/angular-pane-manager/src/public-api';
import {BehaviorSubject, Observable} from 'rxjs';

// TODO: add an abstract component class to make custom headers easier
/**
 * A text editor
 */
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    /** See title */
    private readonly $title: BehaviorSubject<string> = new BehaviorSubject('');
    /** See header */
    private readonly $header: BehaviorSubject<PaneHeaderStyle> = new BehaviorSubject({
        headerMode: PaneHeaderMode.AlwaysTab as PaneHeaderMode,
        title: this.$title                   as Observable<string>,
        icon: new BehaviorSubject<string|undefined>(undefined) as Observable<string|undefined>,
        closable: true as boolean,
    });

    /** The options to pass to Monaco */
    public readonly opts: unknown = {theme: 'vs-dark', language: 'javascript'};

    /** The contents of the editor */
    public code: string = `console.log('Hello world!');`;

    /** The header of the pane */
    @Output()
    public get header(): Observable<PaneHeaderStyle> {
        return this.$header;
    }

    /** The title of the pane */
    @Input()
    public get title(): string {
        return this.$title.value;
    }

    public set title(val: string) { this.$title.next(val); }
}
