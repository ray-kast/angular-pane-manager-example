import {Component, Input, TemplateRef} from '@angular/core';

/**
 * Represents a message - just for you!
 */
@Component({
    selector: 'app-motd',
    templateUrl: './motd.component.html',
    styleUrls: ['./motd.component.scss'],
})
export class MotdComponent {
    /** The template to render */
    @Input() public motd: TemplateRef<any>|undefined;
}
