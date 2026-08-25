import { useState } from "react";
import { X } from "lucide-react";

export function ClearableInput({ onClear, className, ...props }) {
  const [focused, setFocused] = useState(false);
  const showClear = focused && !!props.value && props.value !== 0;

  return (
    <div className="flex flex-1 items-center min-w-0">
      <input
        className={`flex-1 min-w-0 outline-none ${className ?? ""}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
}

export function ClearableTextarea({ onClear, className, ...props }) {
  const [focused, setFocused] = useState(false);
  const showClear = focused && !!props.value;

  return (
    <div className="relative flex flex-1 items-start min-w-0">
      <textarea
        className={`flex-1 min-w-0 outline-none ${className ?? ""}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClear}
          className="absolute top-2 right-3 ml-1 shrink-0 bg-gray-300 text-white rounded-full p-0.5 mt-1"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
