import { async, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
    beforeEach(async(() => {
        void TestBed.configureTestingModule({
            declarations: [AppComponent],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        void expect(app).toBeTruthy();
    });

    it("should have as title 'angular-pane-manager-example'", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        void expect(app.title).toEqual('angular-pane-manager-example');
    });

    it('should render title in a h1 tag', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        void expect(compiled.querySelector('h1').textContent).toContain(
            'Welcome to angular-pane-manager-example!',
        );
    });
});
