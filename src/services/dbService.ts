import FetchService from "./fetchService";

class DbService {
    url = `${import.meta.env.VITE_SERVER_DOMAIN}`;

    init() {
        console.log("Nothing to initialize");
    }

    async createJobPosition(
        newJobPosition: newJobPosition
    ): Promise<EventReturn> {
        let response: EventReturn = {
            ok: false,
            status: 500,
            errorMessage: "Couldn't create job position",
        };

        try {
            const url = `${this.url}/job/create`;
            const method = "PUT";
            const body = { newJobPosition };
            response = await FetchService.fetchPost({
                url,
                method,
                body,
            });
        } catch (error) {
            console.error(error);
        }
        return response;
    }

    async getJobPositions(): Promise<EventReturn> {
        let response: EventReturn = {
            ok: false,
            status: 500,
            errorMessage: "Couldn't create job position",
        };

        const url = `${this.url}/job/get-all`;
        response = await FetchService.fetchGet(url);
        return response;
    }

    // async updateShift(
    //     shift: shift,
    //     jobPosition: string
    // ): Promise<FirebaseEventReturn> {
    //     const response: FirebaseEventReturn = {
    //         ok: true,
    //         errorMessage: "",
    //         content: null,
    //     };

    //     this.checkCollectionName(response);

    //     if (!response.errorMessage) {
    //         await setDoc(
    //             doc(this.getDb(), collectionName as string, jobPosition),
    //             {
    //                 date: shift.date,
    //                 timeWorked: shift.timeWorked,
    //                 isSaturday: shift.isSaturday,
    //                 isSunday: shift.isSunday,
    //                 isHoliday: shift.isHoliday,
    //                 hoursWorked: {
    //                     from: shift.hoursWorked.from,
    //                     to: shift.hoursWorked.to,
    //                 },
    //             }
    //         )
    //             .then((resp) => (response.content = resp))
    //             .catch((error) => {
    //                 response.ok = false;
    //                 response.errorMessage = error.message;
    //             });
    //     }

    //     return response;
    // }
}

const dbService = new DbService();
export default dbService;
