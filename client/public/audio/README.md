# Background Music Files

Place your background music files here with numeric names:

- `1.mp3` - First track
- `2.mp3` - Second track
- `3.mp3` - Third track
- `4.mp3` - Fourth track
- ... and so on

**You can add up to 100 tracks!** Just name them `1.mp3`, `2.mp3`, `3.mp3`, etc.

## Requirements:

- Format: MP3
- Volume: Music will play at 30% volume
- Loop: Files will play in sequence and loop automatically

## How it works:

1. Music starts playing automatically when the website loads (if not muted)
2. Plays through the playlist in order
3. After the last track, it loops back to the first track
4. Users can mute/unmute using the speaker icon in the navigation bar
5. Mute preference is saved in localStorage

## Adding more tracks

Simply add more numbered MP3 files to this folder. The system automatically detects files named `1.mp3` through `100.mp3`.

If you need more than 100 tracks, edit the loop limit in `client/src/contexts/SoundContext.tsx` (change the `100` in the for loop to a higher number).
