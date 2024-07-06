export const generateIcs = (data) => {
  const { title, description, start, end, location } = data;

  const formatTime = (date) =>
    date.toISOString().replace(/-|:|\.\d+/g, '') + 'Z';

  const formattedStart = formatTime(start);
  const formattedEnd = formatTime(end);

  const icsString = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${formattedStart}
DTEND:${formattedEnd}
END:VEVENT
END:VCALENDAR`;

  return icsString;
};
