export default class Music {
  constructor(audioBackground, audioEffects) {
    this.audioBackground = audioBackground
    this.audioEffects = audioEffects
    
  }

  backgroundMusic(sound, volume) {
    this.audioBackground = new Audio(sound)
    this.audioBackground.volume = volume || 0.2
    this.audioBackground.play()
  }

  loopMusic() {
    this.audioBackground.loop = true
  }


 stopMusic()  {
    this.audioBackground.currentTime = 0
    this.audioBackground.pause()
    
  }
//effect music
  effectMusic(sound, volume) {
    this.audioEffects = new Audio(sound) //'/sound/effects/click.mp3'
    this.audioEffects.volume = volume || 0.5
    this.audioEffects.play()
  }


}

// export const music = new Music()

