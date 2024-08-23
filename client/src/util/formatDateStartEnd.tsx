// NOTE: consider server-side method in /server/src/util/formatEventDateStartEnd.ts
import { formatDate, formatDateOnly, formatTimeOnly } from './date';

export const formatEventDateStartEnd = (startDate: Date, endDate: Date) => {
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  // validate
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const sameDay = startDate.getDate() === endDate.getDate();

  if (sameYear && sameMonth && sameDay) {
    // example: August 24, 2024, 12:45 AM - 4:45 AM
    return `${formatDateOnly(startDate)}, ${formatTimeOnly(startDate)} - ${formatTimeOnly(endDate)}`;
  }

  // example: August 31, 2024 at 11:30 PM - September 1, 2024 at 1:30 AM
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};
