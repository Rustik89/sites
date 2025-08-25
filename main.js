class Todo {
    selectors = {
        root: '[data-js-todo]',
        newTaskForm: '[data-js-todo-new-task-form]',
        newTaskInput: '[data-js-todo-new-task-input]',
        searchTaskForm: '[data-js-todo-search-task-form]',
        searchTaskInput: '[data-js-todo-search-task-input]',
        totalTasks: '[data-js-todo-total-tasks]',
        deleteAllButton: '[data-js-todo-delete-all-button]',
        list: '[data-js-todo-list]',
        item: '[data-js-todo-item]',
        itemCheckbox: '[data-js-todo-item-checkbox]',
        itemLabel: '[data-js-todo-item-label]',
        itemDeleteButton: '[data-js-todo-item-delete-button]',
        emptyMessage: '[data-js-todo-empty-message]'
    };

    stateClasses = {
        isVisible: 'is-visible',
        isDisappearing: 'is-disappearing'
    };

    localStorageKey = 'todo-items';

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root);
        this.newTaskFormElement = this.rootElement.querySelector(
            this.selectors.newTaskForm
        );
        this.newTaskInputElement = this.rootElement.querySelector(
            this.selectors.newTaskInput
        );
        this.searchTaskFormElement = this.rootElement.querySelector(
            this.selectors.searchTaskForm
        );
        this.searchTaskInputElement = this.rootElement.querySelector(
            this.selectors.searchTaskInput
        );
        this.totalTasksElement = this.rootElement.querySelector(
            this.selectors.totalTasks
        );
        this.deleteAllButtonElement = this.rootElement.querySelector(
            this.selectors.deleteAllButton
        );
        this.listElement = this.rootElement.querySelector(this.selectors.list);
        this.emptyMessageElement = this.rootElement.querySelector(
            this.selectors.emptyMessage
        );

        this.state = {
            items: this.getItemsFromLocalStorage(),
            filteredItems: null,
            searchQuery: ''
        };

        this.render();
        this.bindEvents();
    }

    getItemsFromLocalStorage() {
        const rawData = localStorage.getItem(this.localStorageKey);

        if (!rawData) {
            return [];
        }
        try {
            const parsedData = JSON.parse(rawData);

            return Array.isArray(parsedData) ? parsedData : [];
        } catch {
            console.error('Todo items parse error');
            return [];
        }
    }

    saveItemsToLocalStorage() {
        localStorage.setItem(
            this.localStorageKey,
            JSON.stringify(this.state.items)
        );
    }

    render() {
        this.totalTasksElement.textContent = this.state.items.length;

        this.deleteAllButtonElement.classList.toggle(
            this.stateClasses.isVisible,
            this.state.items.length > 0
        );

        const items = this.state.filteredItems ?? this.state.items;

        this.listElement.innerHTML = items
            .map(
                ({ id, title, isChecked }) => `
             <li class="todo__item todo-item" data-js-todo-item>
                    <input
                        type="checkbox"
                        ${isChecked ? 'checked' : ''}
                        id="${id}"
                        class="todo__item-checkbox"
                        data-js-todo-item-checkbox
                    />
                    <label
                        for="${id}"
                        class="todo-item__label"
                        data-js-todo-item-label
                        >${title}</label
                    >
                    <button
                        class="todo-item__delete-button"
                        data-js-todo-item-delete-button
                        type="button"
                        aria-label="Delete"
                        title="Delete"
                    >
                        <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 32 32"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
                        >
                            <title>cross-square</title>
                            <desc>Created with Sketch Beta.</desc>
                            <defs></defs>
                            <g
                                id="Page-1"
                                stroke="none"
                                stroke-width="1"
                                fill="none"
                                fill-rule="evenodd"
                                sketch:type="MSPage"
                            >
                                <g
                                    id="Icon-Set"
                                    sketch:type="MSLayerGroup"
                                    transform="translate(-204.000000, -1035.000000)"
                                    fill="#000000"
                                >
                                    <path
                                        d="M224.95,1046.05 C224.559,1045.66 223.926,1045.66 223.536,1046.05 L220,1049.59 L216.464,1046.05 C216.074,1045.66 215.441,1045.66 215.05,1046.05 C214.66,1046.44 214.66,1047.07 215.05,1047.46 L218.586,1051 L215.05,1054.54 C214.66,1054.93 214.66,1055.56 215.05,1055.95 C215.441,1056.34 216.074,1056.34 216.464,1055.95 L220,1052.41 L223.536,1055.95 C223.926,1056.34 224.559,1056.34 224.95,1055.95 C225.34,1055.56 225.34,1054.93 224.95,1054.54 L221.414,1051 L224.95,1047.46 C225.34,1047.07 225.34,1046.44 224.95,1046.05 L224.95,1046.05 Z M234,1063 C234,1064.1 233.104,1065 232,1065 L208,1065 C206.896,1065 206,1064.1 206,1063 L206,1039 C206,1037.9 206.896,1037 208,1037 L232,1037 C233.104,1037 234,1037.9 234,1039 L234,1063 L234,1063 Z M232,1035 L208,1035 C205.791,1035 204,1036.79 204,1039 L204,1063 C204,1065.21 205.791,1067 208,1067 L232,1067 C234.209,1067 236,1065.21 236,1063 L236,1039 C236,1036.79 234.209,1035 232,1035 L232,1035 Z"
                                        id="cross-square"
                                        sketch:type="MSShapeGroup"
                                    ></path>
                                </g>
                            </g>
                        </svg>
                    </button>
                </li>
        `
            )
            .join('');
        const isEmptyFilteredItems = this.state.filteredItems?.length === 0;
        const isEmptyItems = this.state.items.length === 0;

        this.emptyMessageElement.textContent = isEmptyFilteredItems
            ? 'Задачи не найдены'
            : isEmptyItems
            ? 'Пока нет задач'
            : '';
    }

    addItem(title) {
        this.state.items.push({
            id: crypto?.randomUUID() ?? Date.now().toString(),
            title,
            isChecked: false
        });
        this.saveItemsToLocalStorage();
        this.render();
    }
    deleteItem(id) {
        this.state.items = this.state.items.filter((item) => item.id !== id);
        this.saveItemsToLocalStorage();
        this.render();
    }
    toggleCheckedState(id) {
        this.state.items = this.state.items.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    isChecked: !item.isChecked
                };
            }
            return item;
        });
        this.saveItemsToLocalStorage();
        this.render();
    }

    filter() {
        const queryFormatted = this.state.searchQuery.toLowerCase();
        this.state.filteredItems = this.state.items.filter(({ title }) => {
            const titleFormatted = title.toLowerCase();

            return titleFormatted.includes(queryFormatted);
        });
        this.render();
    }

    resetFilter() {
        this.state.filteredItems = null;
        this.state.searchQuery = '';
        this.render();
    }

    onNewTaskFormSubmit = (event) => {
        event.preventDefault();
        const newTodoItemTitle = this.newTaskInputElement.value;
        if (newTodoItemTitle.trim().length > 0) {
            this.addItem(newTodoItemTitle);
            this.resetFilter();
            this.newTaskInputElement.value = '';

            this.newTaskInputElement.focus();
        }
    };

    onSearchTaskFormSubmit = (event) => {
        event.preventDefault();
    };

    onSearchTaskInputChange = ({ target }) => {
        const value = target.value.trim();

        if (value.length > 0) {
            this.state.searchQuery = value;
            this.filter();
        } else {
            this.resetFilter();
        }
    };

    onDeleteAllButtonClick = () => {
        const isConfirmed = confirm(
            'Вы уверены что хотите удалить все задачи?'
        );
        if (isConfirmed) {
            this.state.items = [];
            this.saveItemsToLocalStorage();
            this.render();
        }
    };

    onClick = ({ target }) => {
        if (target.matches(this.selectors.itemDeleteButton)) {
            // console.log(this.selectors.item);
            const itemElement = target.closest(this.selectors.item);

            const itemCheckboxElement = itemElement.querySelector(
                this.selectors.itemCheckbox
            );

            itemElement.classList.add(this.stateClasses.isDisappearing);
            setTimeout(() => {
                this.deleteItem(itemCheckboxElement.id);
            }, 400);
        }
    };

    onChange = ({ target }) => {
        if (target.matches(this.selectors.itemCheckbox)) {
            this.toggleCheckedState(target.id);
        }
    };

    bindEvents() {
        this.newTaskFormElement.addEventListener(
            'submit',
            this.onNewTaskFormSubmit
        );
        this.searchTaskFormElement.addEventListener(
            'submit',
            this.onSearchTaskFormSubmit
        );
        this.searchTaskInputElement.addEventListener(
            'input',
            this.onSearchTaskInputChange
        );

        this.deleteAllButtonElement.addEventListener(
            'click',
            this.onDeleteAllButtonClick
        );
        this.listElement.addEventListener('click', this.onClick);
        this.listElement.addEventListener('change', this.onChange);
    }
}

new Todo();
