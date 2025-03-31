"use client"
import { useState } from 'react';
import styles from './index.module.css';

interface DayInfo {
  dayName: string;
  date: number;
  month: number;
  year: number;
  fullDate: Date;
}

interface DateSelectorProps {
  onDateSelect: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthYearString = currentMonth.toLocaleString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

  const prevMonth = (): void => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = (): void => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const generateWeekDays = (): DayInfo[] => {
    const today = new Date();
    const days: DayInfo[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
 
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      days.push({
        dayName: dayNames[date.getDay()],
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        fullDate: new Date(date)
      });
    }
    
    return days;
  };

  const weekDays = generateWeekDays();

  const handleDateSelect = (day: DayInfo): void => {
    setSelectedDate(day.fullDate);
    
    if (onDateSelect) {
      onDateSelect(day.fullDate);
    }
  };

  return (
    <div className={styles.dateSelector}>
      <div className={styles.monthSelector}>
        <button onClick={prevMonth} className={styles.navButton}>
          <span>&#8249;</span>
        </button>
        <span className={styles.monthYearText}>{monthYearString}</span>
        <button onClick={nextMonth} className={styles.navButton}>
          <span>&#8250;</span>
        </button>
      </div>

      <div className={styles.weekDaySelector}>
        {weekDays.map((day, index) => (
          <div 
            key={index}
            className={`${styles.dayContainer} ${
              selectedDate && 
              selectedDate.getDate() === day.date && 
              selectedDate.getMonth() === day.month ? 
              styles.selectedDay : ''
            }`}
            onClick={() => handleDateSelect(day)}
          >
            <div className={styles.dayName}>{day.dayName}</div>
            <div className={styles.date}>{day.date} {day.month !== currentMonth.getMonth() ? 
              new Date(day.year, day.month, 1).toLocaleString('default', { month: 'short' }) : ''}
            </div>
          </div>
        ))}
        <button className={styles.moreButton}>
          <span>&#8250;</span>
        </button>
      </div>
    </div>
  );
};

export default DateSelector;