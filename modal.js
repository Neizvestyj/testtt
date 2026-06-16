Vue.component("modal", {
  // props: {
  //   show: { type: Boolean, required: true } // Если вы управляете видимостью извне
  // },
  // В данном случае компонент сам управляет своим состоянием через 'show'
  data() {
    return {
      isVisible: true, // Внутреннее состояние видимости
      isClosing: false, // Флаг для плавного закрытия
    };
  },
  emits: ['close', 'confirm'],

  mounted() {
    // При открытии модального окна устанавливаем фокус на кнопке "Нет"
    this.$nextTick(() => {
      this.$refs.cancelButton.focus();
    });
    // Блокируем прокрутку страницы под модальным окном
    document.body.style.overflow = 'hidden';
  },
  beforeUnmount() {
    // Восстанавливаем прокрутку при закрытии
    document.body.style.overflow = '';
  },

  template: `
    <transition name="modal" @before-leave="isClosing = true" @after-leave="isClosing = false">
      <div v-if="isVisible" class="modal-backdrop" @click.self="closeModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <header class="modal-header">
            <h3 id="modal-title">Удалить упражнение?</h3>
            <button class="modal-close-btn" @click="closeModal" aria-label="Закрыть">
              &times;
            </button>
          </header>

          <div class="modal-body">
            <p>Вы уверены, что хотите удалить это упражнение? Это действие нельзя будет отменить.</p>
          </div>

          <footer class="modal-footer button-group">
            <button
              ref="cancelButton"
              class="btn-modal btn-cancel"
              @click="closeModal"
            >
              Нет
            </button>
            <button
              class="btn-modal btn-confirm"
              @click="confirmAction"
            >
              Да, удалить
            </button>
          </footer>
        </div>
      </div>
    </transition>
  `,

  methods: {
    closeModal() {
      this.isVisible = false;
      // Эмиттим событие 'close' после завершения анимации ухода
      this.$emit('close');
    },
    confirmAction() {
      // Эмиттим событие 'confirm' перед закрытием
      this.$emit('confirm');
      this.closeModal();
    }
  }
});