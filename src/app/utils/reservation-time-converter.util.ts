export const timeConvert = (selectedDate: Date) => {
    selectedDate.setMinutes(
      selectedDate.getMinutes() - selectedDate.getTimezoneOffset()
    );
  
    const date = selectedDate.toISOString();
  
    const startTime = date;
    const end = new Date(selectedDate);
    end.setHours(end.getHours() + 9);
    const endTime = end.toISOString();
  
    return {date, startTime, endTime}
  };