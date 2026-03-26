let items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        return JSON.parse(savedTasks);
    } else {
        return items;
    }
}

function createItem(item) {
    const template = document.getElementById("to-do__item-template");
    const clone = template.content.querySelector(".to-do__item").cloneNode(true);
    const textElement = clone.querySelector(".to-do__item-text");
    
    // все кнопки внутри клона
    const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
    const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
    const editButton = clone.querySelector(".to-do__item-button_type_edit");

    textElement.textContent = item;

    // удаление
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            const taskItem = deleteButton.closest('.to-do__item');
            if (taskItem) {
                taskItem.remove();
                const currentTasks = getTasksFromDOM();
                saveTasks(currentTasks);
            }
        });
    }

    // копирование
    if (duplicateButton) {
        duplicateButton.addEventListener('click', () => {
            const taskText = textElement.textContent;
            const copyTask = createItem(taskText);
            const listElement = document.querySelector('.to-do__list');
            listElement.prepend(copyTask);
            
            const currentTasks = getTasksFromDOM();
            saveTasks(currentTasks);
        });
    }

    //редактирование
    if (editButton) {
        editButton.addEventListener('click', () => {
            // Включаем режим редактирования
            textElement.setAttribute('contenteditable', 'true');
            textElement.focus();
        });

        //сохранение изменения при потере фокуса
        textElement.addEventListener('blur', () => {
            textElement.setAttribute('contenteditable', 'false');
            
            // обновленте localstorage
            const currentTasks = getTasksFromDOM();
            saveTasks(currentTasks);
        });

        //сохранение по enter
        textElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // убираем переход на новую строку
                textElement.blur(); // убираем фокус
            }
        });
    }

    return clone;
}

function getTasksFromDOM() {
    const itemsNamesElements = document.querySelectorAll('.to-do__item-text');
    const tasks = [];
    
    itemsNamesElements.forEach(element => {
        tasks.push(element.textContent);
    });
    
    return tasks;
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//задачи при загрузке
const initialTasks = loadTasks();
initialTasks.forEach(task => {
    const taskElement = createItem(task);
    listElement.append(taskElement);
});

//обработчик формы
formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const taskText = inputElement.value.trim();
    if (taskText === '') return;
    
    const newTask = createItem(taskText);
    listElement.prepend(newTask);
    
    inputElement.value = '';
    
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
});
