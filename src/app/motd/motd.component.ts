// tslint:disable no-implicit-dependencies
import {Component, Input, Output, TemplateRef} from '@angular/core';
import {PaneHeaderMode, PaneHeaderStyle} from 'projects/angular-pane-manager/src/public-api';
import {BehaviorSubject, Observable} from 'rxjs';

/**
 * Represents a message - just for you!
 */
@Component({
    selector: 'app-motd',
    templateUrl: './motd.component.html',
    styleUrls: ['./motd.component.scss'],
})
export class MotdComponent {
    /** The title of the pane */
    private readonly $title: BehaviorSubject<string> = new BehaviorSubject('');
    // Typescript's inference really lost it here
    /** See header */
    private readonly $header: BehaviorSubject<PaneHeaderStyle> = new BehaviorSubject({
        headerMode: PaneHeaderMode.Visible as PaneHeaderMode,
        title: this.$title                 as Observable<string>,
        icon: new BehaviorSubject<string|undefined>(undefined) as Observable<string|undefined>,
        closable: true as boolean,
    });

    /** The template to render */
    @Input() public motd: TemplateRef<any>|undefined;

    /** The header for the pane */
    @Output()
    public get header(): Observable<PaneHeaderStyle> {
        return this.$header;
    }

    /** Set the pane title */
    @Input()
    public get title(): string {
        return this.$title.value;
    }

    public set title(val: string) { this.$title.next(val); }
}
