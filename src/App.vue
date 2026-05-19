<template>
  <div id="app">
    <div class="container">
      <!-- カレンダー部分 -->
      <div class="calendar-wrapper">
        <div class="calendar-header">
          <button @click="prevMonth" class="nav-btn">❮</button>
          <h1>{{ monthYearText }}</h1>
          <button @click="nextMonth" class="nav-btn">❯</button>
        </div>

        <!-- 曜日ヘッダー -->
        <div class="weekdays">
          <div class="weekday">日</div>
          <div class="weekday">月</div>
          <div class="weekday">火</div>
          <div class="weekday">水</div>
          <div class="weekday">木</div>
          <div class="weekday">金</div>
          <div class="weekday">土</div>
        </div>

        <!-- カレンダーセル -->
        <div class="dates">
          <div
            v-for="cell in calendarCells"
            :key="cell.date"
            class="date-cell"
            :class="{
              'other-month': !cell.isCurrentMonth,
              'selected': selectedDate === cell.date
            }"
            @click="selectDate(cell.date)"
          >
            <div class="date-number">{{ cell.day }}</div>
            <div class="events-inline">
              <div
                v-for="event in getDateEvents(cell.date)"
                :key="event.id"
                class="event-preview"
                :title="event.title + (event.desc ? ': ' + event.desc : '')"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- サイドバー -->
      <div class="sidebar">
        <h2>予定</h2>
        <input
          v-model="formData.date"
          type="date"
          class="event-input"
        />
        <input
          v-model="formData.title"
          type="text"
          class="event-input"
          placeholder="予定のタイトル"
        />
        <textarea
          v-model="formData.desc"
          class="event-input"
          placeholder="予定の詳細"
        ></textarea>
        <button @click="addEvent" class="add-btn">予定を追加</button>

        <!-- 予定リスト -->
        <div class="events-list">
          <div v-if="selectedDateEvents.length === 0" class="no-events">
            イベントなし
          </div>
          <div
            v-for="event in selectedDateEvents"
            :key="event.id"
            class="event-item"
          >
            <div class="event-date">{{ selectedDate }}</div>
            <div class="event-title">{{ event.title }}</div>
            <div v-if="event.desc" class="event-desc">{{ event.desc }}</div>
            <button @click="deleteEvent(selectedDate, event.id)" class="delete-btn">
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// インターフェース定義
interface CalendarEvent {
  id: number
  title: string
  desc: string
}

interface CalendarCell {
  date: string
  day: number
  isCurrentMonth: boolean
}

interface FormData {
  date: string
  title: string
  desc: string
}

// リアクティブ状態
const currentDate = ref<Date>(new Date())
const selectedDate = ref<string>('')
const events = ref<Record<string, CalendarEvent[]>>({})
const formData = ref<FormData>({
  date: '',
  title: '',
  desc: ''
})

// 計算プロパティ
const monthYearText = computed((): string => {
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月',
                      '7月', '8月', '9月', '10月', '11月', '12月']
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return `${year}年 ${monthNames[month]}`
})

const calendarCells = computed((): CalendarCell[] => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: CalendarCell[] = []

  // 前月の日付
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const date = new Date(year, month - 1, day)
    cells.push({
      date: formatDate(date),
      day,
      isCurrentMonth: false
    })
  }

  // 当月の日付
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    cells.push({
      date: formatDate(date),
      day,
      isCurrentMonth: true
    })
  }

  // 翌月の日付
  const totalCells = cells.length
  const remainingCells = 42 - totalCells
  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day)
    cells.push({
      date: formatDate(date),
      day,
      isCurrentMonth: false
    })
  }

  return cells
})

const selectedDateEvents = computed((): CalendarEvent[] => {
  return events.value[selectedDate.value] || []
})

// メソッド
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDateEvents(dateStr: string): CalendarEvent[] {
  return events.value[dateStr] || []
}

function selectDate(dateStr: string): void {
  selectedDate.value = dateStr
  formData.value.date = dateStr
}

function prevMonth(): void {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1)
  currentDate.value = new Date(currentDate.value)
}

function nextMonth(): void {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1)
  currentDate.value = new Date(currentDate.value)
}

function addEvent(): void {
  if (!formData.value.date || !formData.value.title) {
    alert('日付とタイトルを入力してください')
    return
  }

  if (!events.value[formData.value.date]) {
    events.value[formData.value.date] = []
  }

  events.value[formData.value.date].push({
    id: Date.now(),
    title: formData.value.title,
    desc: formData.value.desc
  })

  saveEvents()
  formData.value.title = ''
  formData.value.desc = ''
}

function deleteEvent(dateStr: string, eventId: number): void {
  if (events.value[dateStr]) {
    events.value[dateStr] = events.value[dateStr].filter(
      (e) => e.id !== eventId
    )
    if (events.value[dateStr].length === 0) {
      delete events.value[dateStr]
    }
  }
  saveEvents()
}

function saveEvents(): void {
  localStorage.setItem('calendarEvents', JSON.stringify(events.value))
}

function loadEvents(): void {
  const stored = localStorage.getItem('calendarEvents')
  if (stored) {
    events.value = JSON.parse(stored)
  }
}

// マウント時
onMounted(() => {
  loadEvents()
  const today = formatDate(new Date())
  selectDate(today)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.container {
  display: flex;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.calendar-wrapper {
  flex: 1;
  min-width: 400px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 30px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.calendar-header h1 {
  font-size: 28px;
  color: #333;
  min-width: 200px;
  text-align: center;
}

.nav-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.nav-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.nav-btn:active {
  transform: scale(0.95);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  font-weight: bold;
  color: #666;
  padding: 10px;
  font-size: 14px;
}

.dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  min-height: 400px;
}

.date-cell {
  aspect-ratio: 1;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  overflow: hidden;
}

.date-cell:hover {
  background: #f5f5f5;
  border-color: #667eea;
  transform: translateY(-2px);
}

.date-cell.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.date-cell.other-month {
  background: #fafafa;
  border-color: #e0e0e0;
}

.date-cell.other-month .date-number {
  color: #ccc;
}

.date-number {
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 14px;
}

.events-inline {
  flex: 1;
  font-size: 10px;
  color: #666;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-preview {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  padding: 2px 4px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 2px solid #ff6b6b;
  padding-left: 3px;
  cursor: help;
}

.sidebar {
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 30px;
  max-height: 800px;
  overflow-y: auto;
}

.sidebar h2 {
  font-size: 22px;
  color: #333;
  margin-bottom: 20px;
}

.event-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.3s;
}

.event-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.2);
}

textarea.event-input {
  resize: vertical;
  min-height: 80px;
}

.add-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.add-btn:active {
  transform: translateY(0);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-events {
  color: #999;
  text-align: center;
  padding: 20px;
  font-size: 14px;
}

.event-item {
  background: #f8f9fa;
  padding: 15px;
  border-left: 4px solid #667eea;
  border-radius: 8px;
  transition: all 0.3s;
}

.event-item:hover {
  background: #f0f1ff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.event-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.event-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  font-size: 14px;
}

.event-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.4;
}

.delete-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.delete-btn:hover {
  background: #ff5252;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .calendar-wrapper {
    min-width: 100%;
  }

  .sidebar {
    min-width: 100%;
  }

  .calendar-header h1 {
    font-size: 22px;
  }

  .date-cell {
    font-size: 12px;
  }

  .date-number {
    margin-bottom: 2px;
  }

  .events-inline {
    font-size: 9px;
  }
}
</style>
