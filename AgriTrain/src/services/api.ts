const API_BASE_URL = 'http://localhost:8000';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Scenario {
  id: number;
  title: string;
  description: string;
  scenario_type: string;
  duration_minutes: number;
  difficulty_level: string;
  image_url?: string;
  panorama_url?: string;
  learning_objectives?: string[];
  prerequisites?: number[];
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface Quiz {
  id: number;
  scenario_id: number;
  title: string;
  description?: string;
  questions: Question[];
  passing_score: number;
  time_limit_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: number;
  user_id: number;
  quiz_id: number;
  answers: number[];
  score: number;
  is_passed: boolean;
  time_taken_minutes?: number;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

export interface UserProgress {
  id: number;
  user_id: number;
  scenario_id: number;
  completion_percentage: number;
  is_completed: boolean;
  last_accessed_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
  session_id: number;
}

export interface UserSession {
  id: number;
  user_id: number;
  session_token: string;
  login_time: string;
  last_activity: string;
  logout_time?: string;
  is_active: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    console.log('Making request to:', url);
    console.log('Request options:', { method: options.method || 'GET', headers });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Request failed:', errorData);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    
    this.token = response.access_token;
    localStorage.setItem('auth_token', response.access_token);
    return response;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response = await this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/me');
    return response;
  }

  async logout(): Promise<void> {
    if (this.token) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // User session methods
  async getUserSessions(userId: number): Promise<UserSession[]> {
    const response = await this.request<UserSession[]>(`/users/${userId}/sessions`);
    return response;
  }

  async getActiveUserSessions(userId: number): Promise<UserSession[]> {
    const response = await this.request<UserSession[]>(`/users/${userId}/sessions/active`);
    return response;
  }

  // Scenario methods
  async getScenarios(): Promise<Scenario[]> {
    console.log('Fetching scenarios from:', `${this.baseURL}/scenarios`);
    const response = await this.request<Scenario[]>('/scenarios');
    console.log('Scenarios response:', response);
    return response;
  }

  async getScenario(id: number): Promise<Scenario> {
    const response = await this.request<Scenario>(`/scenarios/${id}`);
    return response;
  }

  // Quiz methods
  async getScenarioQuiz(scenarioId: number): Promise<Quiz> {
    const response = await this.request<Quiz>(`/scenarios/${scenarioId}/quiz`);
    return response;
  }

  async submitQuizAttempt(attempt: {
    quiz_id: number;
    answers: number[];
    completed_at?: string;
  }): Promise<QuizAttempt> {
    const response = await this.request<QuizAttempt>('/quiz-attempts', {
      method: 'POST',
      body: JSON.stringify(attempt),
    });
    return response;
  }

  async getUserQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    const response = await this.request<QuizAttempt[]>(`/users/${userId}/quiz-attempts`);
    return response;
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    const response = await this.request<UserProgress[]>(`/users/${userId}/progress`);
    return response;
  }

  async updateUserProgress(
    userId: number,
    scenarioId: number,
    completionPercentage: number
  ): Promise<UserProgress> {
    const response = await this.request<UserProgress>(`/users/${userId}/progress`, {
      method: 'POST',
      body: JSON.stringify({
        scenario_id: scenarioId,
        completion_percentage: completionPercentage,
      }),
    });
    return response;
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await this.request<{ status: string }>('/health');
    return response;
  }
}

export const apiService = new ApiService();
export default apiService;
