import React, { forwardRef, useState } from "react";
import { X } from "lucide-react";

interface ClearableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear: () => void;
}

export const ClearableInput = forwardRef<
  HTMLInputElement | null,
  ClearableInputProps
>(({ onClear, className, onFocus, onBlur, ...props }, ref) => {
  const [focused, setFocused] = useState(false);
  const showClear = focused && !!props.value && props.value !== 0;

  return (
    <div className="flex flex-1 items-center min-w-0">
      <input
        ref={ref}
        className={`flex-1 min-w-0 outline-none ${className ?? ""}`}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClear}
          className="ml-1 shrink-0 bg-gray-500 text-white rounded-full p-0.5"
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
});

ClearableInput.displayName = "ClearableInput";

interface ClearableTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onClear: () => void;
}

export const ClearableTextarea = forwardRef<
  HTMLTextAreaElement | null,
  ClearableTextareaProps
>(({ onClear, className, onFocus, onBlur, ...props }, ref) => {
  const [focused, setFocused] = useState(false);
  const showClear = focused && !!props.value;

  return (
    <div className="flex flex-1 items-start min-w-0">
      <textarea
        ref={ref}
        className={`flex-1 min-w-0 outline-none ${className ?? ""}`}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClear}
          className="ml-1 shrink-0 bg-gray-300 text-white rounded-full p-0.5 mt-1"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
});

ClearableTextarea.displayName = "ClearableTextarea";
