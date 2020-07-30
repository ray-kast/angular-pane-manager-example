// tslint:disable no-implicit-dependencies no-magic-numbers
import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {StorageMap} from '@ngx-pwa/local-storage';
import {
    headerStyle,
    LayoutGravity,
    LayoutTemplate,
    LeafLayout,
    loadLayout,
    PaneHeaderStyle,
    RootLayout,
    saveLayout,
    StringHeaderMode,
} from 'projects/angular-pane-manager/src/public-api';
import {forkJoin, Subject} from 'rxjs';

/** Enum for differentiating extra data types */
const enum ExtraType {
    Motd,
    Editor,
}

/** Important message information for the MoTD component */
interface Motd {
    /** The type of this data */
    type: ExtraType.Motd;
    /** An important message */
    motd: TemplateRef<any>;
    /** An important title */
    title: string;
}

/** Editor configuration */
interface Editor {
    /** The type of this data */
    type: ExtraType.Editor;
    /** The editor title */
    title: string;
}

/** Extra data for every leaf */
type Extra = Motd|Editor|undefined;

/** Template for an important message */
interface MotdTemplate {
    /** The type of this template */
    type: 'motd';
    /** An important message */
    motd: string;
    /** An important title */
    title: string;
}

/** Template for an editor configuration */
interface EditorTemplate {
    /** The type of this template */
    type: 'editor';
    /** The editor title */
    title: string;
}

/** Template for extra leaf data */
type ExtraTemplate = MotdTemplate|EditorTemplate|undefined;

/** Root component of the app */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
    /** The localStorage key for the pane layout */
    private static readonly LAYOUT_KEY: string = 'paneLayout';

    /** The first MoTD */
    @ViewChild('main1Motd') private readonly main1Motd!: TemplateRef<any>;
    /** The second MoTD */
    @ViewChild('main2Motd') private readonly main2Motd!: TemplateRef<any>;

    // TODO: add a tagged template for making writing layouts easier?
    /** Layout of the main pane manager */
    private _paneLayout: RootLayout<Extra> = new RootLayout(undefined);
    /** Event for when the child templates are ready */
    private readonly viewReady: Subject<undefined> = new Subject<undefined>();

    /** Pass the pane layout to the pane manager */
    public get paneLayout(): RootLayout<Extra> { return this._paneLayout; }

    /** Save the layout if the pane manager changes it */
    public set paneLayout(val: RootLayout<Extra>) {
        if (Object.is(this._paneLayout, val)) { return; }

        this._paneLayout = val;

        this.storage.set('paneLayout', saveLayout(this._paneLayout, this.saveExtra.bind(this)))
            .subscribe();
    }

    /** Construct a new app instance */
    public constructor(private readonly storage: StorageMap) {
        forkJoin([this.storage.get(AppComponent.LAYOUT_KEY), this.viewReady])
            .subscribe(([template, _]) => {
                try {
                    if (template !== undefined) {
                        this._paneLayout = loadLayout(template as LayoutTemplate<ExtraTemplate>,
                                                      this.loadExtra.bind(this))
                                               .intoRoot();
                    }
                    else {
                        this.resetLayout();
                    }
                }
                catch (e) {
                    console.warn('Error loading layout: ', e);
                    this.resetLayout();
                }
            });
    }

    /** Serialize the extra data into a JSON-safe format */
    private saveExtra(extra: Extra): ExtraTemplate {
        if (extra === undefined) { return undefined; }

        switch (extra.type) {
        case ExtraType.Motd: {
            let motd;

            switch (extra.motd) {
            case this.main1Motd: motd = 'main1'; break;
            case this.main2Motd: motd = 'main2'; break;
            default: throw new Error('bad MoTD ID - this shouldn\'t happen');
            }

            const {title} = extra;

            return {type: 'motd', motd, title};
        }
        case ExtraType.Editor: {
            const {title} = extra;

            return {type: 'editor', title};
        }
        }
    }

    /** Load the templates back into the serialized extra data */
    private loadExtra(extra: ExtraTemplate): Extra {
        if (extra === undefined) { return undefined; }

        switch (extra.type) {
        case 'motd': {
            let motd;

            switch (extra.motd) {
            case 'main1': motd = this.main1Motd; break;
            case 'main2': motd = this.main2Motd; break;
            default: throw new Error('bad MoTD ID - this shouldn\'t happen');
            }

            const {title} = extra;

            return {type: ExtraType.Motd, motd, title};
        }
        case 'editor': {
            const {title} = extra;

            return {type: ExtraType.Editor, title};
        }
        }
    }

    /** Helper function for making a MoTD pane */
    private motd(id: string, motd: TemplateRef<any>, title: string): LayoutTemplate<Extra> {
        return {id, template: 'motd', extra: {type: ExtraType.Motd, motd, title}};
    }

    /** Set up the layout once the templates are ready */
    public ngAfterViewInit(): void {
        this.viewReady.next(undefined);
        this.viewReady.complete();
    }

    /** Add headerStyle to the template context */
    public header(mode: StringHeaderMode, title: string, icon: string|undefined, closable: boolean):
        PaneHeaderStyle {
        return headerStyle(mode, title, icon, closable);
    }

    /** Reset the layout */
    public resetLayout(): void {
        const layout = [
            new LeafLayout('top', 'top', undefined, LayoutGravity.Header),
            new LeafLayout('left', 'sideLeft', undefined, LayoutGravity.Left),
            new LeafLayout('right', 'sideRight', undefined, LayoutGravity.Right),
            new LeafLayout('editor1',
                           'editor',
                           {type: ExtraType.Editor as ExtraType.Editor, title: 'Untitled-1'},
                           LayoutGravity.Main),
            new LeafLayout('editor2',
                           'editor',
                           {type: ExtraType.Editor as ExtraType.Editor, title: 'Untitled-2'},
                           LayoutGravity.Main),
            loadLayout({
                gravity: 'bottom',
                split: 'horiz',
                ratio: [1, 1],
                children: [
                    this.motd('motd1', this.main1Motd, 'Message the 1st'),
                    this.motd('motd2', this.main2Motd, 'Message the 2th'),
                ],
            },
                       x => x),
            new LeafLayout('bottom1', 'bottom1', undefined, LayoutGravity.Footer),
            // new LeafLayout('bottom2', 'bottom2', undefined, LayoutGravity.Bottom),
            // loadLayout({
            //     gravity: 'bottom',
            //     split: 'horiz',
            //     ratio: [1, 1],
            //     children: [
            //         {id: 'bottom3l', template: 'bottom3', extra: undefined},
            //         {id: 'bottom3r', template: 'bottom1', extra: undefined},
            //     ],
            // },
            //            x => x),
        ].reduce<RootLayout<Extra>|undefined>((root, pane) => {
            if (root === undefined) { return undefined; }

            const next = root.withChildByGravity(pane);
            if (next === undefined) { return undefined; }

            return next.intoRoot();
        }, new RootLayout(undefined));

        if (layout === undefined) { throw new Error('unable to construct layout'); }

        // tslint:disable no-console
        console.log(layout);

        this.paneLayout = layout;
    }
}
