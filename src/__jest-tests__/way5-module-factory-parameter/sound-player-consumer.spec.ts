import SoundPlayer from "./sound-player";
import SoundPlayerConsumer from "./sound-player-consumer";
import SoundPlayerConsumerStar from "./sound-player-consumer-star";

const mockPlaySoundFile = jest.fn();
jest.mock("./sound-player", () => {
  return jest.fn().mockImplementation(() => {
    return { playSoundFile: mockPlaySoundFile };
  });
});

beforeEach(() => {
  //@ts-expect-error testing
  SoundPlayer.mockClear();
  mockPlaySoundFile.mockClear();
});

describe("Test module factory parameter", () => {
  it("The consumer should be able to call new() on SoundPlayer", () => {
    const soundPlayerConsumer = new SoundPlayerConsumer();
    // Ensure constructor created the object:
    expect(soundPlayerConsumer).toBeTruthy();
  });

  it("We can check if the consumer called the class constructor", () => {
    const soundPlayerConsumer = new SoundPlayerConsumer();
    expect(SoundPlayer).toHaveBeenCalledTimes(1);
    const soundPlayer = new SoundPlayer();
    const star = new SoundPlayerConsumerStar(soundPlayer);
    console.log(star);
  });

  it("We can check if the consumer called a method on the class instance", () => {
    const soundPlayerConsumer = new SoundPlayerConsumer();
    const coolSoundFileName = "song.mp3";
    soundPlayerConsumer.playSomethingCool();
    expect(mockPlaySoundFile.mock.calls[0][0]).toEqual(coolSoundFileName);
  });
});
