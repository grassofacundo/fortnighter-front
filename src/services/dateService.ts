class DateService {
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
}

const dateService = new DateService();
export default dateService;
