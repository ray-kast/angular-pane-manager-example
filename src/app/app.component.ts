// tslint:disable no-implicit-dependencies no-magic-numbers
import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import {
    headerStyle,
    LayoutBuilder,
    LayoutTemplate,
    LayoutType,
    PaneHeaderStyle,
    RootLayout,
    saveLayout,
    StringHeaderMode,
} from 'projects/angular-pane-manager/src/public-api';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
    /** The editor contents */
    code: string;
}

/** Extra data for every leaf */
type Extra = Motd | Editor | undefined;

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
    /** The editor contents */
    code: string;
}

/** Template for extra leaf data */
type ExtraTemplate = MotdTemplate | EditorTemplate | undefined;

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

    /** A map of the named MoTDs */
    private readonly motds: Map<string, TemplateRef<any>> = new Map();

    /** Layout of the main pane manager */
    private _paneLayout: RootLayout<Extra> = new RootLayout(undefined);
    /** Event for when the child templates are ready */
    private readonly viewReady: Subject<undefined> = new Subject();
    /** The (1-based) index of the next editor to open */
    private nextEditor: number = 1;
    /** Request a (debounced) autosave */
    public readonly requestAutosave: Subject<undefined> = new Subject();

    /** Pass the pane layout to the pane manager */
    public get paneLayout(): RootLayout<Extra> {
        return this._paneLayout;
    }

    /** Save the layout if the pane manager changes it */
    public set paneLayout(val: RootLayout<Extra>) {
        if (Object.is(this._paneLayout, val)) {
            return;
        }

        this._paneLayout = val;
        this.saveLayout();
    }

    /** Construct a new app instance */
    public constructor(private readonly storage: StorageMap) {
        forkJoin([this.storage.get(AppComponent.LAYOUT_KEY), this.viewReady]).subscribe(
            ([template, _]) => {
                const result = LayoutBuilder.empty<Extra>().build(b => {
                    b.set(
                        b.load(
                            template as LayoutTemplate<ExtraTemplate>,
                            this.loadExtra.bind(this),
                        ),
                    );

                    if (
                        b.root.findChild(
                            c => c.type === LayoutType.Leaf && c.template === 'top',
                        ) === undefined
                    ) {
                        b.add(b.leaf('top', 'top', undefined, 'header'));
                    }
                });

                if (result.err !== undefined) {
                    console.warn('Error loading layout: ', result.err);
                    this.resetLayout();
                } else {
                    this._paneLayout = result.ok;
                }

                while (
                    this.paneLayout.findChild(
                        c => c.type === LayoutType.Leaf && c.id === `editor${this.nextEditor}`,
                    ) !== undefined
                ) {
                    this.nextEditor += 1;
                }
            },
        );

        this.requestAutosave.pipe(debounceTime(500)).subscribe(_ => {
            this.saveLayout();
        });
    }

    /** Save the current layout and config */
    private saveLayout(): void {
        this.storage
            .set(AppComponent.LAYOUT_KEY, saveLayout(this._paneLayout, this.saveExtra.bind(this)))
            .subscribe();
    }

    /** Serialize the extra data into a JSON-safe format */
    private saveExtra(extra: Extra): ExtraTemplate {
        if (extra === undefined) {
            return undefined;
        }

        switch (extra.type) {
            case ExtraType.Motd: {
                let motd;

                for (const [name, template] of this.motds) {
                    if (Object.is(extra.motd, template)) {
                        motd = name;
                        break;
                    }
                }

                if (motd === undefined) {
                    throw new Error("bad MoTD ID - this shouldn't happen");
                }

                const { title } = extra;

                return { type: 'motd', motd, title };
            }
            case ExtraType.Editor: {
                const { title, code } = extra;

                return { type: 'editor', title, code };
            }
        }
    }

    /** Load the templates back into the serialized extra data */
    private loadExtra(extra: ExtraTemplate): Extra {
        if (extra === undefined) {
            return undefined;
        }

        switch (extra.type) {
            case 'motd': {
                const motd = this.motds.get(extra.motd);

                if (motd === undefined) {
                    throw new Error("bad MoTD ID - this shouldn't happen");
                }

                const { title } = extra;

                return { type: ExtraType.Motd, motd, title };
            }
            case 'editor': {
                const { title, code } = extra;

                return { type: ExtraType.Editor, title, code };
            }
        }
    }

    /** Helper function for making MoTD extra data */
    private motd(motd: TemplateRef<any>, title: string): Extra {
        return { type: ExtraType.Motd, motd, title };
    }

    /** Helper function for making editor extra data */
    private editor(title: string, code: string): Extra {
        return { type: ExtraType.Editor, title, code };
    }

    /** Set up the layout once the templates are ready */
    public ngAfterViewInit(): void {
        this.motds.set('main1', this.main1Motd);
        this.motds.set('main2', this.main2Motd);

        this.viewReady.next(undefined);
        this.viewReady.complete();
    }

    /** Add headerStyle to the template context */
    public header(
        mode: StringHeaderMode,
        title: string,
        icon: string | undefined,
        closable: boolean,
    ): PaneHeaderStyle {
        return headerStyle(mode, title, icon, closable);
    }

    /** Reset the layout */
    public resetLayout(): void {
        const result = LayoutBuilder.empty<Extra>().build(b => {
            b.add(
                b.leaf('top', 'top', undefined, 'header'),
                b.leaf('left', 'sideLeft', undefined, 'left'),
                b.leaf('right', 'sideRight', undefined, 'right'),
                b.leaf('editor1', 'editor', this.editor('Untitled-1', '// Try me!'), 'main'),
                b.leaf('editor2', 'editor', this.editor('Untitled-2', '// Try me too!'), 'main'),
                b.horiz(
                    [
                        b.leaf('motd1', 'motd', this.motd(this.main1Motd, 'Message the 1st')),
                        b.leaf('motd2', 'motd', this.motd(this.main2Motd, 'Message the 2th')),
                    ],
                    undefined,
                    'bottom',
                ),
                b.leaf('footer', 'footer', undefined, 'footer'),
            );
        });

        this.paneLayout = result.unwrap();
    }

    /** Add a new editor tab to the layout */
    public addEditor(): void {
        const n = this.nextEditor;

        const result = LayoutBuilder.from(this.paneLayout).build(b => {
            b.add(b.leaf(`editor${n}`, 'editor', this.editor(`Untitled-${n}`, ''), 'main'));
        });

        this.paneLayout = result.unwrap();

        while (
            this.paneLayout.findChild(
                c => c.type === LayoutType.Leaf && c.id === `editor${this.nextEditor}`,
            ) !== undefined
        ) {
            this.nextEditor += 1;
        }
    }
}
