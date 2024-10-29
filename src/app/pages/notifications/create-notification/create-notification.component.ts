import { Component } from '@angular/core';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrl: './create-notification.component.css'
})
export class CreateNotificationComponent {
  breadCrumbItems: Array<{}>;

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Notifications' }, { label: 'Add notification', active: true }];
  }
}
