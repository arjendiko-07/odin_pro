const Project = require('./project.js');
const Todo = require('./todo.js');
const Storage = require('./storage.js');
const UI = require('./ui.js');

// Load saved projects or create default
let projects = Storage.load() || [new Project('Default')];
let currentProject = 0;

function saveAndRender() {
  Storage.save(projects);
  UI.render(projects, currentProject, {
    onSelectProject: (i) => {
      currentProject = i;
      saveAndRender();
    },
    onAddProject: (name) => {
      projects.push(new Project(name));
      saveAndRender();
    },
    onAddTodo: (title, desc, date, priority) => {
      projects[currentProject].addTodo(new Todo(title, desc, date, priority));
      saveAndRender();
    },
    onDeleteTodo: (i) => {
      projects[currentProject].deleteTodo(i);
      saveAndRender();
    },
    onToggleTodo: (i) => {
      projects[currentProject].todos[i].toggleComplete();
      saveAndRender();
    }
  });
}

saveAndRender();