import {Component, OnInit} from '@angular/core';
import {loadLayout, PaneLayout, saveLayout} from 'projects/ng-pane-manager2/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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
                                gravity: 'center',
                                split: 'vert',
                                ratio: [2, 1],
                                children:
                                    [
                                        {id: 'main', template: 'main'},
                                        {
                                            gravity: 'bottom',
                                            split: 'tab',
                                            currentTab: 0,
                                            children:
                                                [
                                                    {id: 'bottom1', template: 'bottom1'},
                                                    {id: 'bottom2', template: 'bottom2'}
                                                ]
                                        },
                                    ],
                            },
                            {gravity: 'right', id: 'right', template: 'sideRight'},
                        ],
                }
            ]
    });

    ngOnInit() { console.log(saveLayout(this.paneLayout)); }
}
