import SoundPlayerConsumer from "./sound-player-consumer";
import SoundPlayer from "./sound-player";
const mockPlaySoundFile = jest.fn();
jest.mock("./sound-player", () => {
  return jest.fn().mockImplementation(() => {
    return { playSoundFile: mockPlaySoundFile };
  });
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  //@ts-expect-error testing
  SoundPlayer.mockClear();
  mockPlaySoundFile.mockClear();
});

describe("SoundPlayer Tests", () => {
  it("We can check if the consumer called the class constructor", () => {
    const soundPlayerConsumer = new SoundPlayerConsumer();
    expect(SoundPlayer).toHaveBeenCalledTimes(1);
  });

  it("We can check if the consumer called a method on the class instance", () => {
    const soundPlayerConsumer = new SoundPlayerConsumer();
    const coolSoundFileName = "song.mp3";
    soundPlayerConsumer.playSomethingCool();
    expect(mockPlaySoundFile).toHaveBeenCalledWith(coolSoundFileName);
  });
});
