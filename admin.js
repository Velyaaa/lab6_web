document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('tabs-config-form');

    if (formContainer) {
        formContainer.innerHTML = '';

        const tabsList = document.createElement('div');
        tabsList.id = 'tabs-list-container';
        formContainer.appendChild(tabsList);

        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'controls-panel';

        const addBtn = document.createElement('button');
        addBtn.textContent = '+ Додати вкладку';
        addBtn.className = 'btn-add-tab';
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Зберегти на сервер';
        saveBtn.className = 'btn-save-data';

        controlsPanel.appendChild(addBtn);
        controlsPanel.appendChild(saveBtn);
        formContainer.appendChild(controlsPanel);


        function addTabField() {
            const tabItem = document.createElement('div');
            tabItem.className = 'tab-item-form';

            tabItem.innerHTML = `
                <div class="form-header">
                    <span>Вкладка</span>
                    <button type="button" class="btn-remove-tab">✕</button>
                </div>
                <input type="text" class="tab-title-input" placeholder="Заголовок вкладки (напр. Характеристики)">
                <textarea class="tab-content-input" rows="4" placeholder="Вміст вкладки (HTML або текст)"></textarea>
            `;

            tabItem.querySelector('.btn-remove-tab').addEventListener('click', () => {
                tabItem.remove();
            });

            tabsList.appendChild(tabItem);
        }

        addTabField();

        addBtn.addEventListener('click', addTabField);

        saveBtn.addEventListener('click', () => {
            const items = document.querySelectorAll('.tab-item-form');
            const dataToSave = [];

            items.forEach(item => {
                const title = item.querySelector('.tab-title-input').value.trim();
                const content = item.querySelector('.tab-content-input').value.trim();

                if (title && content) {
                    dataToSave.push({ title, content });
                }
            });

            if (dataToSave.length === 0) {
                alert("Додайте хоча б одну заповнену вкладку!");
                return;
            }

            fetch('save_tabs.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSave)
            })
            .then(response => response.json()) 
            .then(result => {
                if (result.status === 'success') {
                    alert(result.message);
                } else {
                    alert('Помилка сервера: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Сталася помилка при відправці запиту.');
            });
        });
    }
});