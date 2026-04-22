Vue.component('draggable', window.vuedraggable);
const App = {
  data() {
    return {
      openAccardion: false,
      openDetails: null,
      flagBtn: false,
      nameExer: "",
      flagAccardion: false,
      status: false,
      items: [
        {
          id: 1,
          name: "Тяга блока в горизонтале",
          exercise: [
            {
              date: new Date().toLocaleDateString(),
              logs: [],
              sumReps: 0,
              sumWeight: 0,
            }
          ]

        },

        {
          id: 2,
          name: "Вертикальна тяга блока",
          exercise: [
            {
              date: new Date().toLocaleDateString(),
              logs: [],
              sumReps: 0,
              sumWeight: 0,
            }
          ]
        },
        {
          id: 3,
          name: "Подьем штанги на бицепс",
          exercise: [
            {
              date: new Date().toLocaleDateString(),
              logs: [],
              sumReps: 0,
              sumWeight: 0
            }
          ]
        },
      ]
    }
  },
  mounted() {
    this.loadingExercise()

  },
  methods: {
    toggleAccardion(id) {
      this.openAccardion = this.openAccardion === id ? null : id;
    },

    fixLog(item, exIndex) {
      //item.logs.unshift({ weight: item.weight, reps: item.reps })
      // если нет тренировок, создаём новую
      if (!Array.isArray(item.exercise) || item.exercise.length === 0) {
        item.exercise = [{ date: new Date().toISOString().slice(0, 10), logs: [] }];
      }
      const session = item.exercise[item.exercise.length - 1];
      const w = item.weight != null ? item.weight : 0;
      const r = item.reps != null ? item.reps : 0;
      // добавляем в начало списка логов (новые сверху)
      session.logs.push({ weight: w, reps: r });
      session.sumReps += r;
      session.sumWeight += w;

      //this.openDetails=this.openDetails===null?null:0;
      //item.exercise[0]
      //exer[exer.length-1]
      //exer.exindex;

      this.saveExercise(item)
    },

    addExercise(item) {
      // const newId = this.items.exercise.length ? Math.max(...this.items.map(i => i.id)) + 1 : 1;
      if (!Array.isArray(item.exercise)) item.exercise = [];
      item.exercise.push({
        //ide: newId,
        date: new Date().toLocaleDateString(),
        logs: [],
        sumReps: 0,
        sumWeight: 0
      });
      // можно сразу открыть аккордеон, если нужно
      this.openAccardion = item.id;
      this.saveExercise(item);
      this.openDetails = 0;
      this.flagBtn = true;
    },

    saveExercise(item) {
      try {
        localStorage.setItem("workoutItems", JSON.stringify(this.items));
      } catch (e) {
        alert("Ошибка при сохранении");
        consile.log("Ошибка при созранении", e);
      }
    },

    loadingExercise(item) {
      try {
        const savedExer = localStorage.getItem("workoutItems");
        if (savedExer) {

          this.status = true;

          const parsed = JSON.parse(savedExer);
          if (Array.isArray(parsed)) {
            this.items = parsed;
          }
        }
      } catch (e) {

        this.status = false

        alert("Ошибка при сохранении");
        consile.log("Ошибка при созранении", e);
      }
    },
    del() {
      localStorage.clear()
    },

    //toggleDetails(exIndex){
    //this.openDetails=this.openDetails===exIndex?null:exIndex
    //},


    addNewExercise() {
      if (this.nameExer !== "") {
        const newId = this.items.length ? Math.max(...this.items.map(i => i.id)) + 1 : 1;

        this.items.push(
          {
            id: newId,
            name: this.nameExer,
            exercise: [
              {
                date: new Date().toLocaleDateString(),
                logs: [],
                sumReps: 0,
                sumWeight: 0
              }]
          });

        this.nameExer = "";
        this.saveExercise();
        this.flagAccardion = false;
      }
    }
  },
  watch: {
    items: {
      handler(item) {
        this.saveExercise(item);
      },
      deep: true
    }

  },
  template: `<div>
<button @click="del">del</button>



<span class="status" v-if="status">&#128994;</span>
<span class="status" v-else="status">&#128308;</span>

<div class="list-wrapper">

<draggable v-model="items" 
:options="{handle:'.drag-handle',scroll:true,scrollSensitivity:40,scrollSpeed:10}"
animation="150" :ghost-class="'ghost'" tag="ul" class="list">

<div v-for="item in items" :key="item.id"> 
<div :class="['accordion', { open: openAccardion === item.id }]" >
    <div @click="toggleAccardion(item.id)" class="head">
      <span>{{item.name}}</span>
<span class="icon drag-handle">☰</span>
    </div>

    <div v-if="openAccardion===item.id" class="body">
        
          <div  class="section">
    <div class="selectName box">
<span>ВЕС В КГ</span>

<select v-model.number="item.weight">
<option v-for="n in 150" :key="n" :value="n">{{ n }}</option>
</select>
     </div>

     <div class="selectName box">
<span>ПОВТОРЕНИЯ</span>
<select v-model.number="item.reps">
<option  v-for="n in 100" :key="n" :value="n">{{ n }}</option>
</select>
     </div>

   <div class="btnGrop">
                   <div>
     <button @click="fixLog(item,exIndex)" class="btn" id="fixLog">FIX</button>
                   </div>

                   <div>
     <button @click="addExercise(item)" class="btn btnRigt" id="btnStart">{{flagBtn?"END":"NEW"}}</button>
                   </div>
    </div>
         </div>
  
         <div class="exercise"> 
         <ul>
<li  v-for="(exer,exIndex) in item.exercise.slice().reverse()" :key="exIndex"> 
        
<details :open="openDetails===exIndex" 
@click="toggleDetails(exIndex)"
class="first-details">

<summary class="dateOfexer">{{item.exercise.length-exIndex}} {{exer.date}}  

<!--
<span v-if="exer.logs.length>0">{{Math.max(...exer.logs.map(log=>log.weight||0))}}
{{Math.max(...exer.logs.map(log=>log.reps||0))}}</span>
-->
{{exer.sumWeight}}
{{exer.sumReps}}

</summary>


        <div class="building_2">
          <div class="logsss" >
          <ul>
          

          <div class="logs-grid">
          <div class="grid-header">
<div>#</div> <div>Вес</div> <div>Повт.</div>
          </div>
        
<div class="grid-row " v-for="(log, logIndex) in exer.logs.slice().reverse().filter(l=> l.weight != null && l.reps != null)" :key="logIndex">
      
            <div>{{ exer.logs.length - logIndex}}</div>
<div>{{ log.weight }}</div>
<div>{{ log.reps }}</div>
</div>
          
<div v-if="exer.logs.length === 0" class="no-logs">Логов нет</div>
</div>

          </ul>
          </div>
        </div>


      </details>
         </li>
         </ul>
         </div>


    </div>
  </div>
</div>



</draggable>
</div>

<div :class="['accordion', { open: flagAccardion}]">
    <div class="head"
@click="flagAccardion=!flagAccardion"
>
      <span>Открыть панель</span>
      <span  class="icon">+</span>
    </div>

    <div v-if="flagAccardion" class="body">
      <p>Введите названия упражнения</p>
<input v-model="nameExer">
<button @click="addNewExercise()">Добавить упражнение</button>
    </div>
  </div>
</div>`
}

