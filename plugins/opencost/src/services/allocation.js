import axios from 'axios';

class AllocationService {
  async fetchAllocation(baseUrl, win, aggregate, options) {
    const { accumulate, } = options;
    const params = {
      window: win,
      aggregate: aggregate,
      step: '1d',
    };
    if (typeof accumulate === 'boolean') {
      params.accumulate = accumulate;
    }

    console.log(`${baseUrl}/allocation/compute`, { params });
    const result = await axios.get(`${baseUrl}/allocation/compute`, { params });

    console.log(result.data);
    return result.data;
  }
}

export default new AllocationService();
