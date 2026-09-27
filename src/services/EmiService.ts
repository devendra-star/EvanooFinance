import { axiosPrivate } from '../axios';
import { CONTENT_TYPE_JSON } from '../configs';

export default class EmiService {
  static calculateEmi = async (payload: {
    loanAmount: number;
    interestRate: number;
    tenure: number;
  }) => {
    try {
      const response = await axiosPrivate.post('/emi/calculate', payload, {
        headers: { 'Content-Type': CONTENT_TYPE_JSON },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}
