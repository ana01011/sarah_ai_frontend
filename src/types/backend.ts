export type UserRole = 'ADMIN' | 'SELLER' | 'CUSTOMER';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// **************Based on SellerRegisterRequest ***************
export interface SellerRegisterRequest {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  store_name: string;
  store_address: string;
  store_description?: string;
  business_license?: string;
  gst_number?: string;
  bank_account_number?: string;
  bank_ifsc_code?: string;
}