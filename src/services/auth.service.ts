'use client';

import axios from 'axios';
import axiosInstance from '@/services/axiosInstance';

interface SignupDto {
  username: string;
  email: string;
  password: string;
  roleName: "user";
}


export const signup = async (dto: SignupDto) => {
  try {
    // Gửi thẳng 4 field
    const res = await axiosInstance.post("/auth/signup", dto);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
    throw new Error("Signup failed");
  }
};

export const login = async (username: string, password: string): Promise<string> => {
  try {
    const res = await axiosInstance.post('/auth/login', { username, password });
    return res.data.access_token;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('Login failed');
  }
};

// Optional: getProfile
export const getProfile = async (token: string) => {
  try {
    const res = await axiosInstance.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Cannot fetch profile');
    }
    throw new Error('Cannot fetch profile');
  }
};
