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

  const isFutureMonth = (monthIndex: number) => {
    return (
      selectedYear.value > currentYear ||
      (selectedYear.value === currentYear && monthIndex > currentMonth)
    );
  };

  const previousYear = () => {
    selectedYear.value--;
  };

  const nextYear = () => {
    if (selectedYear.value < currentYear) {
      selectedYear.value++;
    }
  };

  const selectMonth = (monthIndex: number) => {
    if (!isFutureMonth(monthIndex)) {
      selectedMonth.value = monthIndex;
    }
  };

  return {
    selectedMonth,
    selectedYear,
    currentMonth,
    currentYear,
    monthNames,
    isFutureMonth,
    previousYear,
    nextYear,
    selectMonth,
  };
};
