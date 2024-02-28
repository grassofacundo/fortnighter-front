export type timeParams = { date: Date; hour?: number; minutes?: number };
export type dateParts = { year: year; month: monthStr; day: dayStr };

type oneYear = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type year = `${oneYear}${oneYear}${oneYear}${oneYear}`;
export type monthStr = `${monthNum}`;
export type monthNum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type dayStr = `${dayNum}`;
export type dayNum =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31;
export type hourNum =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23;
export type minuteNum = 0 | 30;
