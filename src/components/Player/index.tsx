import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePlayer } from '../../contexts/PlayerContext'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export function Player() {
  const audioRef = useRef<HTMLAudioElement>()
  const [progress, setProgress] = useState(0)

  const { 
    episodeList, 
    currentEpisodeIndex,
    clearPlayerState,
    
    isPlaying, 
    togglePlay, 
    
    setPlayingState, 
    playNext,
    playPrevious,
    
    hasNext,
    hasPrevious,
    
    isLooping,
    toggleLoop,

    isShuffling,
    toggleShuffle
  } = usePlayer()

  const episode = episodeList[currentEpisodeIndex]

  function setupProgressListener() {
    audioRef.current.currentTime = 0
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if(hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  useEffect(() => {
    if(!audioRef.current){
      return;
    }

    if(isPlaying){
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora {episode?.title} </strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir.</strong>
      </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          { episode ? (
            <Slider
              max={episode.duration}
              value={progress}
              trackStyle={{ backgroundColor: '#04d361' }}
              railStyle={{ backgroundColor: '#9f75ff' }} 
              handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              onChange={handleSeek}
            />
          ) : (
            <div className={styles.slider}>
              <div className={styles.emptySlider}/>
            </div>

          ) }
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio 
            src={episode.url} 
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
            ref={audioRef} />
        )}

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodeList.length === 1}
            className={isShuffling ? styles.isActive : ''}
            onClick={() => toggleShuffle()}>
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>

          <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>

          <button type="button" className={styles.playButton} disabled={!episode} onClick={() => togglePlay()}>
            { isPlaying ? (
              <img src="/pause.svg" alt="Embaralhar"/>
            ) : (
              <img src="/play.svg" alt="Embaralhar"/>
            )}
          </button> 

          <button type="button" disabled={!episode || !hasNext} onClick={() => playNext()}>
            <img src="/play-next.svg" alt="Tocar pr??xima"/>
          </button>

          <button 
            type="button"
            disabled={!episode}
            className={isLooping ? styles.isActive : ''}
            onClick={() => toggleLoop()}>
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  )
}