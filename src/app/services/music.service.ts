import { Injectable } from '@angular/core';
import { Filesystem, Directory, GetUriResult } from '@capacitor/filesystem';
import { BehaviorSubject } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { Howl } from 'howler';
import { AudioFile, PlaybackState } from '../models/spotify.model';



@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private supportedFormats = ['.m4a', '.aac', '.mp3', '.wav', '.ogg', '.flac', '.opus'];
  private audioFiles = new BehaviorSubject<AudioFile[]>([]);
  private currentHowl: Howl | null = null;
  private playbackState = new BehaviorSubject<PlaybackState>({
    isPlaying: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0
  });

  audioFiles$ = this.audioFiles.asObservable();
  playbackState$ = this.playbackState.asObservable();

  constructor() {}

  async requestPermissions() {
    await Filesystem.requestPermissions();
  }

  async scanAudioFiles(): Promise<AudioFile[]> {
    await this.requestPermissions();
    const baseFolders = ['Music', 'Download', 'Documents'];
    let allAudioFiles: AudioFile[] = [];
    for (const basePath of baseFolders) {
      try {
        const path = basePath.replace(/^\/|\/$/g, '');
        const result = await Filesystem.readdir({
          path,
          directory: Directory.ExternalStorage
        });
        if (result.files) {
          const files = await this.processDirectory(result.files, path);
          allAudioFiles = [...allAudioFiles, ...files];
        }
      } catch (error) {
        continue;
      }
    }
    // Remove duplicates by path
    const uniqueFiles = Array.from(new Map(allAudioFiles.map(file => [file.path, file])).values());
    this.audioFiles.next(uniqueFiles);
    return uniqueFiles;
  }

  private async processDirectory(entries: any[], currentRelativePath: string): Promise<AudioFile[]> {
    const audioFiles: AudioFile[] = [];
    if (!Array.isArray(entries)) return audioFiles;

    for (const entry of entries) {
      try {
        const name = entry.name;
        if (!name) continue;
        const dotIndex = name.lastIndexOf('.');
        if (dotIndex === -1) continue;
        const extension = name.slice(dotIndex).toLowerCase();
        const entryRelativePath = currentRelativePath ? `${currentRelativePath}/${name}` : name;

        if (this.supportedFormats.includes(extension)) {
          audioFiles.push({
            path: entryRelativePath,
            name: name,
            type: extension,
            size: entry.size || 0,
          });
        } else if (entry.type === 'directory') {
          try {
            const subDirContent = await Filesystem.readdir({
              path: entryRelativePath,
              directory: Directory.ExternalStorage
            });
            if (subDirContent && subDirContent.files) {
              const subDirAudioFiles = await this.processDirectory(subDirContent.files, entryRelativePath);
              audioFiles.push(...subDirAudioFiles);
            }
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        continue;
      }
    }
    return audioFiles;
  }

  async playAudio(file: AudioFile) {
    if (this.currentHowl) {
      this.currentHowl.stop();
    }

    try {
      let fileUrl: string;
      const result: GetUriResult = await Filesystem.getUri({
        path: file.path,
        directory: Directory.ExternalStorage
      });
      fileUrl = Capacitor.convertFileSrc(result.uri);

      this.currentHowl = new Howl({
        src: [fileUrl],
        html5: true,
        format: [file.type.replace('.', '')],
        onload: () => this.updatePlaybackState(false, file),
        onplay: () => {
          this.updatePlaybackState(true, file);
          this.startPlaybackTracking();
        },
        onpause: () => this.updatePlaybackState(false, file),
        onstop: () => this.updatePlaybackState(false, null),
        onend: () => this.updatePlaybackState(false, null)
      });

      this.currentHowl.play();
    } catch (error) {
      throw error;
    }
  }

  pauseAudio() {
    if (this.currentHowl && this.currentHowl.playing()) {
      this.currentHowl.pause();
    }
  }

  resumeAudio() {
    if (this.currentHowl && !this.currentHowl.playing()) {
      this.currentHowl.play();
    }
  }

  stopAudio() {
    if (this.currentHowl) {
      this.currentHowl.stop();
    }
  }

  seekTo(position: number) {
    if (this.currentHowl) {
      this.currentHowl.seek(position);
      const currentState = this.playbackState.value;
      this.playbackState.next({
        ...currentState,
        currentTime: position
      });
    }
  }

  playNext() {
    const currentTrack = this.playbackState.value.currentTrack;
    if (!currentTrack) return;

    const currentIndex = this.audioFiles.value.findIndex(file => file.path === currentTrack.path);
    if (currentIndex === -1 || currentIndex === this.audioFiles.value.length - 1) return;

    const nextTrack = this.audioFiles.value[currentIndex + 1];
    this.playAudio(nextTrack);
  }

  playPrevious() {
    const currentTrack = this.playbackState.value.currentTrack;
    if (!currentTrack) return;

    const currentIndex = this.audioFiles.value.findIndex(file => file.path === currentTrack.path);
    if (currentIndex <= 0) return;

    const previousTrack = this.audioFiles.value[currentIndex - 1];
    this.playAudio(previousTrack);
  }

  canPlayNext(): boolean {
    const currentTrack = this.playbackState.value.currentTrack;
    if (!currentTrack) return false;

    const currentIndex = this.audioFiles.value.findIndex(file => file.path === currentTrack.path);
    return currentIndex < this.audioFiles.value.length - 1;
  }

  canPlayPrevious(): boolean {
    const currentTrack = this.playbackState.value.currentTrack;
    if (!currentTrack) return false;

    const currentIndex = this.audioFiles.value.findIndex(file => file.path === currentTrack.path);
    return currentIndex > 0;
  }

  private updatePlaybackState(isPlaying: boolean, track: AudioFile | null) {
    const currentState = this.playbackState.value;
    this.playbackState.next({
      ...currentState,
      isPlaying,
      currentTrack: track,
      duration: this.currentHowl ? this.currentHowl.duration() : 0
    });
  }

  private startPlaybackTracking() {
    if (this.currentHowl) {
      const updateTime = () => {
        if (this.currentHowl && this.currentHowl.playing()) {
          const currentState = this.playbackState.value;
          this.playbackState.next({
            ...currentState,
            currentTime: this.currentHowl.seek() as number
          });
          requestAnimationFrame(updateTime);
        }
      };
      updateTime();
    }
  }
}
