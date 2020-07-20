import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MotdComponent} from './motd.component';

describe('MotdComponent', () => {
    let component: MotdComponent;
    let fixture: ComponentFixture<MotdComponent>;

    beforeEach(async(() => {
        void TestBed.configureTestingModule({declarations: [MotdComponent]}).compileComponents();
    }));

    beforeEach(() => {
        fixture   = TestBed.createComponent(MotdComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => { void expect(component).toBeTruthy(); });
});
