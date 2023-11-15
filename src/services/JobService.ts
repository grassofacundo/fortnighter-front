//#region Dependency list
import { eventReturn } from "../types/database/databaseTypes";
import { jobPosition, newJobPosition } from "../types/job/Position";
import FetchService from "./fetchService";
//#endregion

class JobService {
    url = `${import.meta.env.VITE_SERVER_DOMAIN}`;

    init() {
        console.log("Nothing to initialize");
    }

    /**
     * Create a new job position in the database
     *
     * @param newJobPosition - An object following the newJobPosition interface structure
     * @returns An eventReturn return object. If ok, the content will be a jobPosition object.
     */
    async createJobPosition(
        newJobPosition: newJobPosition
    ): Promise<eventReturn<jobPosition>> {
        const url = `${this.url}/job/create`;
        const method = "PUT";
        const body = { ...newJobPosition };
        const response = await FetchService.fetchPost<jobPosition>({
            url,
            method,
            body,
        });
        return response;
    }

    async getJobPositions(): Promise<jobPosition[]> {
        const url = `${this.url}/job/get-all`;
        const response = await FetchService.fetchGet<jobPosition[]>(url);
        if (
            FetchService.isOk(response) &&
            response.content &&
            response.content.length > 0
        ) {
            const jobList = response.content.map((job) => {
                return { ...job };
            });
            return jobList;
        } else {
            return [];
        }
    }

    // async updateShift(
    //     shift: shift,
    //     jobPosition: string
    // ): Promise<> {
    //     const response:  = {
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

const jobService = new JobService();
export default jobService;
