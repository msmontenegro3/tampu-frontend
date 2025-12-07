export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'docente' | 'estudiante';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  teacher: User;

  enrolled?: boolean;
}
