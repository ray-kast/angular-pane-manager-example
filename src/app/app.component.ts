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

/** Editor configuration */
interface Editor {
    /** The editor title */
    title: string;
}

/** Extra data for every leaf */
type Extra = Motd|Editor|undefined;

/** Type alias for the pane template type for this component */
type Template = LayoutTemplate<Extra>;

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

    // TODO: add a tagged template for making writing layouts easier?
    /** Layout of the main pane manager */
    public paneLayout: RootLayout<Extra> = new RootLayout(undefined);

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
            new LeafLayout('editor1', 'editor', {title: 'Untitled-1'}, LayoutGravity.Main),
            new LeafLayout('editor2', 'editor', {title: 'Untitled-2'}, LayoutGravity.Main),
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
