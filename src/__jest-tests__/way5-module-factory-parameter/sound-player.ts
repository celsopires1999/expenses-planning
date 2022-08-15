export default class SoundPlayer {
  private foo: string;
  constructor() {
    this.foo = "bar";
  }

  playSoundFile(fileName: string) {
    console.log("Playing sound file " + fileName);
  }

  playWithMe() {
    console.log("Playing with mock");
  }
}
