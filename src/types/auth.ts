export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
