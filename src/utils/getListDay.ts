export const getNextDays = (numDays: number) => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i <= numDays; i++) {
    const nextDay = new Date();
    nextDay.setDate(today.getDate() + i);

    const formattedDate = nextDay.toISOString().split("T")[0];

    dates.push(formattedDate);
  }

  return dates;
};
