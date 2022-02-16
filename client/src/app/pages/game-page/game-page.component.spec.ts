import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { HelpInfoComponent } from '@app/components/help-info/help-info.component';
import { LetterRackComponent } from '@app/components/letter-rack/letter-rack.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { routes } from '@app/modules/app-routing.module';
import { GridService } from '@app/services/grid.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GamePageComponent } from './game-page.component';

const dialogMock = {
    close: () => {
        return;
    },
};

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent, ChatBoxComponent, LetterRackComponent, HelpInfoComponent],
            imports: [
                RouterTestingModule.withRoutes(routes),
                HttpClientTestingModule,
                FontAwesomeModule,
                MatCardModule,
                MatToolbarModule,
                MatIconModule,
                FormsModule,
            ],
            providers: [
                { provide: MatDialog, useValue: dialogMock },
                { provide: GridService, usevalue: {} },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(GamePageComponent);
        const router = TestBed.inject(Router);
        router.initialNavigation();
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call openConfirmation() when quit-game button clicked ', fakeAsync(() => {
        const quitGameSpy = spyOn(component, 'openConfirmation').and.callThrough();
        const button = fixture.debugElement.query(By.css('#quit-game'));
        button.nativeElement.click();
        tick();
        expect(quitGameSpy).toHaveBeenCalled();
    }));

    it('click on reducing font size of board should call reduceFont()', fakeAsync(() => {
        const reduceFontSpy = spyOn(component, 'reduceFont').and.callThrough();
        const button = fixture.debugElement.query(By.css('#reduce'));
        button.nativeElement.click();
        tick();
        expect(reduceFontSpy).toHaveBeenCalled();
    }));

    it('click on reset font size of board should call resetFont()', fakeAsync(() => {
        const resetFontSpy = spyOn(component, 'resetFont').and.callThrough();
        const button = fixture.debugElement.query(By.css('#reset'));
        button.nativeElement.click();
        tick();
        expect(resetFontSpy).toHaveBeenCalled();
    }));

    it('click on increasing font size of board should call increaseFont()', fakeAsync(() => {
        const increaseFontSpy = spyOn(component, 'increaseFont').and.callThrough();
        const button = fixture.debugElement.query(By.css('#increase'));
        button.nativeElement.click();
        tick();
        expect(increaseFontSpy).toHaveBeenCalled();
    }));

    it('click on ? button should call helpInfo()', fakeAsync(() => {
        const helpSpy = spyOn(component, 'helpInfo').and.callThrough();
        const button = fixture.debugElement.query(By.css('#help'));
        button.nativeElement.click();
        tick();
        expect(helpSpy).toHaveBeenCalled();
    }));
});
