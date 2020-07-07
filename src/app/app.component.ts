import {Component} from '@angular/core';
import {
    loadLayout,
    PaneLayout,
    paneProps,
    StringHeaderMode,
} from 'projects/angular-pane-manager/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    // TODO: add a tagged template for making writing layouts easier?
    // TODO: fix completed-docs tslint rule
    paneLayout: PaneLayout = loadLayout({
        split: 'vert',
        ratio: [1, 4],
        children:
            [
                {gravity: 'top', id: 'top', template: 'top'},
                {
                    split: 'horiz',
                    ratio: [1, 3, 1],
                    children:
                        [
                            {gravity: 'left', id: 'left', template: 'sideLeft'},
                            {
                                split: 'vert',
                                ratio: [2, 1],
                                children:
                                    [
                                        {
                                            gravity: 'center',
                                            split: 'tab',
                                            currentTab: 0,
                                            children:
                                                [
                                                    {id: 'main1', template: 'main1'},
                                                    {id: 'main2', template: 'main2'},
                                                ],
                                        },
                                        {
                                            gravity: 'bottom',
                                            split: 'tab',
                                            currentTab: 0,
                                            children:
                                                [
                                                    {id: 'bottom1', template: 'bottom1'},
                                                    {id: 'bottom2', template: 'bottom2'},
                                                    {
                                                        split: 'horiz',
                                                        ratio: [1, 1],
                                                        children:
                                                            [
                                                                {
                                                                    id: 'bottom3l',
                                                                    template: 'bottom3',
                                                                },
                                                                {
                                                                    id: 'bottom3r',
                                                                    template: 'bottom1',
                                                                },
                                                            ],
                                                    },
                                                ],
                                        },
                                    ],
                            },
                            {gravity: 'right', id: 'right', template: 'sideRight'},
                        ],
                },
            ],
    });

    protected props(mode: StringHeaderMode, title: string, icon: string, closable: boolean) {
        return paneProps(mode, title, icon, closable);
    }
}
