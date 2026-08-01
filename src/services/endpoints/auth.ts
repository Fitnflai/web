import axios from 'axios';

export interface LoginResponse {
  user: {
    id_usuario: string;
    email: string;
    apodo: string;
    registro_activo: boolean;
  };
  token: {
    access_token: string;
    token_type: string;
  };
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);

    // Using raw axios to prevent any Content-Type merging conflicts or 
    // global interceptor interference during authentication.
    const baseUrl = import.meta.env.VITE_API_URL || 'https://apifitnflai.com';
    const { data } = await axios.post<LoginResponse>(`${baseUrl}/auth/login`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  },
};
