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

  export interface GetExercisesResponse {
    name: string;
    type: string;
    muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
    id: number;
  }
  



  