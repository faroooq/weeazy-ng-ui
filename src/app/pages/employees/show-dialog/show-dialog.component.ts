import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-show-dialog',
  templateUrl: 'show-dialog.component.html',
  styleUrls: ['show-dialog.component.scss'],
})
export class ShowDialogComponent {

  constructor(protected ref: NbDialogRef<ShowDialogComponent>) { }

  cancel() {
    this.ref.close(false);
  }

  submit() {
    this.ref.close(true);
  }
}
