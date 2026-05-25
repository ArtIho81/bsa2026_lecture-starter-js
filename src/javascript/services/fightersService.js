import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    async getFighters(endpoint = this.#endpoint) {
        try {
            const apiResult = await callApi(endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        // todo: implement this method
        const result = await this.getFighters(`details/fighter/${id}.json`);
        return result;
    }
}

const fighterService = new FighterService();

export default fighterService;
