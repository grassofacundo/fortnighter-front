//#region Dependency list
import { Job } from "../classes/job/JobPosition";
import { Modifier } from "../classes/modifier/Modifier";
import { dbJobPositionType } from "../types/job/Position";
import FetchService from "./fetchService";
//#endregion

class JobService {
    url = `${import.meta.env.VITE_SERVER_DOMAIN}`;

    async getJobPositions(): Promise<dbJobPositionType[]> {
        const url = `${this.url}/job/get-all`;
        const response = await FetchService.fetchGet<dbJobPositionType[]>(url);
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

    parseAsJobPosition(dbJobPosition: dbJobPositionType): Job {
        const modifiers: Modifier[] = [];
        if (dbJobPosition.modifiers) {
            dbJobPosition.modifiers.forEach((m) =>
                modifiers.push(new Modifier(m))
            );
        }
        const job = new Job({
            ...dbJobPosition,
            nextPayment: new Date(dbJobPosition.nextPayment),
            lastPayment: new Date(dbJobPosition.lastPayment),
            modifiers: modifiers,
        });
        return job;
    }
}

const jobService = new JobService();
export default jobService;
