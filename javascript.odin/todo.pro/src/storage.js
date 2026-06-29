const Project = require('./project');
const Todo = require('./todo');

const Storage = {
  save(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
  },

  load() {
    const data = JSON.parse(localStorage.getItem('projects'));
    if (!data) return null;

    // Rebuild class instances from plain JSON
    return data.map(p => {
      const project = new Project(p.name);
      project.todos = p.todos.map(t => {
        const todo = new Todo(t.title, t.description, t.dueDate, t.priority);
        todo.complete = t.complete;
        return todo;
      });
      return project;
    });
  }
};

module.exports = Storage;