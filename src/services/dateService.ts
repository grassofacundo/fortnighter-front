class DateService {
    getToday(): Date {
        const date = new Date();
        return date;
    }

    getPastDate(daysInThePast: number): Date {
        const today = this.getToday();
        const pastDate = new Date(today.getDate() - daysInThePast);
        return pastDate;
    }

    getStr(date: Date): string {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    getDateAsInputValue(date: Date): string {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${date.getFullYear()}-${month > 9 ? month : `0${month}`}-${
            day > 9 ? day : `0${day}`
        }`;
    }

    setHour(date: Date, startTimeHour: number): Date {
        const startTime = new Date(date);
        startTime.setHours(startTimeHour);
        return startTime;
    }
}

const dateService = new DateService();
export default dateService;
