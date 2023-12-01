//#region Dependency list
import { eventReturn } from "../types/database/databaseTypes";
import { jobPosition, newJobPosition, shiftBase } from "../types/job/Position";
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
}

const jobService = new JobService();
export default jobService;
