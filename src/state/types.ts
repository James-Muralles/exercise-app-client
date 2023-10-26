export interface LoginFormValues {
    username: string;
    password: string;
  }
export interface RegisterFormValues {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  }
  
export interface AuthState {
    user: any; 
    token: string | null;
    isAuthenticated: boolean;
  };



  