import {Component, OnInit} from '@angular/core';
import {loadLayout, PaneLayout, saveLayout} from 'projects/angular-pane-manager/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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

    ngOnInit() {
        console.log(saveLayout(this.paneLayout));
        console.log(saveLayout(
            loadLayout({
                split: 'horiz',
                ratio: [1, 1],
                children: [
                    {id: 'fucc', template: 'fucc'},
                    {
                        split: 'horiz',
                        ratio: [2, 3],
                        children:
                            [{id: 'fucc2', template: 'fucc'}, {id: 'fucc3', template: 'fucc'}],
                    },
                ],
            }).simplifyDeep()!));
    }
}
