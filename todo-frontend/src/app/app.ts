import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoListComponent } from './components/todo-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
