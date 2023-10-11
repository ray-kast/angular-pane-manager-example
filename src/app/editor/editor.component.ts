// tslint:disable no-implicit-dependencies
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { PaneHeaderMode, PaneHeaderStyle } from 'projects/angular-pane-manager/src/public-api';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { switchAll } from 'rxjs/operators';

// TODO: add an abstract component class to make custom headers easier
/**
 * A text editor
 */
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnDestroy {
    /** See title */
    private readonly $title: BehaviorSubject<string> = new BehaviorSubject('');
    /** See header */
    private readonly $header: BehaviorSubject<PaneHeaderStyle> = new BehaviorSubject({
        headerMode: PaneHeaderMode.AlwaysTab as PaneHeaderMode,
        title: this.$title as Observable<string>,
        icon: new BehaviorSubject<string | undefined>(undefined) as Observable<string | undefined>,
        closable: true as boolean,
    });

    /** See code */
    private _code!: string;
    /** Event source for if the pane changed size */
    private readonly resized: BehaviorSubject<Observable<any>> = new BehaviorSubject(
        new Subject().asObservable(),
    );

    /** The options to pass to Monaco */
    public readonly opts: unknown = {
        theme: 'vs-dark',
        // theme: 'vs',
        language: 'javascript',
    };

    /** Event stream for when the code is modified */
    @Output() public readonly codeChange: EventEmitter<string> = new EventEmitter();

    /** Resize event stream from the panel hosting this editor */
    @Input()
    public set onResize(val: Observable<any>) {
        this.resized.next(val);
    }

    /** The contents of the editor */
    @Input()
    public get code(): string {
        return this._code;
    }

    public set code(val: string) {
        this._code = val;
        this.codeChange.emit(val);
    }

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

    public set title(val: string) {
        this.$title.next(val);
    }

    /** Clean up on destroy */
    public ngOnDestroy(): void {
        this.resized.complete();
    }

    /** Configure the editor */
    public monacoInit(editor: any): void {
        this.resized.pipe(switchAll()).subscribe(_ => requestAnimationFrame(() => editor.layout()));
    }
}
