// tslint:disable no-implicit-dependencies no-magic-numbers
import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {
    headerStyle,
    LayoutGravity,
    LayoutTemplate,
    LeafLayout,
    loadLayout,
    PaneHeaderStyle,
    RootLayout,
    StringHeaderMode,
} from 'projects/angular-pane-manager/src/public-api';

/** Important message information for the MoTD component */
interface Motd {
    /** An important message */
    motd: TemplateRef<any>;
    /** An important title */
    title: string;
}

/** Type alias for the pane template type for this component */
type Template = LayoutTemplate<Motd|undefined>;

/** Root component of the app */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
    /** The first MoTD */
    @ViewChild('main1Motd') private readonly main1Motd!: TemplateRef<any>;
    /** The second MoTD */
    @ViewChild('main2Motd') private readonly main2Motd!: TemplateRef<any>;

    // /** The toolbar panel */
    // private readonly toolbar:
    //     Template = {gravity: 'header', id: 'top', template: 'top', extra: undefined};
    // /** The left sidebar panel */
    // private readonly leftSidebar:
    //     Template = {gravity: 'left', id: 'left', template: 'sideLeft', extra: undefined};
    // /** The right sidebar panel */
    // private readonly rightSidebar:
    //     Template = {gravity: 'right', id: 'right', template: 'sideRight', extra: undefined};

    // TODO: add a tagged template for making writing layouts easier?
    /** Layout of the main pane manager */
    public paneLayout: RootLayout<Motd|undefined> = new RootLayout(undefined);

    /** Helper function for making a MoTD pane */
    private motd(id: string, motd: TemplateRef<any>, title: string): Template {
        return {id, template: 'motd', extra: {motd, title}};
    }

    /** Set up the layout once the templates are ready */
    public ngAfterViewInit(): void { this.changeLayout(); }

    /** Add headerStyle to the template context */
    public header(mode: StringHeaderMode, title: string, icon: string|undefined, closable: boolean):
        PaneHeaderStyle {
        return headerStyle(mode, title, icon, closable);
    }

    /** Helper function to test re-rendering the layout when it changes */
    public changeLayout(): void {
        const layout = [
            new LeafLayout('top', 'top', undefined, LayoutGravity.Header),
            new LeafLayout('left', 'sideLeft', undefined, LayoutGravity.Left),
            new LeafLayout('right', 'sideRight', undefined, LayoutGravity.Right),
            loadLayout({
                gravity: 'main',
                split: 'horiz',
                ratio: [1, 1],
                children: [
                    this.motd('main1', this.main1Motd, 'Message the 1st'),
                    this.motd('main2', this.main2Motd, 'Message the 2th'),
                ],
            },
                       x => x),
            new LeafLayout('bottom1', 'bottom1', undefined, LayoutGravity.Bottom),
            new LeafLayout('bottom2', 'bottom2', undefined, LayoutGravity.Bottom),
            loadLayout({
                gravity: 'bottom',
                split: 'horiz',
                ratio: [1, 1],
                children: [
                    {id: 'bottom3l', template: 'bottom3', extra: undefined},
                    {id: 'bottom3r', template: 'bottom1', extra: undefined},
                ],
            },
                       x => x),
        ].reduce<RootLayout<Motd|undefined>|undefined>((root, pane) => {
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
