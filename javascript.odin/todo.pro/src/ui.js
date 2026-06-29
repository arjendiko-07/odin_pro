const { format } = require('date-fns');

const UI = {
  render(projects, currentIndex, handlers) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    content.appendChild(this.renderSidebar(projects, currentIndex, handlers));
    content.appendChild(this.renderMain(projects[currentIndex], handlers));
  },

  renderSidebar(projects, currentIndex, handlers) {
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');

    sidebar.innerHTML = '<h2>Projects</h2>';

    projects.forEach((project, i) => {
      const btn = document.createElement('button');
      btn.textContent = project.name || "Untitled Project";

      if (i === currentIndex) btn.classList.add('active');

      btn.addEventListener('click', () => handlers.onSelectProject(i));
      sidebar.appendChild(btn);
    });

    // Add project form
    const input = document.createElement('input');
    input.placeholder = 'New project name';

    const addBtn = document.createElement('button');
    addBtn.textContent = '+ Add Project';

    addBtn.addEventListener('click', () => {
      const value = input.value.trim();
      if (value) handlers.onAddProject(value);
    });

    sidebar.appendChild(input);
    sidebar.appendChild(addBtn);

    return sidebar;
  },

  renderMain(project, handlers) {
    const main = document.createElement('div');
    main.classList.add('main');

    if (!project) {
      main.innerHTML = `<h2>No project selected</h2>`;
      return main;
    }

    main.innerHTML = `<h2>${project.name}</h2>`;

    // Todo list
    project.todos.forEach((todo, i) => {
      const div = document.createElement('div');

      // FIXED: no empty class tokens anymore
      div.classList.add('todo');

      if (todo.priority) div.classList.add(todo.priority);
      if (todo.complete) div.classList.add('complete');

      const date = todo.dueDate
        ? format(new Date(todo.dueDate), 'MMM d, yyyy')
        : 'No date';

      div.innerHTML = `
        <span>${todo.title} — ${date}</span>
        <div class="todo-details hidden">
          <p>${todo.description || ''}</p>
        </div>
      `;

      // Expand on click
      div.querySelector('span').addEventListener('click', () => {
        div.querySelector('.todo-details').classList.toggle('hidden');
      });

      // Toggle complete
      const doneBtn = document.createElement('button');
      doneBtn.textContent = todo.complete ? '↩ Undo' : '✓ Done';
      doneBtn.addEventListener('click', () => handlers.onToggleTodo(i));

      // Delete
      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑 Delete';
      delBtn.addEventListener('click', () => handlers.onDeleteTodo(i));

      div.appendChild(doneBtn);
      div.appendChild(delBtn);

      main.appendChild(div);
    });

    // Add todo form
    main.appendChild(this.renderTodoForm(handlers));

    return main;
  },

  renderTodoForm(handlers) {
    const form = document.createElement('div');
    form.classList.add('todo-form');

    form.innerHTML = `
      <h3>Add Todo</h3>
      <input id="todo-title" placeholder="Title" />
      <input id="todo-desc" placeholder="Description" />
      <input id="todo-date" type="date" />
      <select id="todo-priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button id="add-todo-btn">+ Add Todo</button>
    `;

    form.querySelector('#add-todo-btn').addEventListener('click', () => {
      const title = form.querySelector('#todo-title').value.trim();
      const desc = form.querySelector('#todo-desc').value.trim();
      const date = form.querySelector('#todo-date').value;
      const priority = form.querySelector('#todo-priority').value;

      if (title) handlers.onAddTodo(title, desc, date, priority);
    });

    return form;
  }
};

module.exports = UI;