import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Crafted with <span style="color: #FF3D71">♥</span> by <b><a href="https://www.stackmi.com/about" target="_blank">Farooq</a></b>
    </span>
    <div class="socials">
      <a href="https://www.youtube.com/c/stackmisolutions" target="_blank" class="ion ion-social-youtube"></a>
      <a href="https://www.facebook.com/stackmisolutions" target="_blank" class="ion ion-social-facebook"></a>
      <a href="https://stackmi.medium.com/" target="_blank" class="ion ion-social-twitter"></a>
      <a href="https://www.linkedin.com/company/stackmisolutions" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
