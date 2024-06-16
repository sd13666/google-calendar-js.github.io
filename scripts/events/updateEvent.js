import { getItem } from '../common/storage.js';
import { updateEvent, serverUrl } from '../common/gateways.js';
import { closePopup } from '../common/popup.js';
import { openModal, closeModal } from '../common/modal.js';
import { getDateTime } from '../common/utils.js';
import { renderEvents } from './events.js';
import { onCloseEventForm } from './createEvent.js';

const editEventBtn = document.querySelector('.events-btn__edit-btn');

const fillForm = (event) => {
  const { title, description, start, end, date } = event;

  const titleInput = document.querySelector('input[name="title"]');
  const descriptionInput = document.querySelector(
    'textarea[name="description"]'
  );
  const dateInput = document.querySelector('input[name="date"]');
  const startTimeInput = document.querySelector('input[name="startTime"]');
  const endTimeInput = document.querySelector('input[name="endTime"]');

  const get24HourTime = (dateObj) => {
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const startTime = get24HourTime(new Date(start));
  const endTime = get24HourTime(new Date(end));

  titleInput.value = title;
  descriptionInput.value = description;
  dateInput.value = date;
  startTimeInput.value = startTime;
  endTimeInput.value = endTime;
};

export const onEventUpdate = async () => {
  console.log('onEventUpdate called');

  const eventIdToUpdate = getItem('eventIdToDelete');
  console.log('eventIdToUpdate:', eventIdToUpdate);

  const response = await fetch(`${serverUrl}/${eventIdToUpdate}`);
  console.log('Response from fetch:', response);

  const event = await response.json();
  console.log('Event:', event);

  closePopup();
  openModal();
  fillForm(event);

  const form = document.querySelector('.event-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log('Form submit event');

    const formData = new FormData(form);
    const { startTime, endTime, date, ...rest } = Object.fromEntries(
      formData.entries()
    );
    console.log('Form data:', rest);

    const eventDetails = {
      ...rest,
      date,
      start: getDateTime(date, startTime),
      end: getDateTime(date, endTime)
    };
    console.log('Event details:', eventDetails);

    const response = await updateEvent(eventIdToUpdate, {
      ...event,
      ...eventDetails
    });

    if (response.ok) {
      console.log('Event updated successfully');
      await renderEvents();
      closeModal();
    } else {
      console.error('Failed to update the event:', response.statusText);
    }
  });
};

export const initEditEvent = () => {
  editEventBtn.addEventListener('click', () => {
    onEventUpdate();
    document.querySelector('.event-form__submit-btn').textContent = 'Edit';
  });
};