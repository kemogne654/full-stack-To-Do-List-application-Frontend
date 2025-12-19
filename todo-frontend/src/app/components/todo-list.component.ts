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
  loading = signal<boolean>(false);
  showEditModal = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);
  selectedTodo = signal<Todo | null>(null);
  
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

  openEditModal(todo: Todo) {
    this.selectedTodo.set(todo);
    this.editForm.title = todo.title;
    this.editForm.description = todo.description;
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.selectedTodo.set(null);
    this.editForm.title = '';
    this.editForm.description = '';
  }

  saveEdit() {
    const todo = this.selectedTodo();
    if (!todo || !this.editForm.title.trim()) return;

    this.loading.set(true);
    this.todoService.updateTodo(todo.id, this.editForm).subscribe({
      next: (updatedTodo) => {
        this.todos.update(todos =>
          todos.map(t => t.id === todo.id ? updatedTodo : t)
        );
        this.closeEditModal();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error updating todo:', error);
        this.loading.set(false);
      }
    });
  }

  openDeleteModal(todo: Todo) {
    this.selectedTodo.set(todo);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedTodo.set(null);
  }

  confirmDelete() {
    const todo = this.selectedTodo();
    if (!todo) return;

    this.loading.set(true);
    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => {
        this.todos.update(todos => todos.filter(t => t.id !== todo.id));
        this.closeDeleteModal();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
        this.loading.set(false);
      }
    });
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