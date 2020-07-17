// tslint:disable no-implicit-dependencies no-magic-numbers
import {Component} from '@angular/core';
import {
    headerStyle,
    loadLayout,
    PaneHeaderStyle,
    RootLayout,
    StringHeaderMode,
} from 'projects/angular-pane-manager/src/public-api';

/** Root component of the app */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    // TODO: add a tagged template for making writing layouts easier?
    /** Layout of the main pane manager */
    public paneLayout:
        RootLayout<string> =
            loadLayout(
                {
                    split: 'vert',
                    ratio: [1, 4],
                    children:
                        [
                            {gravity: 'top', id: 'top', template: 'top', extra: 'top'},
                            {
                                split: 'horiz',
                                ratio: [1, 3, 1],
                                children:
                                    [
                                        {
                                            gravity: 'left',
                                            id: 'left',
                                            template: 'sideLeft',
                                            extra: 'left',
                                        },
                                        {
                                            split: 'vert',
                                            ratio: [2, 1],
                                            children:
                                                [
                                                    {
                                                        gravity: 'center',
                                                        split: 'horiz',
                                                        ratio: [1, 1],
                                                        children:
                                                            [
                                                                {
                                                                    id: 'main1',
                                                                    template: 'main1',
                                                                    extra: 'main1',
                                                                },
                                                                {
                                                                    id: 'main2',
                                                                    template: 'main2',
                                                                    extra: 'main2',
                                                                },
                                                            ],
                                                    },
                                                    {
                                                        gravity: 'bottom',
                                                        split: 'tab',
                                                        currentTab: 0,
                                                        children:
                                                            [
                                                                {
                                                                    id: 'bottom1',
                                                                    template: 'bottom1',
                                                                    extra: 'bottom1',
                                                                },
                                                                {
                                                                    id: 'bottom2',
                                                                    template: 'bottom2',
                                                                    extra: 'bottom2',
                                                                },
                                                                {
                                                                    split: 'horiz',
                                                                    ratio: [1, 1],
                                                                    children:
                                                                        [
                                                                            {
                                                                                id: 'bottom3l',
                                                                                template: 'bottom3',
                                                                                extra: 'bottom3l',
                                                                            },
                                                                            {
                                                                                id: 'bottom3r',
                                                                                template: 'bottom1',
                                                                                extra: 'bottom3r',
                                                                            },
                                                                        ],
                                                                },
                                                            ],
                                                    },
                                                ],
                                        },
                                        {
                                            gravity: 'right',
                                            id: 'right',
                                            template: 'sideRight',
                                            extra: 'right',
                                        },
                                    ],
                            },
                        ],
                },
                x => x)
                .intoRoot();

    /** Add headerStyle to the template context */
    public header(mode: StringHeaderMode, title: string, icon: string, closable: boolean):
        PaneHeaderStyle {
        return headerStyle(mode, title, icon, closable);
    }

    /** Helper function to test re-rendering the layout when it changes */
    public changeLayout(): void {
        this.paneLayout =
            loadLayout({
                split: 'vert',
                ratio: [1, 5],
                children: [
                    {gravity: 'top', id: 'top', template: 'top', extra: 'TOP'},
                    {
                        split: 'horiz',
                        ratio: [1, 3, 1],
                        children: [
                            {gravity: 'left', id: 'left', template: 'sideLeft', extra: 'LEFT'},
                            {
                                split: 'vert',
                                ratio: [2, 1],
                                children: [
                                    {
                                        gravity: 'center',
                                        split: 'tab',
                                        currentTab: 0,
                                        children: [
                                            {id: 'main1', template: 'main1', extra: 'MAIN1'},
                                            {id: 'main2', template: 'main2', extra: 'MAIN2'},
                                        ],
                                    },
                                    {
                                        gravity: 'bottom',
                                        split: 'tab',
                                        currentTab: 0,
                                        children: [
                                            {id: 'bottom1', template: 'bottom1', extra: 'BOTTOM1'},
                                            {id: 'bottom2', template: 'bottom2', extra: 'BOTTOM2'},
                                            {
                                                split: 'horiz',
                                                ratio: [1, 1],
                                                children: [
                                                    {
                                                        id: 'bottom3l',
                                                        template: 'bottom3',
                                                        extra: 'BOTTOM3L',
                                                    },
                                                    {
                                                        id: 'bottom3r',
                                                        template: 'bottom1',
                                                        extra: 'BOTTOM3R',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                gravity: 'right',
                                id: 'right',
                                template: 'sideRight',
                                extra: 'RIGHT',
                            },
                        ],
                    },
                ],
            },
                       x => x)
                .intoRoot();
    }
}
