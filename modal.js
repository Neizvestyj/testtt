Vue.component("modal", {
    data() {
        return {

        }
    },
    //emits:['close'],

    template: `<div>
<div @click='$emit("close")' class="modal-backdrop"></div>

<div class="modal">
<h3>Удалить упражнение? </h3>
<div class="button-group">
    <button @click="$emit('confirm')">Да</button>
     <!-- gap создаст отступ -->
    <button @click="$emit('close')">Нет</button>
</div>
</div>

</div>`
})