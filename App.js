Vue.component('draggable', window.vuedraggable);
const App = {
  data() {
    return {
      itemToDeleteId: null,
      modal: false,
      openAccardion: false,
      flagAccardion: false,
      openDetails: null,
      flagBtn: false,
      nameExer: "",
      
      status: false,
      items: [
        {
          id: 1,
          name: "Тяга блока в горизонтале",
          exercise: [
            {
              date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
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
this.flagAccardion=false;

},
openFlagAccardion(){
this.openAccardion=false;
this.flagAccardion=!this.flagAccardion
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
      session.sumWeight += w * r;

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
        //date: new Date().toLocaleDateString(),
        date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }),
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
    del(id) {

      this.itemToDeleteId = id;
      this.modal = true;
    },
    confirmDel() {
      // Задержка 1000 мс (1 секунда)
      //await new Promise(resolve => setTimeout(resolve, 1000));
      if (this.itemToDeleteId !== null) {
        // Удаляем элемент
        this.items = this.items.filter(item => item.id !== this.itemToDeleteId);
        this.itemToDeleteId = null;
        this.saveExercise();
        this.modal = false;
      }
    },
    /*async del(id) {
      // Задержка 1000 мс (1 секунда)
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Удаляем элемент
      this.items = this.items.filter(item => item.id !== id);
      // Сохраняем изменения
      this.saveExercise();
    },*/

    removeSession(item, sessionIndex) {

      const exerciseLength = item.exercise.length;
      const realIndex = exerciseLength - 1 - sessionIndex;
      item.exercise.splice(realIndex, 1)

      // Сохраняем изменения
      this.saveExercise();
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
                date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' }),
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


  <div>

  
  <teleport to="body">
  <modal @close="modal=false"
  @confirm="confirmDel"
  v-if="modal">
  </modal>
  </teleport>
  
  
  </div>

   <div id="timer-root"></div>
<app-timer />


<span class="status" v-if="status">&#128994;
</span>
<span class="status" v-else="status">&#128308;</span>

<div class="list-wrapper">

<draggable v-model="items" 
:options="{handle:'.drag-handle',scroll:true,scrollSensitivity:40,scrollSpeed:10}"
animation="150" :ghost-class="'ghost'" tag="ul" class="list">

<div v-for="item in items" :key="item.id"> 
<div :class="['accordion', { open: openAccardion === item.id }]" >
    <div @click="toggleAccardion(item.id)" class="head">




    <button class="button" @click="del(item.id)">
<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 69 14"
    class="svgIcon bin-top"
  >
    <g clip-path="url(#clip0_35_24)">
      <path
        fill="black"
        d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_35_24">
        <rect fill="white" height="14" width="69"></rect>
      </clipPath>
    </defs>
  </svg>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 69 57"
    class="svgIcon bin-bottom"
  >
    <g clip-path="url(#clip0_35_22)">
      <path
        fill="black"
        d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_35_22">
        <rect fill="white" height="57" width="69"></rect>
      </clipPath>
    </defs>
  </svg>

</button>
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
     <button @click="addExercise(item)" class="btn btnRigt" id="btnStart">NEW</button>
                   </div>
    </div>
         </div>
  
         <div class="exercise"> 
         <ul >
<li  v-for="(exer,exIndex) in item.exercise.slice().reverse()" :key="exIndex"> 

<div class="session-header">
<button class="removeButten" @click="removeSession(item,exIndex)">&#10008;</button>

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
</div>

         </li>
         </ul>
         </div>


    </div>
  </div>
</div>



</draggable>
</div>

<div class="added"
 :class="['accordion', { open: flagAccardion}]">
  <div class="head"
@click="openFlagAccardion()"
>
      <span>Открыть панель</span>
      <span  class="icon">+</span>
    </div>

    <div v-if="flagAccardion" class="body">
      <p>Введите названия упражнения</p>
<input v-model="nameExer">
<button 
class="btn-addNew"
@click="addNewExercise()">Добавить упражнение</button>
    </div>
  </div>

</div>`
}