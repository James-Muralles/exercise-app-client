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
    user: any; // Replace 'any' with the actual type of your user object
    token: string | null;
  };


  