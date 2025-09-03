export const usePeriod = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const selectedMonth = useState<number>("period-month", () => currentMonth);
  const selectedYear = useState<number>("period-year", () => currentYear);

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
      new Date(2000, i)
    )
  );

  const isFutureMonth = (monthIndex: number, year = selectedYear.value) => {
    return (
      year > currentYear || (year === currentYear && monthIndex > currentMonth)
    );
  };

  const selectMonth = (monthIndex: number, year: number) => {
    if (!isFutureMonth(monthIndex, year)) {
      selectedMonth.value = monthIndex;
      selectedYear.value = year;
    }
  };

  return {
    selectedMonth,
    selectedYear,
    currentMonth,
    currentYear,
    monthNames,
    isFutureMonth,
    selectMonth,
  };
};
