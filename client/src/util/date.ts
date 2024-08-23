// NOTE: consider server-side method in /server/src/util/date.ts

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date));
};

export const formatDateOnly = (date: Date) => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'long',
  }).format(new Date(date));
};

export const formatTimeOnly = (date: Date) => {
  return new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
  }).format(new Date(date));
};
