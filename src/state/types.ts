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

  export interface Exercise {
    Name: string;
    type: string;
    muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
    exerciseId: number;
  } 
  
export interface AuthState {
    user: any; 
    token: string | null;
    isAuthenticated: boolean;
    exercises: Exercise[];
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
  



  