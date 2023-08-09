import { Component } from '@angular/core';
import { UsersApiService } from 'src/app/services/api-services/users-api.service';
import { CommunicationService } from 'src/app/services/comm.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(private commService: CommunicationService) {}

  blockUsers() {
    this.commService.say('block');
  }

  unblockUsers() {
    this.commService.say('unblock');
  }
}
