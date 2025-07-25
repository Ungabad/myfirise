import React, { useState, useEffect } from "react";
import { bankingCourse } from "../../pages/courses/banking-data";

const BankingCourse: React.FC = () => {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem("banking_step");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem("banking_score");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("banking_step", step.toString());
    localStorage.setItem("banking_score", score.toString());
  }, [step, score]);

  useEffect(() => {
    if (step >= bankingCourse.length) {
      localStorage.removeItem("banking_step");
      localStorage.removeItem("banking_score");
    }
  }, [step]);

  const lesson = bankingCourse[step];
  const isLastStep = step === bankingCourse.length - 1;

  const handleOption = (idx: number) => {
    setSelected(idx);
    setShowAnswer(true);
    if (idx === lesson.quiz.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowAnswer(false);
    setStep((s) => s + 1);
  };

  const handleReset = () => {
    setStep(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
    localStorage.removeItem("banking_step");
    localStorage.removeItem("banking_score");
  };

  return (
    <div className='max-w-xl mx-auto p-6 bg-white rounded shadow'>
      <div className='mb-4'>
        <div className='text-sm text-gray-500 mb-2'>
          Lesson {step + 1} of {bankingCourse.length}
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2 mb-4'>
          <div
            className='bg-green-500 h-2 rounded-full'
            style={{
              width: `${
                ((step + (showAnswer ? 1 : 0)) / bankingCourse.length) * 100
              }%`,
            }}
          ></div>
        </div>
        <h2 className='text-2xl font-bold mb-2'>{lesson.title}</h2>
        <p className='mb-4'>{lesson.content}</p>
      </div>
      <div className='mb-4'>
        <div className='font-semibold mb-2'>Quiz:</div>
        <div className='mb-2'>{lesson.quiz.question}</div>
        <div className='space-y-2'>
          {lesson.quiz.options.map((opt: string, idx: number) => (
            <button
              key={idx}
              className={`w-full text-left px-4 py-2 rounded border transition-colors
                ${
                  selected === idx
                    ? idx === lesson.quiz.answer
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }
                ${showAnswer && idx === lesson.quiz.answer ? "font-bold" : ""}
              `}
              onClick={() => !showAnswer && handleOption(idx)}
              disabled={showAnswer}
            >
              {opt}
            </button>
          ))}
        </div>
        {showAnswer && (
          <div className='mt-3'>
            {selected === lesson.quiz.answer ? (
              <span className='text-green-600 font-semibold'>Correct!</span>
            ) : (
              <span className='text-red-600 font-semibold'>
                Incorrect. The correct answer is:{" "}
                {lesson.quiz.options[lesson.quiz.answer]}
              </span>
            )}
          </div>
        )}
      </div>
      <div className='flex justify-between items-center mt-6'>
        <div className='text-sm text-gray-600'>Score: {score}</div>
        {showAnswer &&
          (isLastStep ? (
            <div className='flex flex-col items-end'>
              <div className='text-lg font-bold text-blue-600 mb-2'>
                Course Complete! Final Score: {score}/{bankingCourse.length}
              </div>
              <button
                className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700'
                onClick={handleReset}
              >
                Restart Course
              </button>
            </div>
          ) : (
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              onClick={handleNext}
            >
              Next Lesson
            </button>
          ))}
      </div>
    </div>
  );
};

export default BankingCourse;
