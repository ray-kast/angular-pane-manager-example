import {Component, OnInit} from '@angular/core';
import {loadLayout, PaneLayout, saveLayout} from 'projects/ng-pane-manager2/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    paneLayout: PaneLayout = loadLayout({
        split: 'horiz',
        ratio: [1.0 / 3.0, 1.0 / 3.0],
        children:
            [
                {id: 'left', template: 'test1'},
                {
                    split: 'vert',
                    ratio: 0.5,
                    children:
                        [
                            {id: 'midTop', template: 'test2'},
                            {id: 'midBottom', template: 'test3'},
                        ],
                },
                {id: 'right', template: 'test2'},
            ],
    });

    ngOnInit() { console.log(saveLayout(this.paneLayout)); }
}
