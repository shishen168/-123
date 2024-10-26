import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  description?: string;
}

interface StepsProps {
  steps: Step[];
  current: number;
  onChange?: (step: number) => void;
  className?: string;
}

const Steps: React.FC<StepsProps> = ({
  steps,
  current,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < current;
        const isCurrent = index === current;
        const isClickable = onChange && index <= current;

        return (
          <React.Fragment key={index}>
            <div className="relative flex flex-col items-center group">
              <button
                onClick={() => isClickable && onChange(index)}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  transition-colors duration-200
                  ${isCompleted
                    ? 'bg-blue-600 text-white'
                    : isCurrent
                      ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </button>
              <div className="absolute -bottom-8 w-32 text-center">
                <div className={`
                  text-sm font-medium
                  ${isCurrent ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-400 mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-2
                ${index < current ? 'bg-blue-600' : 'bg-gray-200'}
              `} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Steps;