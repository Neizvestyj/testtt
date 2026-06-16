// src/components/timer.js

// Регистрируем глобальный компонент с именем 'app-timer'
Vue.component('app-timer', {
  // Свойство data в глобальных компонентах должно быть функцией
  data() {
    return {
      timer: null,
      secondsElapsed: 0
    };
  },

  // Вычисляемое свойство для форматирования времени
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.secondsElapsed / 60);
      const seconds = this.secondsElapsed % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  },

  // Методы компонента
  methods: {
    startTimer() {
      if (this.timer) return;
      this.timer = setInterval(() => {
        this.secondsElapsed++;
      }, 1000);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    resetTimer() {
      this.stopTimer();
      this.secondsElapsed = 0;
    }
  },

  // Хук жизненного цикла для очистки интервала
  beforeDestroy() {
    this.stopTimer();
  },

  // Шаблон компонента (теперь это строка, а не отдельный тег <template>)
  template: `
    <div>
      <teleport to="#timer-root">
        <div class="timer-container">
          <h1 class="time-holder">{{ formattedTime }}</h1>
<button class="button-time" @click="startTimer">Старт</button>
<button class="button-time" @click="resetTimer">Сброс</button>
        </div>
      </teleport>
    </div>
  `
});