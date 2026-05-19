let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
let selectedDate = null;

// カレンダーの初期化
function initCalendar() {
    renderCalendar();
    updateEventsList();
    
    document.getElementById('prevBtn').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    document.getElementById('addBtn').addEventListener('click', addEvent);
    document.getElementById('eventDate').addEventListener('change', (e) => {
        selectedDate = e.target.value;
    });
}

// カレンダーの描画
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 月年の表示
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', 
                       '7月', '8月', '9月', '10月', '11月', '12月'];
    document.getElementById('monthYear').textContent = `${year}年 ${monthNames[month]}`;
    
    // 最初の日の曜日（0=日, 1=月...）
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const datesContainer = document.getElementById('datesContainer');
    datesContainer.innerHTML = '';
    
    // 前月の日付を追加
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayNum = daysInPrevMonth - i;
        const cell = createDateCell(dayNum, month - 1, year, true);
        datesContainer.appendChild(cell);
    }
    
    // 当月の日付を追加
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = createDateCell(day, month, year, false);
        datesContainer.appendChild(cell);
    }
    
    // 翌月の日付を追加
    const totalCells = datesContainer.children.length;
    const remainingCells = (42 - totalCells); // 6週間 × 7日 = 42
    for (let day = 1; day <= remainingCells; day++) {
        const cell = createDateCell(day, month + 1, year, true);
        datesContainer.appendChild(cell);
    }
}

// 日付セルの作成
function createDateCell(day, month, year, isOtherMonth) {
    const cell = document.createElement('div');
    cell.className = 'date-cell';
    
    if (isOtherMonth) {
        cell.classList.add('other-month');
    }
    
    const dateStr = formatDate(new Date(year, month, day));
    const dateNumber = document.createElement('div');
    dateNumber.className = 'date-number';
    dateNumber.textContent = day;
    cell.appendChild(dateNumber);
    
    // イベントの有無を確認
    if (events[dateStr] && events[dateStr].length > 0) {
        const dot = document.createElement('div');
        dot.className = 'event-dot';
        cell.appendChild(dot);
    }
    
    cell.addEventListener('click', () => {
        document.querySelectorAll('.date-cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        selectedDate = dateStr;
        document.getElementById('eventDate').value = dateStr;
        updateEventsList();
    });
    
    return cell;
}

// 日付をYYYY-MM-DD形式でフォーマット
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// イベント追加
function addEvent() {
    const dateInput = document.getElementById('eventDate').value;
    const title = document.getElementById('eventTitle').value;
    const desc = document.getElementById('eventDesc').value;
    
    if (!dateInput || !title) {
        alert('日付とタイトルを入力してください');
        return;
    }
    
    if (!events[dateInput]) {
        events[dateInput] = [];
    }
    
    events[dateInput].push({
        title: title,
        desc: desc,
        id: Date.now()
    });
    
    saveEvents();
    renderCalendar();
    updateEventsList();
    
    // フォームをリセット
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDesc').value = '';
}

// イベント削除
function deleteEvent(dateStr, eventId) {
    if (events[dateStr]) {
        events[dateStr] = events[dateStr].filter(e => e.id !== eventId);
        if (events[dateStr].length === 0) {
            delete events[dateStr];
        }
    }
    saveEvents();
    renderCalendar();
    updateEventsList();
}

// イベントリストの更新
function updateEventsList() {
    const eventsList = document.getElementById('eventsList');
    eventsList.innerHTML = '';
    
    if (!selectedDate || !events[selectedDate]) {
        eventsList.innerHTML = '<p style="color: #999; text-align: center;">イベントなし</p>';
        return;
    }
    
    events[selectedDate].forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        
        const dateDiv = document.createElement('div');
        dateDiv.className = 'event-date';
        dateDiv.textContent = selectedDate;
        eventItem.appendChild(dateDiv);
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'event-title';
        titleDiv.textContent = event.title;
        eventItem.appendChild(titleDiv);
        
        if (event.desc) {
            const descDiv = document.createElement('div');
            descDiv.className = 'event-desc';
            descDiv.textContent = event.desc;
            eventItem.appendChild(descDiv);
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '削除';
        deleteBtn.addEventListener('click', () => deleteEvent(selectedDate, event.id));
        eventItem.appendChild(deleteBtn);
        
        eventsList.appendChild(eventItem);
    });
}

// イベントを保存
function saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', initCalendar);
