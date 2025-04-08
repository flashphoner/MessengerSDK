import moment from 'moment';

export const getFormattedMessageListDate = (inputDate: number): string => {
  const currentDate = moment();
  const convertedInputDate = moment(inputDate);
  const yesterday = currentDate.clone().subtract(1, 'day');
  const lastWeek = currentDate.clone().subtract(1, 'week');

  if (convertedInputDate.isSame(currentDate, 'day')) {
    return `Today, ${convertedInputDate.format('h:mm A')}`;
  }

  if (convertedInputDate.isSame(yesterday, 'day')) {
    return `Yesterday, ${convertedInputDate.format('h:mm A')}`;
  }

  if (convertedInputDate.isAfter(lastWeek)) {
    return `${convertedInputDate.format('ddd, h:mm A')}`;
  }

  return convertedInputDate.format('MMM D, h:mm A');
};
