export interface User  {
  _id: string; 
  firstName: string;
  lastName: string;
  username: string;
  password: string; 
};

export interface WorkoutTemplate  {
  name: string;
  exercises: Exercise[];
  user: string; 
};

export interface WorkoutSession {
  name: string;
  templateId: string;
  user: string ;
  exercises: [];
  completed: boolean;

}

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
    [x: string]: any;
    name: string; 
    type: string;
    muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
    exerciseId: number;
  }
  
export interface AuthState {
    user:User | any;
    token: string | null;
    isAuthenticated: boolean;
    workoutTemplates: WorkoutTemplate[];
    workoutSessions: WorkoutSession[];
  
  };

  
