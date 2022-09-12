export function getDateFromString(s: string) {
  const [date, time] = s?.split(" ");
  const [day, month, year] = date?.split(".");
  const [hours, minutes] = time?.split(":");
  return new Date(
    Number(year),
    Number(month),
    Number(day),
    Number(hours),
    Number(minutes),
    0,
    0
  );
}
