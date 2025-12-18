import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Todo, CreateTodoRequest } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { API_CONFIG } from '../config/api.config';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit {
  todos = signal<Todo[]>([]);
  editingId = signal<number | null>(null);
  loading = signal<boolean>(false);
  
  newTodo: CreateTodoRequest = {
    title: '',
    description: ''
  };

  editForm = {
    title: '',
    description: ''
  };

  constructor(private todoService: TodoService, private http: HttpClient) {}

  ngOnInit() {
    console.log('Component initialized, testing API...');
    this.testAPI();
  }

  testAPI() {
    // Test direct HTTP call
    console.log('Testing direct API call to: http://localhost:3000/api/todos');
    this.http.get('http://localhost:3000/api/todos').subscribe({
      next: (data) => {
        console.log('SUCCESS - Direct API call worked:', data);
        this.todos.set(data as Todo[]);
      },
      error: (error) => {
        console.error('FAILED - Direct API call failed:', error);
        console.log('Error status:', error.status);
        console.log('Error message:', error.message);
      }
    });
  }

  loadTodos() {
    console.log('Loading todos from API...');
    this.loading.set(true);
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        console.log('Todos received:', todos);
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        console.error('Full error object:', error);
        this.loading.set(false);
      }
    });
  }

  addTodo() {
    if (!this.newTodo.title.trim()) return;

    this.loading.set(true);
    this.todoService.createTodo(this.newTodo).subscribe({
      next: (newTodo) => {
        this.todos.update(todos => [newTodo, ...todos]);
        this.resetForm();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error creating todo:', error);
        this.loading.set(false);
      }
    });
  }

  startEdit(todo: Todo) {
    this.editingId.set(todo.id);
    this.editForm.title = todo.title;
    this.editForm.description = todo.description;
  }

  saveEdit(id: number) {
    if (!this.editForm.title.trim()) return;

    this.loading.set(true);
    this.todoService.updateTodo(id, this.editForm).subscribe({
      next: (updatedTodo) => {
        this.todos.update(todos =>
          todos.map(todo => todo.id === id ? updatedTodo : todo)
        );
        this.cancelEdit();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error updating todo:', error);
        this.loading.set(false);
      }
    });
  }
  cancelEdit() {
    this.editingId.set(null);
    this.editForm.title = '';
    this.editForm.description = '';
  }

  deleteTodo(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.loading.set(true);
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.todos.update(todos => todos.filter(todo => todo.id !== id));
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error deleting todo:', error);
          this.loading.set(false);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private resetForm() {
    this.newTodo = {
      title: '',
      description: ''
    };
  }
}