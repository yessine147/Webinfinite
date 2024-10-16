import { Component, OnInit, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {

  @Input() title: string;
  @Input() value: string;
  @Input() icon: string;
  @Input() link: string

  constructor() { }

  ngOnInit() {
  }

}
