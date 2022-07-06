import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SanitizeHtmlPipe } from '../@theme/pipes/sanitize-html.pipe';
import { TimeAgoExtendsPipe } from '../@theme/pipes/time-ago-extends.pipe';
import { TruncatePipe } from '../@theme/pipes/truncate.pipe';
import { TruncateTextPipe } from '../@theme/pipes/truncate.text.pipe';

/**
 * Shared Module
 */
@NgModule({
  declarations: [
    TimeAgoExtendsPipe,
    TruncatePipe,
    TruncateTextPipe,
    SanitizeHtmlPipe,
    TimeAgoExtendsPipe
  ],
  exports: [
    TimeAgoExtendsPipe,
    TruncatePipe,
    TruncateTextPipe,
    SanitizeHtmlPipe,
    TimeAgoExtendsPipe
  ],
  imports: [CommonModule],
})
export class SharedModule { }