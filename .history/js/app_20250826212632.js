// Data storage
let menuItems = [];
let extraItems = [];
let orders = [];
let orderCounter = 1;
let currentOrder = [];
let selectedExtras = [];
let selectedPayment = 'cash';
let currentLanguage = 'en';

// Default menu configuration
const defaultMenuConfig = {
    menuItems: ['Poutine', 'Burger', 'Chicken Wings', 'Fish & Chips', 'Grilled Cheese'],
    extraItems: ['Extra Sauce', 'Extra Cheese', 'Fried Chicken', 'Bacon', 'Mushrooms', 'Onions'],
    restaurantName: 'Cuisine de Lin',
    version: '1.0'
};

// Language translations
const translations = {
    en: {
        takeOrders: 'Take Orders',
        kitchenDisplay: 'Kitchen Display',
        menuManagement: 'Menu Management',
        menu: '📋 Menu',
        addExtras: '➕ Add Extras',
        currentOrder: '🛒 Current Order',
        activeOrders: '📋 Active Orders',
        selectItems: 'Select items from the menu to start an order',
        clearOrder: 'Clear Order',
        customerName: 'Customer Name (optional)',
        payment: 'Payment',
        cashPaid: 'Cash (Paid)',
        cardPending: 'Card (Pending)',
        submitOrder: 'Submit Order',
        noOrdersYet: 'No orders yet',
        ordersWillAppear: 'Orders will appear here once they are submitted',
        noActiveOrders: 'No active orders',
        menuItems: '🍕 Menu Items',
        extraItems: '➕ Extra Items',
        addItem: 'Add Item',
        addExtra: 'Add Extra',
        enterMenuItemName: 'Enter menu item name',
        enterExtraItemName: 'Enter extra item name',
        delete: '🗑️ Delete',
        complete: '✅ Complete',
        completed: '✅ COMPLETED',
        paid: '💵 PAID',
        pending: '💳 PENDING',
        orderSubmitted: 'Order submitted successfully! Order #',
        confirmDelete: 'Are you sure you want to delete this',
        menuItem: 'menu item',
        extraItem: 'extra item',
        pleaseAddItems: 'Please add items to the order first!',
        order: 'Order',
        endOfDay: 'End of Day',
        endOfDayTitle: 'End of Day',
        endOfDayMessage: 'This will save today\'s data and reset everything for tomorrow. All current orders and counters will be cleared. Are you sure?',
        cancel: 'Cancel',
        confirmEndDay: 'Yes, End Day',
        dayEndedSuccess: 'Day ended successfully! All data has been saved and system reset for tomorrow.',
        totalOrdersToday: 'Total orders processed today',
        jsonMenuConfig: '📁 JSON Menu Configuration',
        importExportMenu: 'Import/Export Menu',
        exportJson: 'Export JSON',
        importJson: 'Import JSON',
        resetToDefault: 'Reset to Default',
        applyChanges: 'Apply Changes',
        jsonExported: 'Menu exported successfully!',
        jsonImported: 'Menu imported successfully!',
        jsonReset: 'Menu reset to default successfully!',
        jsonApplied: 'JSON changes applied successfully!',
        invalidJson: 'Invalid JSON format. Please check your syntax.',
        confirmReset: 'Are you sure you want to reset the menu to default values? This will overwrite your current menu.'
    },
    fr: {
        takeOrders: 'Prendre Commandes',
        kitchenDisplay: 'Affichage Cuisine',
        menuManagement: 'Gestion Menu',
        menu: '📋 Menu',
        addExtras: '➕ Ajouter Extras',
        currentOrder: '🛒 Commande Actuelle',
        activeOrders: '📋 Commandes Actives',
        selectItems: 'Sélectionnez des éléments du menu pour commencer une commande',
        clearOrder: 'Effacer Commande',
        customerName: 'Nom du Client (optionnel)',
        payment: 'Paiement',
        cashPaid: 'Comptant (Payé)',
        cardPending: 'Carte (En Attente)',
        submitOrder: 'Soumettre Commande',
        noOrdersYet: 'Aucune commande encore',
        ordersWillAppear: 'Les commandes apparaîtront ici une fois soumises',
        noActiveOrders: 'Aucune commande active',
        menuItems: '🍕 Articles du Menu',
        extraItems: '➕ Articles Supplémentaires',
        addItem: 'Ajouter Article',
        addExtra: 'Ajouter Extra',
        enterMenuItemName: 'Entrer le nom de l\'article du menu',
        enterExtraItemName: 'Entrer le nom de l\'article supplémentaire',
        delete: '🗑️ Supprimer',
        complete: '✅ Compléter',
        completed: '✅ COMPLÉTÉ',
        paid: '💵 PAYÉ',
        pending: '💳 EN ATTENTE',
        orderSubmitted: 'Commande soumise avec succès! Commande #',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet',
        menuItem: 'article du menu',
        extraItem: 'article supplémentaire',
        pleaseAddItems: 'Veuillez d\'abord ajouter des articles à la commande!',
        order: 'Commande',
        endOfDay: 'Fin de Journée',
        endOfDayTitle: 'Fin de Journée',
        endOfDayMessage: 'Ceci sauvegardera les données d\'aujourd\'hui et remettra tout à zéro pour demain. Toutes les commandes actuelles et compteurs seront effacés. Êtes-vous sûr?',
        cancel: 'Annuler',
        confirmEndDay: 'Oui, Terminer la Journée',
        dayEndedSuccess: 'Journée terminée avec succès! Toutes les données ont été sauvegardées et le système remis à zéro pour demain.',
        totalOrdersToday: 'Total des commandes traitées aujourd\'hui',
        jsonMenuConfig: '📁 Configuration Menu JSON',
        importExportMenu: 'Importer/Exporter Menu',
        exportJson: 'Exporter JSON',
        importJson: 'Importer JSON',
        resetToDefault: 'Remettre par Défaut',
        applyChanges: 'Appliquer les Changements',
        jsonExported: 'Menu exporté avec succès!',
        jsonImported: 'Menu importé avec succès!',
        jsonReset: 'Menu remis par défaut avec succès!',
        jsonApplied: 'Changements JSON appliqués avec succès!',
        invalidJson: 'Format JSON invalide. Veuillez vérifier votre syntaxe.',
        confirmReset: 'Êtes-vous sûr de vouloir remettre le menu aux valeurs par défaut? Ceci écrasera votre menu actuel.'
    }
};

// Language management
function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Update all text elements
    document.querySelectorAll('.text').forEach(element => {
        const key = element.getAttribute('data-key');
        if (key && t[key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = t[key];
            } else {
                element.textContent = t[key];
            }
        }
    });

    // Update button texts
    document.querySelectorAll('.btn-text').forEach((element, index) => {
        const keys = ['takeOrders', 'kitchenDisplay', 'menuManagement'];
        if (t[keys[index]]) {
            element.textContent = t[keys[index]];
        }
    });
}

// Initialize the app
async function initApp() {
    loadData();                       // safe before DOM rendering
    await loadMenuFromJson();         // ⬅️ wait for menu.json
    setupEventListeners();
    updateLanguage();
    renderMenuItems();
    renderExtraItems();
    renderMenuManagement();
    renderKitchenDisplay();
    renderActiveOrders();
}

// Load menu from JSON file
async function loadMenuFromJson() {
    try {
        const response = await fetch('/data/menu.json'); // fixed: use absolute path
        if (response.ok) {
            const menuConfig = await response.json();
            if (menuConfig.menuItems && menuConfig.extraItems) {
                menuItems = menuConfig.menuItems;
                extraItems = menuConfig.extraItems;
            } else {
                // Fallback to default if JSON is invalid
                menuItems = [...defaultMenuConfig.menuItems];
                extraItems = [...defaultMenuConfig.extraItems];
            }
        } else {
            // Fallback to default if file doesn't exist
            menuItems = [...defaultMenuConfig.menuItems];
            extraItems = [...defaultMenuConfig.extraItems];
        }
    } catch (error) {
        console.warn('Could not load menu.json, using defaults:', error);
        menuItems = [...defaultMenuConfig.menuItems];
        extraItems = [...defaultMenuConfig.extraItems];
    }
}

// Event listeners
function setupEventListeners() {
    // Language toggle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentLanguage = this.getAttribute('data-lang');
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateLanguage();
            localStorage.setItem('restaurantLanguage', currentLanguage);
            renderCurrentOrder();
            renderKitchenDisplay();
            renderActiveOrders();
            renderMenuManagement();
        });
    });

    // View toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const viewId = this.getAttribute('data-view');
            document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(viewId).classList.add('active');
            this.classList.add('active');
            
            if (viewId === 'kitchen-display') {
                renderKitchenDisplay();
            }
        });
    });

    // Payment selection
    document.getElementById('cash-btn').addEventListener('click', () => selectPayment('cash'));
    document.getElementById('card-btn').addEventListener('click', () => selectPayment('card'));

    // Order actions
    document.getElementById('clear-order-btn').addEventListener('click', clearOrder);
    document.getElementById('submit-order-btn').addEventListener('click', submitOrder);

    // Menu management
    document.getElementById('add-menu-btn').addEventListener('click', addMenuItem);
    document.getElementById('add-extra-btn').addEventListener('click', addExtraItem);

    // JSON menu management
    document.getElementById('export-json-btn').addEventListener('click', exportMenuJson);
    document.getElementById('import-json-btn').addEventListener('click', () => {
        document.getElementById('json-file-input').click();
    });
    document.getElementById('json-file-input').addEventListener('change', importMenuJson);
    document.getElementById('reset-menu-btn').addEventListener('click', resetMenuToDefault);
    document.getElementById('apply-json-btn').addEventListener('click', applyJsonChanges);

    // End of day
    document.getElementById('end-of-day-btn').addEventListener('click', showEndOfDayModal);
    document.getElementById('cancel-end-day').addEventListener('click', hideEndOfDayModal);
    document.getElementById('confirm-end-day').addEventListener('click', endOfDay);

    // Enter key support
    document.getElementById('new-menu-item').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') addMenuItem();
    });
    document.getElementById('new-extra-item').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') addExtraItem();
    });
}

// Data persistence
function saveData() {
    const data = {
        menuItems,
        extraItems,
        orders,
        orderCounter
    };
    localStorage.setItem('restaurantData', JSON.stringify(data));
}

function loadData() {
    const saved = localStorage.getItem('restaurantData');
    if (saved) {
        const data = JSON.parse(saved);
        orders = data.orders || [];
        orderCounter = data.orderCounter || 1;
        // Don't load menuItems and extraItems from localStorage
        // They should come from JSON file instead
    }
    
    // Load language preference
    const savedLang = localStorage.getItem('restaurantLanguage');
    if (savedLang) {
        currentLanguage = savedLang;
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === savedLang) {
                btn.classList.add('active');
            }
        });
    }
}

// Menu rendering
function renderMenuItems() {
    const container = document.getElementById('menu-items');
    container.innerHTML = '';
    
    menuItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'menu-item';
        button.textContent = item;
        button.addEventListener('click', () => addToOrder(item));
        container.appendChild(button);
    });
}

function renderExtraItems() {
    const container = document.getElementById('extra-items');
    container.innerHTML = '';
    
    extraItems.forEach(item => {
        const button = document.createElement('button');
        button.className = 'extra-item';
        button.textContent = item;
        button.addEventListener('click', () => toggleExtra(item, button));
        container.appendChild(button);
    });
}

// Order management
function addToOrder(item) {
    const orderItem = {
        name: item,
        extras: [...selectedExtras]
    };
    
    currentOrder.push(orderItem);
    selectedExtras = [];
    
    // Clear selected extras visually
    document.querySelectorAll('.extra-item').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    renderCurrentOrder();
}

function toggleExtra(extra, button) {
    if (selectedExtras.includes(extra)) {
        selectedExtras = selectedExtras.filter(e => e !== extra);
        button.classList.remove('selected');
    } else {
        selectedExtras.push(extra);
        button.classList.add('selected');
    }
}

function renderCurrentOrder() {
    const container = document.getElementById('current-order');
    const t = translations[currentLanguage];
    
    if (currentOrder.length === 0) {
        container.innerHTML = `<p class="empty-message">${t.selectItems}</p>`;
        return;
    }
    
    container.innerHTML = '';
    
    currentOrder.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'order-item';
        
        const extrasText = item.extras.length > 0 ? 
            `<div class="order-extras">+ ${item.extras.join(', ')}</div>` : '';
        
        div.innerHTML = `
            <button class="remove-item" onclick="removeFromOrder(${index})">✕</button>
            <h4>${item.name}</h4>
            ${extrasText}
        `;
        
        container.appendChild(div);
    });
    
    renderActiveOrders();
}

function removeFromOrder(index) {
    currentOrder.splice(index, 1);
    renderCurrentOrder();
}

function clearOrder() {
    currentOrder = [];
    selectedExtras = [];
    document.getElementById('customer-name').value = '';
    
    // Clear selected extras visually
    document.querySelectorAll('.extra-item').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    renderCurrentOrder();
}

function selectPayment(type) {
    selectedPayment = type;
    document.getElementById('cash-btn').classList.remove('selected');
    document.getElementById('card-btn').classList.remove('selected');
    document.getElementById(`${type}-btn`).classList.add('selected');
}

function submitOrder() {
    const t = translations[currentLanguage];
    
    if (currentOrder.length === 0) {
        alert(t.pleaseAddItems);
        return;
    }
    
    const customerName = document.getElementById('customer-name').value.trim() || `${t.order} #${orderCounter}`;
    
    const order = {
        id: orderCounter++,
        customerName,
        items: [...currentOrder],
        paymentType: selectedPayment,
        status: 'pending',
        timestamp: new Date().toLocaleString()
    };
    
    orders.unshift(order);
    saveData();
    clearOrder();
    
    alert(`${t.orderSubmitted}${order.id}`);
    
    renderActiveOrders();
    
    if (document.getElementById('kitchen-display').classList.contains('active')) {
        renderKitchenDisplay();
    }
}

// Active orders in order-taking view
function renderActiveOrders() {
    const container = document.getElementById('active-orders');
    const pendingOrders = orders.filter(order => order.status !== 'completed');
    const t = translations[currentLanguage];
    
    if (pendingOrders.length === 0) {
        container.innerHTML = `<p class="empty-message">${t.noActiveOrders}</p>`;
        return;
    }
    
    container.innerHTML = '';
    
    pendingOrders.forEach(order => {
        const div = document.createElement('div');
        div.className = 'active-order-item';
        
        const itemNames = order.items.map(item => {
            const extras = item.extras.length > 0 ? ` (+${item.extras.join(', ')})` : '';
            return item.name + extras;
        }).join(', ');
        
        const paymentText = order.paymentType === 'cash' ? 
            t.paid.replace('💵 ', '') : t.pending.replace('💳 ', '');
        
        div.innerHTML = `
            <div class="active-order-info">
                <h5>#${order.id} - ${order.customerName}</h5>
                <small>${itemNames} | ${paymentText}</small>
            </div>
            <button class="complete-btn" onclick="completeOrder(${order.id})">
                ${t.complete}
            </button>
        `;
        
        container.appendChild(div);
    });
}

// Kitchen display
function renderKitchenDisplay() {
    const container = document.getElementById('kitchen-orders');
    const t = translations[currentLanguage];
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="no-orders">
                <h3>${t.noOrdersYet}</h3>
                <p>${t.ordersWillAppear}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    orders.forEach(order => {
        const div = document.createElement('div');
        div.className = `order-card ${order.status} ${order.paymentType}`;
        
        const itemsHtml = order.items.map(item => {
            const extrasText = item.extras.length > 0 ? 
                `<div class="kitchen-extras">+ ${item.extras.join(', ')}</div>` : '';
            return `
                <div class="kitchen-item">
                    <h4>${item.name}</h4>
                    ${extrasText}
                </div>
            `;
        }).join('');
        
        const paymentStatusClass = order.paymentType === 'cash' ? 'cash' : 'pending';
        const paymentStatusText = order.paymentType === 'cash' ? t.paid : t.pending;
        
        const statusBadge = order.status === 'completed' ? 
            `<span style="background: #4caf50; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">${t.completed}</span>` : '';
        
        div.innerHTML = `
            <div class="order-info">
                <div class="order-header">
                    <div class="order-number">#${order.id}</div>
                    <div class="order-time">${order.timestamp}</div>
                </div>
                <div class="customer-section">
                    <div class="customer-name">👤 ${order.customerName}</div>
                    <div class="payment-status ${paymentStatusClass}">${paymentStatusText}</div>
                    ${statusBadge}
                </div>
                <div class="order-items">
                    ${itemsHtml}
                </div>
            </div>
        `;
        
        container.appendChild(div);
    });
}

function completeOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'completed';
        saveData();
        renderKitchenDisplay();
        renderActiveOrders();
    }
}

// Menu management
function renderMenuManagement() {
    renderMenuList();
    renderExtraList();
    updateJsonEditor();
}

function updateJsonEditor() {
    const menuConfig = {
        restaurantName: 'Cuisine de Lin',
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        menuItems: [...menuItems],
        extraItems: [...extraItems]
    };
    document.getElementById('json-editor').value = JSON.stringify(menuConfig, null, 2);
}

function renderMenuList() {
    const container = document.getElementById('menu-list');
    const t = translations[currentLanguage];
    container.innerHTML = '';
    
    menuItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'menu-list-item';
        div.innerHTML = `
            <span>${item}</span>
            <button class="delete-btn" onclick="deleteMenuItem(${index})">${t.delete}</button>
        `;
        container.appendChild(div);
    });
}

function renderExtraList() {
    const container = document.getElementById('extra-list');
    const t = translations[currentLanguage];
    container.innerHTML = '';
    
    extraItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'menu-list-item';
        div.innerHTML = `
            <span>${item}</span>
            <button class="delete-btn" onclick="deleteExtraItem(${index})">${t.delete}</button>
        `;
        container.appendChild(div);
    });
}

function addMenuItem() {
    const input = document.getElementById('new-menu-item');
    const itemName = input.value.trim();
    
    if (itemName && !menuItems.includes(itemName)) {
        menuItems.push(itemName);
        input.value = '';
        saveMenuToJson();
        renderMenuItems();
        renderMenuList();
        updateJsonEditor();
    }
}

function addExtraItem() {
    const input = document.getElementById('new-extra-item');
    const itemName = input.value.trim();
    
    if (itemName && !extraItems.includes(itemName)) {
        extraItems.push(itemName);
        input.value = '';
        saveMenuToJson();
        renderExtraItems();
        renderExtraList();
        updateJsonEditor();
    }
}

function deleteMenuItem(index) {
    const t = translations[currentLanguage];
    if (confirm(`${t.confirmDelete} ${t.menuItem}?`)) {
        menuItems.splice(index, 1);
        saveMenuToJson();
        renderMenuItems();
        renderMenuList();
        updateJsonEditor();
    }
}

function deleteExtraItem(index) {
    const t = translations[currentLanguage];
    if (confirm(`${t.confirmDelete} ${t.extraItem}?`)) {
        extraItems.splice(index, 1);
        saveMenuToJson();
        renderExtraItems();
        renderExtraList();
        updateJsonEditor();
    }
}

// Save menu to localStorage (since we can't write to JSON file directly)
function saveMenuToJson() {
    const menuConfig = {
        restaurantName: 'Cuisine de Lin',
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        menuItems: [...menuItems],
        extraItems: [...extraItems]
    };
    localStorage.setItem('restaurantMenu', JSON.stringify(menuConfig));
}

// JSON Menu Management Functions
function exportMenuJson() {
    const t = translations[currentLanguage];
    const menuConfig = {
        restaurantName: 'Cuisine de Lin',
        version: '1.0',
        exportDate: new Date().toISOString(),
        menuItems: [...menuItems],
        extraItems: [...extraItems]
    };
    
    const jsonString = JSON.stringify(menuConfig, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuisine-de-lin-menu-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(t.jsonExported);
}

function importMenuJson(event) {
    const t = translations[currentLanguage];
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            // Validate JSON structure
            if (jsonData.menuItems && jsonData.extraItems && 
                Array.isArray(jsonData.menuItems) && Array.isArray(jsonData.extraItems)) {
                
                menuItems = [...jsonData.menuItems];
                extraItems = [...jsonData.extraItems];
                
                saveMenuToJson();
                renderMenuItems();
                renderExtraItems();
                renderMenuManagement();
                
                alert(t.jsonImported);
            } else {
                alert(t.invalidJson);
            }
        } catch (error) {
            alert(t.invalidJson + '\n\nError: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

function resetMenuToDefault() {
    const t = translations[currentLanguage];
    if (confirm(t.confirmReset)) {
        menuItems = [...defaultMenuConfig.menuItems];
        extraItems = [...defaultMenuConfig.extraItems];
        
        saveMenuToJson();
        renderMenuItems();
        renderExtraItems();
        renderMenuManagement();
        
        alert(t.jsonReset);
    }
}

function applyJsonChanges() {
    const t = translations[currentLanguage];
    const jsonText = document.getElementById('json-editor').value;
    
    try {
        const jsonData = JSON.parse(jsonText);
        
        // Validate JSON structure
        if (jsonData.menuItems && jsonData.extraItems && 
            Array.isArray(jsonData.menuItems) && Array.isArray(jsonData.extraItems)) {
            
            menuItems = [...jsonData.menuItems];
            extraItems = [...jsonData.extraItems];
            
            saveMenuToJson();
            renderMenuItems();
            renderExtraItems();
            renderMenuManagement();
            
            alert(t.jsonApplied);
        } else {
            alert(t.invalidJson);
        }
    } catch (error) {
        alert(t.invalidJson + '\n\nError: ' + error.message);
    }
}

// End of Day functionality
function showEndOfDayModal() {
    document.getElementById('modal-overlay').classList.add('active');
}

function hideEndOfDayModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

function endOfDay() {
    const t = translations[currentLanguage];
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Create end of day report
    const dayReport = {
        date: today,
        totalOrders: orderCounter - 1,
        orders: [...orders],
        menuItems: [...menuItems],
        extraItems: [...extraItems],
        timestamp: new Date().toLocaleString()
    };
    
    // Save daily report to localStorage with date key
    const existingReports = JSON.parse(localStorage.getItem('restaurantDailyReports') || '{}');
    existingReports[today] = dayReport;
    localStorage.setItem('restaurantDailyReports', JSON.stringify(existingReports));
    
    // Reset all data for new day
    orders = [];
    orderCounter = 1;
    currentOrder = [];
    selectedExtras = [];
    selectedPayment = 'cash';
    
    // Clear current order form
    document.getElementById('customer-name').value = '';
    document.querySelectorAll('.extra-item').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Save reset state
    saveData();
    
    // Hide modal
    hideEndOfDayModal();
    
    // Re-render everything
    renderCurrentOrder();
    renderActiveOrders();
    renderKitchenDisplay();
    
    // Show success message
    alert(`${t.dayEndedSuccess}\n\n${t.totalOrdersToday}: ${dayReport.totalOrders}`);
}

// Auto-refresh kitchen display every 30 seconds
setInterval(() => {
    if (document.getElementById('kitchen-display').classList.contains('active')) {
        renderKitchenDisplay();
    }
}, 30000);

// Initialize the app when page loads
window.addEventListener('load', initApp);