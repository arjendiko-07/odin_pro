class Todo {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority; // 'low', 'medium', 'high'
    this.complete = false;
  }

  toggleComplete() {
    this.complete = !this.complete;
  }
}

module.exports = Todo;