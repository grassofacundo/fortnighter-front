class StringService {
    parseAsId(text: string) {
        const id = text.trim().replace(/\s/g, "-").toLowerCase();
        return id;
    }
}

const stringService = new StringService();
export default stringService;
