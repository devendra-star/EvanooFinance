import { axiosPrivate } from '../axios';
import { CONTENT_TYPE_JSON } from '../configs';

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerData {
  userId?: number;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  permanentAddress?: Address;
  currentAddress?: Address;
}

export default class CustomerService {
  static registerCustomer = async (payload: CustomerData) => {
    try {
      const response = await axiosPrivate.put('/customers/register', payload, {
        headers: { 'Content-Type': CONTENT_TYPE_JSON },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  static lookupCustomer = async (identifier: string) => {
    try {
      const params = { mobile: identifier };
      const response = await axiosPrivate.get('/customers/lookup', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}
