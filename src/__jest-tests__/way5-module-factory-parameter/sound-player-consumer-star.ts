import SoundPlayer from "./sound-player";

export default class SoundPlayerConsumerStar {
  private soundPlayer: SoundPlayer;
  constructor(soundPlayer: SoundPlayer) {
    this.soundPlayer = soundPlayer;
  }

  playSomethingCool() {
    const coolSoundFileName = "song.mp3";
    this.soundPlayer.playSoundFile(coolSoundFileName);
  }
}
