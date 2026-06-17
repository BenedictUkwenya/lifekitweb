import React, { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const Motion = motion

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function ContainerTextFlip({
  words = ['booked', 'paid', 'noticed', 'growing'],
  interval = 2600,
  className,
  textClassName,
  animationDuration = 650,
}) {
  const id = useId()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [width, setWidth] = useState(100)
  const textRef = useRef(null)

  useEffect(() => {
    if (!textRef.current) return

    const textWidth = textRef.current.scrollWidth + 30
    setWidth(textWidth)
  }, [currentWordIndex])

  useEffect(() => {
    if (!words.length) return undefined

    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, interval)

    return () => clearInterval(intervalId)
  }, [words, interval])

  const currentWord = words[currentWordIndex] || ''

  return (
    <Motion.span
      layout
      layoutId={`words-here-${id}`}
      animate={{ width }}
      transition={{ duration: animationDuration / 2000 }}
      className={cn(
        'relative inline-flex align-baseline rounded-2xl px-3 pt-1 pb-2 text-center text-[0.95em] font-extrabold leading-none',
        'text-primary shadow-[inset_0_-1px_rgba(137,39,59,0.20),inset_0_0_0_1px_rgba(137,39,59,0.16),0_16px_35px_-24px_rgba(137,39,59,0.75)]',
        '[background:linear-gradient(180deg,#fff7f9_0%,#f8e9ee_100%)]',
        className
      )}
      key={currentWord}
    >
      <Motion.span
        transition={{
          duration: animationDuration / 1000,
          ease: 'easeInOut',
        }}
        className={cn('inline-block whitespace-nowrap', textClassName)}
        ref={textRef}
        layoutId={`word-div-${currentWord}-${id}`}
      >
        {currentWord.split('').map((letter, index) => (
          <Motion.span
            key={`${letter}-${index}`}
            initial={{
              opacity: 0,
              filter: 'blur(10px)',
            }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
            }}
            transition={{
              delay: index * 0.02,
            }}
          >
            {letter}
          </Motion.span>
        ))}
      </Motion.span>
    </Motion.span>
  )
}
