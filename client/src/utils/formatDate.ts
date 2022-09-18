function formatDate(date: string) {
  return new Intl.DateTimeFormat().format(new Date(date));
}

export default formatDate;