import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.css',
})
export class FaqsComponent implements OnInit {
  constructor(protected userService: UserService) {}

  faqs: { number: string; title: string; description: string }[] = [];

  ngOnInit(): void {
    this.faqs = [
      {
        number: '01',
        title: 'Overview',
        description:
          `  DeskSync is a user-friendly Hot Desk Booking System that streamlines the process of reserving workspaces in your office environment. Whether you are remote worker or an office employee, DeskSync helps you find and book available hot desks efficiently.`,
      },{
        number: '02',
        title: 'Benefits of Hot Desk Booking',
        description:
          `Hot desk booking offers advantages such as increased flexibility, cost-effectiveness, and opportunities for networking and collaboration. It allows users to choose their workspace based on their needs for the day.`,
      },
      {
        number: '03',
        title: 'How do I book a hot desk using DeskSync?',
        description:
          'On the booking page, choose an area of the office then select an available desk and confirm your booking. For a more detailed step-by-step guide, visit the guide section.',
      },
      {
        number: '04',
        title: 'Can I book a hotdesk for multiple days in advance?',
        description:
          'Yes, you can book a hotdesk for multiple days in advance. Our system allows you to schedule hotdesk reservations for future dates, providing flexibility for your workspace needs. Please note that you can only book for tomorrow onwards and up to a two-week span from today.',
      },
      {
        number: '05',
        title:
          'Is there a limit to the number of hotdesks I can reserve at once?',
        description:
          'Yes, there is a limit to the number of hotdesks you can reserve at once. You can make only one booking per day.',
      },
      {
        number: '06',
        title: 'What happens if I arrive late for my hotdesk reservation?',
        description:
          'If you arrive late for your hotdesk reservation, you can still use the desk for the remaining time of your booking. However, please be mindful of other users and adhere to your scheduled time to ensure a smooth experience for everyone.',
      },
      {
        number: '07',
        title: 'Can I customize my desk preferences with DeskSync?',
        description:
          'Users may only be able to choose available desks in their location preference but the amenities are handled by the eMachine management.',
      },
      {
        number: '08',
        title: 'Can I book meeting rooms through DeskSync?',
        description:
          'Individual desks are only catered in DeskSync, booking conference rooms, breakout rooms, or such are handled by the eMachine management.',
      },
      {
        number: '09',
        title: "What happens if I don't show up for my booked hot desk?",
        description:
          "An administrator will abort your reservation to make it available for booking if necessary. However, if you're just going to be late, you can send a message to the administrator.",
      },
      {
        number: '10',
        title:
          'How do I get support for issues or questions related to DeskSync?',
        description:
          'DeskSync has a dedicated user support page where guides and helpdesk are found.',
      },
    ];
  }
}
