import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo, CreateTodoRequest } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  todos = signal<Todo[]>([]);
  editingId = signal<number | null>(null);
  
  newTodo: CreateTodoRequest = {
    title: '',
    description: ''
  };

  editForm = {
    title: '',
    description: ''
  };

  constructor() {
    // Mock data for demonstration
    this.todos.set([
      {
        id: 1,
        title: 'Complete project documentation',
        description: 'Write comprehensive README and API documentation',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Setup development environment',
        description: 'Install Node.js, PostgreSQL, and configure the database',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  }

  addTodo() {
    if (!this.newTodo.title.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      title: this.newTodo.title.trim(),
      description: this.newTodo.description?.trim() || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.todos.update(todos => [newTodo, ...todos]);
    this.resetForm();
  }

  startEdit(todo: Todo) {
    this.editingId.set(todo.id);
    this.editForm.title = todo.title;
    this.editForm.description = todo.description;
  }

  saveEdit(id: number) {
    if (!this.editForm.title.trim()) return;

    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              title: this.editForm.title.trim(),
              description: this.editForm.description.trim(),
              updated_at: new Date().toISOString()
            }
          : todo
      )
    );
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editForm.title = '';
    this.editForm.description = '';
  }

  deleteTodo(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.todos.update(todos => todos.filter(todo => todo.id !== id));
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