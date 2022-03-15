import { AfterViewChecked, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Parameters } from '@app/classes/parameters';
import { CommunicationService } from '@app/services/communication.service';

const SEC_CONVERT = 60;

@Component({
    selector: 'app-game-setup-dialog',
    templateUrl: './game-setup-dialog.component.html',
    styleUrls: ['../../styles/dialogs.scss'],
})
export class GameSetupDialogComponent implements OnInit, AfterViewChecked {
    @ViewChild('nameInput', { static: false }) input: ElementRef;
    gameParametersForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<GameSetupDialogComponent>,
        public communicationService: CommunicationService,
        @Inject(MAT_DIALOG_DATA) public data: unknown,
    ) {}

    closeDialog() {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.gameParametersForm = this.formBuilder.group({
            playerName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]),
            minutes: new FormControl(1, [Validators.required]),
            seconds: new FormControl(0, [Validators.required]),
            dictionnary: new FormControl(0, [Validators.required]),
        });
    }

    ngAfterViewChecked() {
        this.input.nativeElement.focus();
    }

    async onSubmit() {
        for (const key of Object.keys(this.gameParametersForm.controls)) {
            if (!this.gameParametersForm.controls[key].valid) {
                return;
            }
        }

        const parameters = new Parameters();
        parameters.timer = this.gameParametersForm.value.minutes * SEC_CONVERT + this.gameParametersForm.value.seconds;
        parameters.dictionnary = this.gameParametersForm.value.dictionnary;
        await this.communicationService.createRoom(this.gameParametersForm.value.playerName, parameters, undefined);
        this.dialogRef.close();
    }
}
