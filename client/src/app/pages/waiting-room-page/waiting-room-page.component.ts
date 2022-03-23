import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SoloDialogComponent } from '@app/components/solo-dialog/solo-dialog.component';
import { CommunicationService } from '@app/services/communication.service';

@Component({
    selector: 'app-waiting-room-page',
    templateUrl: './waiting-room-page.component.html',
    styleUrls: ['./waiting-room-page.component.scss'],
})
export class WaitingRoomPageComponent {
    canControl: boolean;
    isMainPlayer: boolean;
    otherPlayerName: string | undefined;

    constructor(public communicationService: CommunicationService, public matDialog: MatDialog, public route: ActivatedRoute) {
        this.communicationService.selectedRoom.subscribe(async (room) => {
            this.isMainPlayer = this.communicationService.getId()?.value === room?.mainPlayer.id;
            this.otherPlayerName = room?.otherPlayer?.name;

            const hasOtherPlayer = room?.otherPlayer !== undefined;
            this.canControl = hasOtherPlayer && this.isMainPlayer;
        });
    }

    openSoloDialog() {
        this.matDialog.open(SoloDialogComponent, { data: { mode: this.route.snapshot.url[0] } });
    }
}
