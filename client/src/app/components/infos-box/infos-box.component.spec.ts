import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerId } from '@app/classes/room';
import { CommunicationService } from '@app/services/communication.service';
import { GameContextService } from '@app/services/game-context.service';
import { BehaviorSubject } from 'rxjs';
import { InfosBoxComponent } from './infos-box.component';

class GameContextServiceMock {
    isMyTurn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    myId: PlayerId | undefined;
    getId(): PlayerId | undefined {
        return this.myId;
    }
}

describe('InfosBoxComponent', () => {
    let component: InfosBoxComponent;
    let fixture: ComponentFixture<InfosBoxComponent>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    // let gameContextServiceSpy: jasmine.SpyObj<GameContextService>;
    const gameService = new GameContextServiceMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InfosBoxComponent],
            providers: [
                { provide: CommunicationService, useValue: communicationServiceSpy },
                { provide: GameContextService, useClass: GameContextServiceMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getId']);
        fixture = TestBed.createComponent(InfosBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // TO-DO
    fit('should create', () => {
        expect(component).toBeTruthy();
        gameService.getId();
    });

    // it('should call reset', () => {
    //     const resetSpy = spyOn(component, 'reset');
    //     component.ngAfterViewInit();
    //     expect(resetSpy).toHaveBeenCalled();
    // });
});
