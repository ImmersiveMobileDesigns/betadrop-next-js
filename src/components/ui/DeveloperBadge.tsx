"use client";

import Image from "next/image";
import { Heart, RotateCcw, X, Gamepad2, Sparkles, Cpu } from "lucide-react";
import styles from "./DeveloperBadge.module.css";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function DeveloperBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleInteraction = (state: boolean) => {
    if (!isMobile) {
      setIsOpen(state);
    }
  };

  const handleMobileClick = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={`fixed bottom-2 left-2 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-3 ${styles.fadeInUp}`}
      onMouseEnter={() => handleInteraction(true)}
      onMouseLeave={() => handleInteraction(false)}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="origin-bottom-left"
          >
            <TicTacToeGame onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href="https://imobiledesigns.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <motion.button
          onClick={(e) => {
            if (isMobile) {
              e.preventDefault();
              handleMobileClick();
            }
          }}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative group
            flex items-center gap-2 sm:gap-3
            bg-slate-900/90 backdrop-blur-xl
            border border-slate-700/50
            rounded-full px-3 py-2 sm:px-4 sm:py-2.5
            shadow-[0_0_20px_rgba(14,165,233,0.3)]
            hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]
            hover:bg-slate-900
            transition-all duration-300
          `}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />

          {/* Logo */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 relative flex-shrink-0 drop-shadow-sm">
            <Image
              src="/images/logo/imd-small-logo.png"
              alt="iMobile Designs"
              fill
              className="object-contain"
              draggable={false}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col text-left relative z-10">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-200 whitespace-nowrap leading-tight">
              Developed by{" "}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent font-bold">
                iMobile Designs
              </span>
            </span>

            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-slate-400 whitespace-nowrap mt-0.5">
              <span>Made with</span>
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />
              </motion.div>
              <span>in India</span>
            </div>
          </div>
        </motion.button>
      </Link>
    </div>
  );
}

function TicTacToeGame({ onClose }: { onClose: () => void }) {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player is X
  const [gameStatus, setGameStatus] = useState<
    "playing" | "player_win" | "computer_win" | "draw"
  >("playing");

  // Bot Logic
  const makeComputerMove = useCallback(() => {
    if (gameStatus !== "playing" || isPlayerTurn) return;

    // Simple AI:
    // 1. Try to win
    // 2. Block player
    // 3. Pick center
    // 4. Pick random available

    const availableMoves = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);

    if (availableMoves.length === 0) return;

    const checkWinMove = (player: "O" | "X") => {
      for (let move of availableMoves) {
        const tempBoard = [...board];
        tempBoard[move] = player;
        if (checkWinner(tempBoard) === player) return move;
      }
      return null;
    };

    let nextMove = checkWinMove("O"); // Try to win
    if (nextMove === null) nextMove = checkWinMove("X"); // Block player
    if (nextMove === null && board[4] === null) nextMove = 4; // Take center

    if (nextMove === null) {
      // Pick random
      nextMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Delay specifically for "thinking" effect
    setTimeout(() => {
      const nextBoard = [...board];
      nextBoard[nextMove!] = "O";
      setBoard(nextBoard);

      const winner = checkWinner(nextBoard);
      if (winner) {
        setGameStatus("computer_win");
      } else if (nextBoard.every(Boolean)) {
        setGameStatus("draw");
      } else {
        setIsPlayerTurn(true);
      }
    }, 600);
  }, [board, gameStatus, isPlayerTurn]);

  useEffect(() => {
    if (!isPlayerTurn && gameStatus === "playing") {
      makeComputerMove();
    }
  }, [isPlayerTurn, gameStatus, makeComputerMove]);

  function handlePlayerMove(index: number) {
    if (board[index] || gameStatus !== "playing" || !isPlayerTurn) return;

    const nextBoard = [...board];
    nextBoard[index] = "X";
    setBoard(nextBoard);

    const winner = checkWinner(nextBoard);
    if (winner) {
      setGameStatus("player_win");
    } else if (nextBoard.every(Boolean)) {
      setGameStatus("draw");
    } else {
      setIsPlayerTurn(false);
    }
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus("playing");
  }

  return (
    <div className="w-[300px] bg-[#0f172a]/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-700/60 p-5 overflow-hidden relative ring-1 ring-slate-800">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 animate-shimmer bg-[length:200%_auto]" />

      {/* Header */}
      <div className="flex flex-col gap-1 mb-5 mt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Mind Fresh
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={reset}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-primary-400 transition-colors"
              title="Restart Game"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors sm:hidden"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <h3 className="font-bold text-base text-slate-100 leading-tight">
          Play Quick{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
            Tic-Tac-Toe!
          </span>
        </h3>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-3 gap-2 mb-5 p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 shadow-inner">
        {board.map((cell, i) => (
          <motion.button
            key={i}
            onClick={() => handlePlayerMove(i)}
            disabled={!isPlayerTurn || !!cell || gameStatus !== "playing"}
            whileHover={
              !cell && isPlayerTurn && gameStatus === "playing"
                ? { scale: 0.96, backgroundColor: "rgba(30, 41, 59, 0.8)" }
                : {}
            }
            whileTap={
              !cell && isPlayerTurn && gameStatus === "playing"
                ? { scale: 0.9 }
                : {}
            }
            className={`
              h-16 rounded-lg 
              flex items-center justify-center text-3xl font-bold 
              transition-all duration-200 shadow-sm relative overflow-hidden
              ${
                cell
                  ? "bg-slate-800/80 ring-1 ring-white/5"
                  : "bg-slate-800/30 border border-slate-700/30 cursor-pointer"
              }
              ${!isPlayerTurn && !cell && gameStatus === "playing" ? "cursor-wait opacity-80" : ""}
            `}
          >
            <AnimatePresence mode="wait">
              {cell === "X" && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="text-primary-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                >
                  <X className="w-8 h-8" strokeWidth={3} />
                </motion.div>
              )}
              {cell === "O" && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="text-accent-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.5)]"
                >
                  <div className="w-8 h-8 rounded-full border-[3px] border-accent-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Status Footer */}
      <div className="flex items-center justify-center min-h-[40px] relative">
        <AnimatePresence mode="wait">
          {gameStatus === "player_win" && (
            <motion.div
              key="win"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-900/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>You Won! 🎉</span>
            </motion.div>
          )}

          {gameStatus === "computer_win" && (
            <motion.div
              key="lose"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 rounded-full text-xs font-bold ring-1 ring-rose-500/20 shadow-lg shadow-rose-900/20"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Won! 🤖</span>
            </motion.div>
          )}

          {gameStatus === "draw" && (
            <motion.div
              key="draw"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold ring-1 ring-amber-500/20 shadow-lg shadow-amber-900/20"
            >
              It's a Draw! 🤝
            </motion.div>
          )}

          {gameStatus === "playing" && (
            <motion.div
              key="turn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-between text-xs font-medium px-1"
            >
              <div
                className={`flex items-center gap-2 transition-opacity duration-300 ${isPlayerTurn ? "opacity-100" : "opacity-40"}`}
              >
                <div
                  className={`p-1.5 rounded-full ${isPlayerTurn ? "bg-primary-500 text-white shadow-glow" : "bg-slate-800 text-slate-400"}`}
                >
                  <Gamepad2 className="w-3 h-3" />
                </div>
                <span
                  className={
                    isPlayerTurn ? "text-primary-300" : "text-slate-500"
                  }
                >
                  You
                </span>
              </div>

              <div className="h-px w-8 bg-slate-700/50" />

              <div
                className={`flex items-center gap-2 transition-opacity duration-300 ${!isPlayerTurn ? "opacity-100" : "opacity-40"}`}
              >
                <span
                  className={
                    !isPlayerTurn ? "text-accent-300" : "text-slate-500"
                  }
                >
                  AI
                </span>
                <div
                  className={`p-1.5 rounded-full ${!isPlayerTurn ? "bg-accent-500 text-white shadow-glow relative" : "bg-slate-800 text-slate-400"}`}
                >
                  <Cpu className="w-3 h-3" />
                  {!isPlayerTurn && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function checkWinner(board: (null | "X" | "O")[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
