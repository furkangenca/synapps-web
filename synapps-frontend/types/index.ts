export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: string;
  assigned_user_id?: number;
  position: number;
  column_id: number;
  start_date?: string;
  end_date?: string;
  dependency_id?: number;
  assignee?: string;
  importance?: string;
  columnTitle?: string;
}

export interface Column {
  id: number;
  title: string;
  tasks: Task[];
  position: number;
  board_id: number;
}

export interface Board {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at: string;
}

export interface BoardMember {
  id: number;
  user_id: number;
  board_id: number;
  role: string;
  user: {
    id: number;
    name: string;
    email: string;
    image?: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
} 