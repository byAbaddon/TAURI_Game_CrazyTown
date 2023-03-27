<script setup>

import { onMounted, onActivated, ref, toRefs, reactive, computed, watchEffect } from 'vue'
import Music from "@/system/music.js"
import infoTextMessagesObj from "@/system/infoText"

//import components
import alertDialog from "@/components/alert.vue"




onActivated(() =>  window.location.reload()) //reload if start first time
onMounted(() => generalDialog.value = true ) // init dialog 

const closeGeneralDialog = () => console.log("closed")
let stack = []
let backpackItems = ref([])
let infoMessagesList = ref([])
let messageNumber = ref(0)
let currentMessageNumber = ref(0)
let generalDialog = ref(false)
let modalMapDialog = ref(false)
let modalInfoDialog = ref(false)
let modalItemsDialog = ref(false)

let infoAnimationActivator = ref(false)
let isStartGameMusic = ref(false)
let isGrabBackpack = ref(false)
let startAnimation = ref(false)
let startFinalAnimation = ref(false)
let isInternalNavigation = ref(false)
let backToState = ref('')
let currentState = ref('')

let firstAlertDialog = ref(true)  // start conversation
let askActor = ref(false)
let isMakeDeal = ref(false)

const music = ref(new Music())

//play music with current state
watchEffect(() => {
  try {
    music.value.stopMusic()
  } catch { null }

  if (currentState.value == '' && !isStartGameMusic.value) {    //intro state
    music.value.backgroundMusic(require('@/assets/sound/background/bg_intro.mp3'))
    music.value.loopMusic()
    isStartGameMusic.value = true
  }

  else if (currentState.value == 'descent') {
    music.value.backgroundMusic(require('@/assets/sound/background/descent.mp3'), 0.2)
  }

  else if (currentState.value == 'epilogue') {
    music.value.backgroundMusic(require('@/assets/sound/background/epilogue.mp3'), 0.3)
    music.value.loopMusic()
  }

  else if (currentState.value != 'intro' && currentState.value != 'descent') {
    music.value.backgroundMusic(require('@/assets/sound/background/game.mp3'), 0.2)
    music.value.loopMusic()
  }
})


let itemsBackpackObj = reactive({
  'necklace': true,
  'money': false,
  'swimsuit': false,
  'aphro': false,
  'aging': false,
  'coin': false,
  'pistole': false,
  'suit': false,
  'pass': false,
  'license': false,
  'vibrator': false,
  'squirt': false,
})

let objCurrentCard = reactive({
  intro: true,  //true
  descent: false,
  ship: false, //
  road: false,
  city: false,
  shop: false,
  atTheShop: false,
  mall: false,
  atTheMall: false,
  shopSwimwear: false,
  shopPumaGold: false,
  service: false,
  atTheService: false,
  government: false,
  cabinet: false,
  beach: false,
  beachLeft: false,
  beachRight: false,
  epilogue: false
})

let mapIconsDestinations = reactive({  //set active point in Map
  'ship': { active: false },
  'service': { active: false },
  'beach': { active: false },
  'government': { active: false },
  'city': { active: false },
  'mall': { active: false },
  'shop': { active: false },
})


function cardNavigator(state) {
  currentState.value = state
  try {
    music.value.stopMusic()
    music.value.effectMusic(require('@/assets/sound/effects/knocking.wav'))
  } catch { null }


  // console.log(stack , 'stack any time')
  if (state) {
    stack.push(state)
  } else {
    let newDestination = stack.pop()
    let oldDestination = stack.pop()
    // console.log('stack before' , stack);
    stack.splice(0, 999, oldDestination)
    // console.log('stack after', stack);
    if (!oldDestination && newDestination == 'atTheMall') {
      state = 'mall'
    } else {
      state = oldDestination
    }
  }

  if (['mall', 'shop', 'service', 'government', 'beach'].includes(state)) { // remove back button from nav bar   # add array with more cases 
    isInternalNavigation.value = false
  }

  //rest all state
  Object.keys(objCurrentCard).forEach(key => objCurrentCard[key] = false)
  //add current state
  objCurrentCard[state] = true
}

function grabItems(grab) {
  music.value.effectMusic(require('@/assets/sound/effects/knocking.wav'))
  if (grab == 'backpack') {
    isGrabBackpack.value = true
    document.querySelector('#backpack').style.display = 'none'
    infoAnimationActivator.value = true
  }

  if (grab == 'vibrator') {
    document.querySelector('#vibrator').style.display = 'none'
    itemsBackpackObj.vibrator = true
  }

  if (grab == 'coin') {
    document.querySelector('#coin').style.display = 'none'
    itemsBackpackObj.coin = true
  }
}


// check is open info dialog, add read message
let isInfoBoxActive = computed(() => {
  if (infoMessagesList.value.length == 0) {
    messageNumber.value = 2
  }

  // prevent back to low message number
  if (currentMessageNumber.value < messageNumber.value) {
    music.value.effectMusic(require('../assets/sound/effects/ring.wav'))   // make sound
    infoAnimationActivator.value = true                              // make animation 
    currentMessageNumber.value = messageNumber.value
  }

  infoMessagesList.value = []
  for (let i = currentMessageNumber.value; i > 0; i--) {
    infoMessagesList.value.push(infoTextMessagesObj[i])
  }

})


const eventAllowedItemDeal = () => isMakeDeal.value = true

function clickBackpackItem(itemKey) {

  if (isMakeDeal.value) {
    if (currentState.value == 'shopPumaGold' && itemKey == 'necklace') {
      music.value.effectMusic(require('@/assets/sound/effects/item.wav'))
      delete itemsBackpackObj.necklace
      itemsBackpackObj.money = true
    }

    if (currentState.value == 'city' && itemKey == 'money') {
      music.value.effectMusic(require('@/assets/sound/effects/item.wav'))
      itemsBackpackObj.aging = true
      itemsBackpackObj.aphro = true
    }


    if (currentState.value == 'shopSwimwear' && itemKey == 'money') {
      music.value.effectMusic(require('@/assets/sound/effects/item.wav'))
      itemsBackpackObj.swimsuit = true
    }


    if (currentState.value == 'atTheShop' && itemKey == 'aging') { //change to old men
      music.value.effectMusic(require('@/assets/sound/effects/item.wav'))
      delete itemsBackpackObj.aging
    }

    if (currentState.value == 'atTheShop' && itemKey == 'money' && !itemsBackpackObj.hasOwnProperty('aging')) {
      music.value.effectMusic(require('@/assets/sound/effects/item.wav'))
      delete itemsBackpackObj.coin
      itemsBackpackObj.pistole = true
      itemsBackpackObj.suit = true
    }

    if (currentState.value == 'government' && itemKey == 'pistole') {
      music.value.effectMusic(require('@/assets/sound/effects/item.wav'))
      delete itemsBackpackObj.pistole
      itemsBackpackObj.pass = true
    }
    if (currentState.value == 'cabinet' && itemKey == 'pass') {
      music.value.effectMusic(require('@/assets/sound/effects/item.wav'))
      // delete itemsBackpackObj.suit
      delete itemsBackpackObj.pass
      itemsBackpackObj.license = true
    }
    if (currentState.value == 'atTheService' && itemKey == 'license') {
      music.value.effectMusic(require('@/assets/sound/effects/item.wav'))
      delete itemsBackpackObj.license
      mapIconsDestinations['beach'].active = true  // add beach to map location   
    }

    if (currentState.value == 'beachRight' && (itemKey == 'aphro' || itemKey == 'vibrator')) {
      music.value.effectMusic(require('@/assets/sound/effects/item.wav'))
      delete itemsBackpackObj.aphro
      delete itemsBackpackObj.vibrator
      itemsBackpackObj.squirt = true
    }

    if (currentState.value == 'ship' && itemKey == 'money') {
      music.value.effectMusic(require('@/assets/sound/effects/item.wav'))
      delete itemsBackpackObj.money
    }

    isMakeDeal.value = false
    // console.log(itemKey)
  }
}

// open asks dialog if click on actor
const askActorDialog = () => askActor.value = !askActor.value


</script>



<template>
  <div>
    <v-row justify="center">
      <!-- start game dialog
                              @click="closeGeneralDialog(), dialog=false"
                                                              -->
      <v-dialog v-model="generalDialog" persistent eager :no-click-animation="true" width="900" height="600" min-width="900"
        min-height="600" max-width="900" max-height="600">


        <!-- ----------------------- ((( GlobalNavBar )))---------------------------------------------------->
        <v-container class="navbar" v-show="isGrabBackpack && !objCurrentCard.epilogue">
          <v-row>
            <!-- btn back-->
            <v-btn v-show="isInternalNavigation" prepend-icon="mdi-arrow-left-bold-box-outline" width="80" color="error"
              @click="cardNavigator(backToState)"> Back</v-btn>

            <v-spacer></v-spacer>
            <!-- btn info-->
            <v-btn @click="[modalInfoDialog = true, infoAnimationActivator = false, isInfoBoxActive,]" :rounded="true"
              color="secondary" max-width="50" variant="text">

              <v-img v-if="!infoAnimationActivator" height="35" width="35"
                :src="require('@/assets/images/items/info.png')"> </v-img>
              <v-img v-else height="35" width="35" :src="require('@/assets/images/items/info2.png')"> </v-img>

            </v-btn>

            <!-- btn map-->
            <v-btn v-show="!isInternalNavigation" @click="modalMapDialog = true" :rounded="true" color="secondary"
              max-width="50" variant="text">
              <v-img height="30" width="30" :src="require('@/assets/images/items/map.png')"> </v-img>
            </v-btn>


            <!-- btn items-->
            <v-btn @click="[modalItemsDialog = true]" :rounded="true" color="secondary" max-width="50" variant="text">
              <v-img height="40" width="40" :src="require('@/assets/images/items/backpack.png')"> </v-img>
            </v-btn>

            <v-spacer></v-spacer>
            <v-btn v-show="!infoAnimationActivator && objCurrentCard.ship && !mapIconsDestinations['city'].active"
              append-icon="mdi-arrow-right-bold-box-outline" color="primary" @click="cardNavigator('road')">Go</v-btn>
          </v-row>
        </v-container>

        <!-------------------------- ((( ModalDialogs ))) --------------------------------------------------->
        <!-- Map-->
        <v-row justify="center">
          <v-dialog v-model="modalMapDialog" persistent width="800" height="550" min-width="800" min-height="550">
            <v-card color="rgba(130, 160, 130, 0.3)">
              <v-card-title class="caption ma-2">
                <v-row>
                  <span class="ml-5 text-white text-decoration-underline">Use Google's location service!</span>
                  <v-spacer></v-spacer>
                  <v-btn class="text-center font-weight-bold" color="red-accent-2" variant="text"
                    @click="modalMapDialog = false">
                    Close
                  </v-btn>
                </v-row>
              </v-card-title>

              <v-img class="mx-auto" src="@/assets/images/items/mapTrack.png" width="750" height="500">
                <!-- add map items destinations   -->
                <v-row>
                  <v-col v-for="(value, key, index) in mapIconsDestinations" :key="index" cols="4">

                    <v-chip class="ml-16 mt-6" @click="[cardNavigator(key), modalMapDialog = false]"
                      style="width:100px ; height: 80px;" variant="text" :disabled="!value.active">
                      <v-img :src="require(`@/assets/images/background/${key}.png`)" style="border-radius: 20px"></v-img>
                    </v-chip>
                    <p class="text-uppercase  font-weight-bold text-decoration-underline  text-indigo-darken-3"
                      style="margin-left: 6em">{{ key }}
                    </p>
                  </v-col>
                </v-row>
              </v-img>
            </v-card>
          </v-dialog>

          <!-- Info-->
          <v-dialog v-model="modalInfoDialog" persistent width="800" height="550" min-width="800" min-height="550">
            <v-card color="rgba(0, 0, 0, 0.8)">
              <v-card-title class="caption ma-2">
                <v-row>
                  <span><v-img width="50" height="80" src="@/assets/images/items/aiHead.png"></v-img></span>
                  <span class="ml-5 mt-3 text-white text-decoration-underline">AI assistant - last generation. </span>
                  <v-spacer></v-spacer>
                  <v-btn class="text-center font-weight-bold" color="red-accent-2" variant="text"
                    @click="[modalInfoDialog = false, infoAnimationActivator = false]">
                    Close
                  </v-btn>
                </v-row>
              </v-card-title>
              <v-card-text v-for="(text, index) in infoMessagesList" :key="index">
                <p class="text-red text-decoration-underline ">Message № ({{ infoMessagesList.length - index }})</p>
                <p class="text-orange"> {{ text }} </p>
              </v-card-text>
            </v-card>
          </v-dialog>


          <!-- Items-->
          <v-dialog v-model="modalItemsDialog" persistent width="800" height="550" min-width="800" min-height="550">
            <v-card color="rgba(0, 0, 0, 0.8)">
              <v-card-title class="caption ma-2">
                <v-row>
                  <span class="ml-5 mt-3 text-white text-decoration-underline">List of backpack items: </span>
                  <v-spacer></v-spacer>
                  <v-btn class="text-center font-weight-bold" color="red-accent-2" variant="text"
                    @click="[modalItemsDialog = false]">
                    Close
                  </v-btn>
                </v-row>
              </v-card-title>
              <v-card-text>
                <!-- <v-chip-group style="min-height: 170px;">   </v-chip-group> -->
                <v-row style="min-height: 80px; margin: 0">
                  <v-col :cols="2" v-for="(value, key) in itemsBackpackObj" :key="value">
                    <v-img v-if="value" :src="require(`@/assets/images/items/backpackItems/${key}.png`)"
                      @click="clickBackpackItem(key)" aspect-ratio="1" :width="40" :height="40" class="items ml-2">
                    </v-img>
                    <p v-if="value" class="text-teal mt-1"> {{ key }}</p>
                  </v-col>
                </v-row>






              </v-card-text>
            </v-card>
          </v-dialog>


        </v-row>

        <!---------------------------(((STATES))) ----------------------------------------------------------->

        <!-- -------------intro start game card -->
        <v-card v-show="objCurrentCard.intro" min-width="900" min-height="600">
          <v-img src="@/assets/images/background/intro.png" cover   lazy-src="@/assets/images/background/loading2.png">
            <h1 class="gameName font-effect-fire-animation">Crazy Town</h1>
            <v-row class="text-center">
              <v-col cols="12">
                <h2 class="text-white text-blue-grey-lighten-3">
                  Press button to start game...
                </h2>
              </v-col>
              <v-col class="mt-12">
                <v-btn variant="elevated" rounded="pill" size="x-large" color="error"
                  @click="cardNavigator('descent')">Play</v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-12">
              <v-col cols="9" class="mt-10 pl-8 font-italic"> by Abaddon</v-col>
              <v-col cols="3" class="mt-10 pl-16 font-italic">
                Copyright: &copy; 2023
              </v-col>
            </v-row>
          </v-img>
        </v-card>

        <!-- ---------------------descent card -->
        <v-carousel v-show="objCurrentCard.descent && !startAnimation" width="900" height="600" hide-delimiters
          hide-delimiter-background :show-arrows="false" :cycle="true" :interval="3800">
          <v-carousel-item v-for="i in 7" :key="i">
            <v-sheet height="100%">
              <div :v-if="`${i == 7 ? startAnimation = true : null}`"
                class="d-flex fill-height justify-center align-center">
                <img :src="require(`@/assets/images/background/descent/${i}.png`)" cover>
              </div>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>

        <v-card v-show="objCurrentCard.descent && startAnimation" min-width="900" min-height="600">
          <v-img src="@/assets/images/background/descent/7.png" min-width="900" min-height="600">
            <v-btn @click="cardNavigator('ship')" position="relative" class="btn-hover-effect" size="24px"
              icon="mdi-magnify" :style="{ 'margin': '26em 0 0 31em' }">
            </v-btn>
          </v-img>
        </v-card>

        <!-- ---------------------ship card -->
        <v-card messageNumber=4 v-show="objCurrentCard.ship" min-width="900" min-height="600">
          <v-img v-if="!itemsBackpackObj.squirt" src="@/assets/images/background/ship.png" cover
            lazy-src="@/assets/images/background/loading.png">
          
            <!-- player -->
            <v-img class="plyer" src="@/assets/images/actors/topCat/1.png" height="150" width="900"
              style="margin: -9em -30em ;  left:800px; top: 520px">
            </v-img>
            <!-- backpack -->
            <v-img src="@/assets/images/items/backpack.png" height="45" width="45" id='backpack' class="item"
              style="margin: 0em 0em ;  left:800px; top: 620px" @click="[grabItems('backpack'), isInfoBoxActive]">
            </v-img>
          </v-img>

          <v-img v-else src="@/assets/images/background/ship2.png" cover>

            <!-- player  -->
            <v-img class="plyer" src="@/assets/images/actors/topCat/1.png" height="150" width="900"
              style="margin: -6em -70em ;  left:800px; top: 520px">
            </v-img>

            <!-- Master Johnny      -->
            <v-img v-show="itemsBackpackObj.money"
              @click="[askActorDialog(), isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]" class="actors"
              src="@/assets/images/actors/master/1.png" height="22em" width="3.7em" style="top: 20.3em; left:21em">
            </v-img>

            <!-- btn to switch state to epilogue -->
            <v-btn v-show="!itemsBackpackObj.money" @click="cardNavigator('epilogue')" position="relative"
              class="btn-hover-effect" size="24px" icon="mdi-magnify" :style="{ 'margin': '31em 0 0 33em' }">
            </v-btn>

            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />

          </v-img>



        </v-card>


        <!-- ---------------------road card -->
        <v-card v-show="objCurrentCard.road" min-width="900" min-height="600">
          <v-img src="@/assets/images/background/road.png" cover lazy-src="@/assets/images/background/loading.png">

            <!-- driver          -->
            <v-img
              @click="[askActorDialog(), messageNumber = 5, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/driver/1.png" height="14em" width="6em"
              style="top: 20em; left:35em">
            </v-img>

            <!-- player -->
            <v-img class="player" src="@/assets/images/actors/topCat/2.png" height="15em" width="6em"
              style="top: 21em; left:46em; ">
            </v-img>
            <!-- send props  -->
            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />

          </v-img>
        </v-card>


        <!-- ---------------------city card -->
        <v-card v-show="objCurrentCard.city" min-width="900" min-height="600">
          <v-img src="@/assets/images/background/city.png" cover lazy-src="@/assets/images/background/loading.png">

            <!-- Just Miro          -->
            <v-img
              @click="[askActorDialog(), messageNumber = 6, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/miro/1.png" height="13em" width="6em"
              style="top: 17em; left:20em">
            </v-img>

            <!-- player -->
            <v-img class="player" src="@/assets/images/actors/topCat/2.png" height="14em" width="6em"
              style="top: 18em; left:41em; ">
            </v-img>

            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />

          </v-img>
        </v-card>


        <!-- ---------------------Shop    lora was open if has item: coin and cocktail  -->
        <v-card v-show="objCurrentCard.shop" min-width="900" min-height="600">
          <v-img src="@/assets/images/background/shop.png" cover  lazy-src="@/assets/images/background/loading.png">

            <v-btn v-if="itemsBackpackObj.coin && itemsBackpackObj.aphro"
              @click="[cardNavigator('atTheShop'), isInternalNavigation = true]" position="relative"
              class="btn-hover-effect" size="24px" icon="mdi-magnify"
              style="position:absolute;   margin-top:25em ; left:32em">
            </v-btn>

            <!-- player -->
            <v-img class="player" src="@/assets/images/actors/topCat/1.png" height="15em" width="7em"
              style="top: 22em; left:24em; ">
            </v-img>

            <!-- professor -->
            <v-img
              @click="[askActorDialog(), messageNumber = 7, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/professor/2.png" height="" width="11em"
              style="top: 22em; left:40em">
            </v-img>
            <alertDialog :current-state="currentState" :ask-actor="askActor"
              :map-icons-destinations="mapIconsDestinations" />

          </v-img>
        </v-card>


        <!-- ---------------------atTheShop -->
        <v-card v-show="objCurrentCard.atTheShop">
          <v-img src="@/assets/images/background/atTheShop.png" cover lazy-src="@/assets/images/background/loading.png">

            <!-- Fat Lora          -->
            <v-img
              @click="[askActorDialog(), messageNumber = 12, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/lora/1.png" height="13em" width="7em"
              style="top: 17em; left:27em">
            </v-img>

            <!-- player -->
            <v-img v-if="itemsBackpackObj.hasOwnProperty('aging')" class="player"
              src="@/assets/images/actors/topCat/1.png" height="18em" width="7em" style="top: 18.5em; left:12em; ">
            </v-img>

            <v-img v-else class="player" src="@/assets/images/actors/topCat/3.png" height="18em" width="7em"
              style="top: 18.5em; left:12em; ">
            </v-img>

            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />
          </v-img>
        </v-card>


        <!-- ---------------------Mall -->
        <v-card v-show="objCurrentCard.mall" min-width="900" min-height="600">
          <v-img src="@/assets/images/background/mall.png" cover  lazy-src="@/assets/images/background/loading.png">

            <v-btn @click="[cardNavigator('atTheMall'), isInternalNavigation = true]" position="relative"
              class="btn-hover-effect" size="24px" icon="mdi-magnify" :style="{ 'margin': '28em 0px 0px 22em' }">
            </v-btn>
          </v-img>
        </v-card>

        <!-- ---------------------atTheMall -->
        <v-card v-show="objCurrentCard.atTheMall">
          <v-img src="@/assets/images/background/atTheMall.png" cover  lazy-src="@/assets/images/background/loading.png">
            <!-- door open /switch to shopSwimwear  --->
            <v-btn @click="[cardNavigator('shopSwimwear'), isInternalNavigation = true]" position="relative"
              class="btn-hover-effect" size="24px" icon="mdi-magnify" :style="{ 'margin': '20em 0 0 11em' }">
            </v-btn>
            <!-- door open /switch to shopPumaGold --->
            <v-btn @click="[cardNavigator('shopPumaGold'), isInternalNavigation = true]" position="relative"
              class="btn-hover-effect" size="24px" icon="mdi-magnify" :style="{ 'margin': '17em 0 0 36em' }">
            </v-btn>
          </v-img>
        </v-card>


        <!--  at shopSwimwear  --->
        <v-card v-show="objCurrentCard.shopSwimwear">
          <v-img src="@/assets/images/background/shopSwimming.png" cover  lazy-src="@/assets/images/background/loading.png">

            <!--  Lina          -->
            <v-img
              @click="[askActorDialog(), messageNumber = 9, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/lina/1.png" height="21em" width="18em"
              style="top: 9em; left:11em">
            </v-img>

            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />
          </v-img>
        </v-card>


        <!--  at shopPumaGod  --->
        <v-card v-show="objCurrentCard.shopPumaGold" class="size">
          <v-img src="@/assets/images/background/shopPumaGold.png" class="size" cover  lazy-src="@/assets/images/background/loading.png">

            <!--  Natali          -->
            <v-img
              @click="[askActorDialog(), messageNumber = 8, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/natali/1.png" height="21em" width="18em"
              style="top: 14em; left:20em">
            </v-img>
            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />
          </v-img>
        </v-card>


        <!--  Service  --->
        <v-card v-show="objCurrentCard.service">
          <v-img src="@/assets/images/background/service.png" cover  lazy-src="@/assets/images/background/loading.png">

            <v-btn @click="[cardNavigator('atTheService'), isInternalNavigation = true]" position="relative"
              class="btn-hover-effect" size="24px" icon="mdi-magnify"
              style="position:absolute;   margin-top:13em ; left:14em">
            </v-btn>
          </v-img>
        </v-card>

        <!--  AtTheService  --->
        <v-card v-show="objCurrentCard.atTheService">
          <v-img src="@/assets/images/background/atTheService.png" cover  lazy-src="@/assets/images/background/loading.png">

            <!-- Master Johnny         hide master if get license -->
            <v-img v-if="itemsBackpackObj.hasOwnProperty('license')"
              @click="[askActorDialog(), messageNumber = 10, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/master/1.png" height="22em" width="7em"
              style="top: 17em; left:37em">
            </v-img>

            <!-- player -->
            <v-img class="player" src="@/assets/images/actors/topCat/1.png" height="18em" width="7em"
              style="top: 18.5em; left:17em; ">
            </v-img>

            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />
          </v-img>
        </v-card>


        <!-- ---------------------Government -->
        <v-card v-show="objCurrentCard.government">
          <v-img src="@/assets/images/background/government.png" cover  lazy-src="@/assets/images/background/loading.png">

            <!-- coin item -->
            <v-img src="@/assets/images/items/backpackItems/coin.png" id="coin" height="35" width="35" class="item"
              style="position: absolute; margin: 30em 3em;" @click="[grabItems('coin'), isInfoBoxActive]">
            </v-img>

            <!-- Police men          -->
            <v-img
              @click="[askActorDialog(), messageNumber = 11, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/police/1.png" height="22em" width="7em"
              style="top: 15em; left:32em">
            </v-img>

            <!-- player -->
            <v-img class="player" src="@/assets/images/actors/topCat/1.png" height="18em" width="7em"
              style="top: 18.5em; left:17em; ">
            </v-img>

            <v-btn v-if="itemsBackpackObj.pass" @click="[cardNavigator('cabinet'), isInternalNavigation = true]"
              position="relative" class="btn-hover-effect" size="24px" icon="mdi-magnify"
              style="position:absolute;   margin-top:2em ; left:25em">
            </v-btn>

            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />

          </v-img>
        </v-card>

        <!-- ---------------------Cabinet at Government -->
        <v-card v-show="objCurrentCard.cabinet">
          <v-img src="@/assets/images/background/cabinet.png" cover  lazy-src="@/assets/images/background/loading.png">

            <!-- Minister          -->
            <v-img
              @click="[askActorDialog(), messageNumber = 13, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/minister/1.png" height="22em" width="7em"
              style="top: 16em; left:2em">
            </v-img>

            <!-- player -->
            <v-img class="player" src="@/assets/images/actors/topCat/s1.png" height="18em" width="7em"
              style="top: 18em; left:18em; ">
            </v-img>

            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />

          </v-img>
        </v-card>


        <!-- --------------------- beach -->
        <v-card v-show="objCurrentCard.beach">
          <v-img src="@/assets/images/background/beach.png" cover  lazy-src="@/assets/images/background/loading.png">

            <v-btn v-show="itemsBackpackObj.swimsuit" @click="[cardNavigator('beachLeft'), isInternalNavigation = true]"
              position="relative" class="btn-hover-effect" size="24px" icon="mdi-magnify"
              style="position:absolute;   margin-top:30em ; left:3em">
            </v-btn>

            <v-btn v-if="itemsBackpackObj.vibrator" @click="[cardNavigator('beachRight'), isInternalNavigation = true]"
              position="relative" class="btn-hover-effect" size="24px" icon="mdi-magnify"
              style="position:absolute;   margin-top:11em ; left:22em">
            </v-btn>
          </v-img>
        </v-card>

        <!-- --------------------- beachLeft Lina -->
        <v-card v-show="objCurrentCard.beachLeft">
          <v-img src="@/assets/images/background/beachLeft.png" cover  lazy-src="@/assets/images/background/loading.png">

            <!-- vibrator item -->
            <v-img src="@/assets/images/items/backpackItems/vibrator.png" id="vibrator" height="45" width="45"
              class="item" style="position: absolute; margin: 30em 3em;"
              @click="[grabItems('vibrator'), isInfoBoxActive]">
            </v-img>


            <!-- Lina          -->
            <v-img
              @click="[askActorDialog(), messageNumber = 14, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/lina/a1.png" height="19em" width="7.5em"
              style="top: 13em; left:23em">
            </v-img>

            <!-- player -->
            <v-img class="player" src="@/assets/images/actors/topCat/b1.png" height="19em" width="7.5em"
              style="top: 15em; left:41em; ">
            </v-img>

            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />
          </v-img>
        </v-card>

        <!-- --------------------- beachRight Natali -->
        <v-card v-show="objCurrentCard.beachRight">
          <v-img src="@/assets/images/background/beachRight.png" cover  lazy-src="@/assets/images/background/loading.png">

            <!-- Natali          -->
            <v-img v-if="!itemsBackpackObj.squirt"
              @click="[askActorDialog(), messageNumber = 15, isInfoBoxActive, firstAlertDialog = false, isAskDialog = true]"
              class="actors" src="@/assets/images/actors/natali/b2.png" height="19em" width="7.5em"
              style="top: 13em; left:23em">
            </v-img>

            <!-- player -->
            <v-img class="player" src="@/assets/images/actors/topCat/b2.png" height="19em" width="7.5em"
              style="top: 14em; left:4em; ">
            </v-img>

            <alertDialog @event-allowed-item-deal="eventAllowedItemDeal" :current-state="currentState"
              :ask-actor="askActor" :map-icons-destinations="mapIconsDestinations" />
          </v-img>
        </v-card>

        <!-- --------------------- epilogue-->
        <v-card v-show="objCurrentCard.epilogue">

          <v-carousel v-if="objCurrentCard.epilogue && !startFinalAnimation" width="900" height="600" hide-delimiters
            hide-delimiter-background :show-arrows="false" :cycle="true" :interval="3000">
            <v-carousel-item v-for="i in 5" :key="i">
              <v-sheet height="100%">
                <div :v-if="`${i == 5 ? startFinalAnimation = true : null}`"
                  class="d-flex fill-height justify-center align-center">
                  <img :src="require(`@/assets/images/background/liftОff/${i}.png`)" cover>
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>

          <v-img v-if="startFinalAnimation" src="@/assets/images/background/liftОff/5.png" cover  lazy-src="@/assets/images/background/loading.png">
          </v-img>

        </v-card>

      </v-dialog>
    </v-row>
  </div>
</template>



<style >
@import "https://fonts.googleapis.com/css?family=Rancho&effect=fire-animation";
@import "https://fonts.googleapis.com/css?family=Qwigley&effect=fire-animation";

.gameName {
  font-family: Qwigley, Rancho, Roboto;
  font-size: 150px;
  margin: 40px 0;
  text-align: center;
}

.font-effect-fire-animation {
  color: #9b398c;
}

.btn-hover-effect {
  background-color: rgb(235, 34, 34);
}

.btn-hover-effect:hover {
  background-color: chartreuse;
  cursor: grab;
}

.plyer,
img {
  /*  Disable drag and drop */
  pointer-events: none;
}

.actors {
  position: absolute;
}

.actors:hover {
  cursor: alias;
  transform: scale(1.01);
}


.items:hover {
  /* transform: scale(1.1); */
  cursor: pointer;
  transform: rotate(10deg);

}

.item:hover {
  transform: scale(1.1);
  cursor: grab;
}

.navbar {
  background: rgba(70, 60, 30, 0.2);
  position: fixed;
  z-index: 1
}

  /* remove blur form lazy-src */
.v-img__img--preload {
  filter: blur();
}
</style>

