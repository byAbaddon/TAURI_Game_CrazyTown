
<script setup >
import { ref, reactive, toRefs, computed, onUpdated, watchEffect, defineEmits} from 'vue'

import actorData from "@/system/actorDialogText.json"
// import actorData from "@/system/actorDialogTextTEST.json"

const emit = defineEmits(['eventAllowedItemDeal',])

watchEffect(() => {
  let effect = props.askActor
  setTimeout(() => {
    if (!isAlert.value && effect || !effect) {
      isEndConversation.value = false
    }
  }, 500)
})


onUpdated(() => {
  if (['road', 'city', 'atTheShop', 'shop', 'shopSwimwear', 'shopPumaGold', 'atTheService', 'government', 'cabinet'
   , 'beachLeft', 'beachRight' ,'ship']
    .includes(props.currentState)) {
    titleName.value = actorData[currentState.value].name
  } else {
    if (isOnlyAsk.value) {
      isAlert.value = false
    }
    if (!isAlert.value)
      isEndConversation.value = true
  }

})


const props = defineProps(['currentState', 'askActor', 'mapIconsDestinations'])
const { currentState, askActor, conversation } = toRefs(props)

let isAlert = ref(true)
let numTalk = ref(0)

let isEndConversation = ref(false)
let isOnlyAsk = ref(false)
let listOfAsks = ref(null)
let listOfAnswers = ref(null)

let titleName = ref('topCat')

let talkData = computed(props => {
  try {
    const { state, name, img, conversation, askAndAnswer } = actorData[currentState.value]

    if (!isOnlyAsk.value) {
      var result = conversation[numTalk.value][0].split('<br>')
      result.conversation = result

      // set bool only ask
      if (result == '@ask@') { 
        isOnlyAsk.value = true
        isAlert.value = false
        
      }
    }
    //------------------------   // generate list of all questions
    if (isOnlyAsk.value) {
      result.asks = askAndAnswer.map(x => x.ask)
    }
    return result
  } catch (e) {
    // console.log(e, 'error')
    return ''
  }
})

const sendQuestion = (asked) => {
  // send emit allowed items change
  if (asked &&  asked.includes('@Deal@')) {
      emit('eventAllowedItemDeal')
  }  

  if (asked == 'Bye') {
    allowMapDestinations() // call this method to add new map destination
    isEndConversation.value = true
    return
  }

  if (isOnlyAsk.value && asked && !isAlert.value) {
    isAlert.value = !isAlert.value
    numTalk.value = 0 // always be zero
    // console.log('clicked--- ', asked)
    listOfAnswers.value = actorData[currentState.value]
      .askAndAnswer.filter(x => x.ask == asked)[0].answer.split('<br>')
  }
  else if (isAlert.value && listOfAnswers.value) {
    isAlert.value = !isAlert.value
    listOfAsks.value = actorData[currentState.value].askAndAnswer.map(x => x.ask)
    // console.log(listOfAsks.value)
  }
  
}

const loadAskData = () => listOfAsks.value = actorData[currentState.value].askAndAnswer.map(x => x.ask)

const nameToTitleCase = n => numTalk.value & 1 ? 'TopCat' : n.charAt(0).toUpperCase() + n.slice(1)

const allowMapDestinations = () => {  // if '@Buy@' call this method
  if (props.currentState == 'road') {
    props.mapIconsDestinations['ship'].active = true
    props.mapIconsDestinations['city'].active = true
  }

  if (props.currentState == 'city') {
    props.mapIconsDestinations['shop'].active = true
  } 

  if (props.currentState == 'shop') {
    props.mapIconsDestinations['mall'].active = true
  } 

  if (props.currentState == 'shopSwimwear') {
    props.mapIconsDestinations['service'].active = true
  } 
  
  if (props.currentState == 'atTheService') {
    props.mapIconsDestinations['government'].active = true
  } 
}

</script>



<template>
  <div v-show="!isEndConversation">
    <!--     Alert dialog  -->
    <v-alert v-if="currentState && isAlert" tag="shaped" :prominent="false" class="alert mx-auto rounded-pill"
      :title="nameToTitleCase(titleName)" style="position:absolute; top: 28em; left:1em;" width="54em " :border="true" border-color="blue"
      color="rgba(0, 10, 20, 0.7)" theme="dark" icon="mdi-account-voice" density="compact"
      @click="[ numTalk++, sendQuestion(), loadAskData()]">
      <p v-for="(row, i) in talkData.conversation || listOfAnswers" :key="i">{{ row }}</p>
      <br>
      <template #prepend>
        <v-avatar class="mt-4" size="4em" variant="text">
          <v-img :src="require(`@/assets/images/actors/${numTalk & 1 ? 'topCat' : titleName}/1.png`)" alt="John"></v-img>
        </v-avatar>
      </template>
    </v-alert>

    <!--     ASK   -->
    <v-chip-group v-else class="text-white d-flex flex-column  justify-center"
     style="position:absolute;  top: 10em; left: 12em; width: fit-content;"
      variant="tonal">
      <v-chip v-for="(ask, index) in talkData.asks || listOfAsks" :key="index" style="background-color:rgba(0,0,35, 0.8);"
        :class="{ 'justify-center font-weight-bold': index == listOfAsks.length - 1 }" @click="[sendQuestion(ask)]">
        {{ ask }}
      </v-chip>
    </v-chip-group>
  </div>
</template>


<style scope>
.v-alert-title {
  color: paleturquoise;
  text-decoration: underline;
}


.v-alert:hover {
  cursor: cell;
  border: 1px solid;
  /* transform: scale(1.005); */
}

/* change background color top active field */
.v-list .v-list-item--active {
  background-color: rgba(69, 99, 25, 0.3) !important;
}


/* fix icon field size */
.v-input--horizontal .v-input__prepend {
  -webkit-margin-end: 16px;
  margin-inline-end: 0px;
}

/* change chip background */
.v-select__selection>.v-chip.v-chip--density-default {
  background: darkslateblue;
}

.v-select__selection,
.v-select__selection--comma,
.v-select.v-text-field input {
  color: rgb(245, 245, 250) !important;

}

.v-messages__message {
  font-size: medium;
  background: rgba(70, 60, 30, 0.9);
  color: greenyellow !important;
  margin-top: 0.6em;
  line-height: normal;
}
</style>

