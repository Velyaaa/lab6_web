document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.getElementById('tabs-container');
    
    let currentDataState = ''; 

    if (tabsContainer) {
        loadTabs();

        setInterval(() => {
            loadTabs();
        }, 3000);
    }

    function loadTabs() {
        const url = 'get_tabs.php?t=' + Date.now();

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const newDataState = JSON.stringify(data);

                if (newDataState !== currentDataState) {
                    console.log(`[${new Date().toLocaleTimeString()}] Отримано нові дані. Оновлюю інтерфейс...`);
                    
                    currentDataState = newDataState;
                    renderTabs(data);
                } else {
                }
            })
            .catch(error => {
                console.error('Помилка при опитуванні сервера:', error);
            });
    }

    function renderTabs(tabs) {
        const previousActiveBtn = document.querySelector('.tab-btn.active');
        const previousActiveIndex = previousActiveBtn ? previousActiveBtn.getAttribute('data-index') : 0;

        tabsContainer.innerHTML = ''; 

        if (!Array.isArray(tabs) || tabs.length === 0) {
            tabsContainer.innerHTML = '<p>Вкладок поки що немає. Створіть їх на сторінці Admin.</p>';
            return;
        }

        const navList = document.createElement('div');
        navList.className = 'custom-tabs-nav';

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'custom-tabs-content';

        tabs.forEach((tab, index) => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn';
            btn.textContent = tab.title;
            btn.setAttribute('data-index', index);
            
            btn.addEventListener('click', () => switchTab(index));
            navList.appendChild(btn);

            const pane = document.createElement('div');
            pane.className = 'tab-pane';
            pane.innerHTML = tab.content;
            pane.setAttribute('data-index', index);

            contentWrapper.appendChild(pane);
        });

        tabsContainer.appendChild(navList);
        tabsContainer.appendChild(contentWrapper);

        const tabIndexRestored = (previousActiveIndex < tabs.length) ? previousActiveIndex : 0;
        switchTab(tabIndexRestored);
    }

    function switchTab(selectedIndex) {
        selectedIndex = selectedIndex.toString();

        const allBtns = document.querySelectorAll('.tab-btn');
        const allPanes = document.querySelectorAll('.tab-pane');

        allBtns.forEach(btn => btn.classList.remove('active'));
        allPanes.forEach(pane => pane.classList.remove('active'));

        const activeBtn = document.querySelector(`.tab-btn[data-index="${selectedIndex}"]`);
        const activePane = document.querySelector(`.tab-pane[data-index="${selectedIndex}"]`);

        if (activeBtn) activeBtn.classList.add('active');
        if (activePane) activePane.classList.add('active');
    }
});