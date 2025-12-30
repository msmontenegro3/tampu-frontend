import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-medals',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './medals.component.html',
  styleUrl: './medals.component.css',
})
export class MedalsComponent {
  /* ICONS */

  gearIcon = faGear;
}
