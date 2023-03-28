# TAURI Demo_Game_CrazyTown

### A test project of a comic / quest DEMO game 'Crazy Town', using: Vue 3 Composition API, Vuetify 3 and the still new Tauri 1.2 framework.

```diff
- After building it doesn't play sound, has slight lag and other issues on some systems/distros.
+ This is just DEMO GAME
```

# DEMO Game - CrazyTown
- Fun comic game
- The spaceship of the main character, crash lands on planet Earth.
- There he goes on an adventure to repair the ship and finds an important fuel ingredient.
- He has to talk to many people to help him reach his goal.
- With each conversation, a path is opened to a map with destinations he must visit.
- Some of the characters ask him for certain favors to help him.
- Great music and effects / on supported systems /

## Playing the game
You control the main character TopCat. You can make it move by clicking on the different objects with the left mouse button.
Information about the character when the mouse is clicked on it.
After each conversation, different cards are opened for you to visit new places.
The adventure requires you to find a craftsman and a fuel cell for the damaged spaceship.

## Video intro:
soon

## Screenshots:
![bg_story](https://user-images.githubusercontent.com/51271834/201547805-ab13546c-1f7a-4124-bb5b-020196f78bb4.png)


### Download
#### For Linux AppImage that run anywhere SOON...
### Reason
If your app plays audio/video you need to enable tauri.conf.json > tauri > bundle > appimage > bundleMediaFramework. This will increase the size of the AppImage bundle to include additional gstreamer files needed for media playback.
```diff
- This flag is currently only supported on Ubuntu build systems.
```

### Prerequisites
- [Tauri](https://tauri.app)

### Author
By Abaddon
