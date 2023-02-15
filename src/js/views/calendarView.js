import View from './View';
// CALENDAR
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import { calendarWeeKView } from '../config';
import { calendarMealOptions, calendarPopupForm, uuid } from '../config';

// POPUP
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

class CalendarView extends View {
  _parentElement = document.querySelector('.calendar');
  _message = 'Added to your meal plan. :)';

  _window = document.querySelector('.calendar-window');
  _overlay = document.querySelector('.overlay-cal');
  _btnOpen = document.querySelector('.nav__btn--calendar');
  _btnClose = document.querySelector('.btn--close-cal');
  calendar;

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._generateCalendar();
    this._calendarSetOptions();
    this._calendarSetEvents();

    //Keep calander up to edit
    // this.toggleWindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden-cal');
    this._overlay.classList.toggle('hidden-cal');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  _calendarSetOptions() {
    this.calendar.setOptions(calendarWeeKView);
    this.calendar.setOptions(calendarMealOptions);
    this.calendar.setOptions(calendarPopupForm);
  }

  _calendarSetEvents() {
    this.calendar.on('beforeCreateEvent', eventObj => {
      console.log(eventObj);
      this.calendar.createEvents([
        {
          id: uuid(),
          calendarId: eventObj.calendarId,
          title: eventObj.title,
          category: 'task',
          start: eventObj.start,
          end: eventObj.end,
        },
      ]);
    });

    this.calendar.on('beforeDeleteEvent', eventObj => {
      this.calendar.deleteEvent(eventObj.id, eventObj.calendarId);
    });

    this.calendar.on('beforeUpdateEvent', ({ event, changes }) => {
      console.log(event, changes);
      this.calendar.updateEvent(event.id, event.calendarId, changes);
    });
  }

  _generateCalendar() {
    const container = document.getElementById('calendar');
    const options = {
      defaultView: 'week',
      timezone: {
        zones: [
          {
            timezoneName: 'Asia/Tbilisi',
            displayLabel: 'Tbilisi',
          },
          {
            timezoneName: 'Europe/London',
            displayLabel: 'London',
          },
        ],
      },
      calendars: [
        {
          id: 'breakfast',
          name: 'Breakfast',
          backgroundColor: '#03bd9e',
        },
        {
          id: 'lunch',
          name: 'Lunch',
          backgroundColor: '#f2ff00',
        },
        {
          id: 'dinner',
          name: 'Dinner',
          backgroundColor: '#FF5733',
        },
      ],
    };

    this.calendar = new Calendar(container, options);
  }
}

export default new CalendarView();
