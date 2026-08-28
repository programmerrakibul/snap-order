"use client";

import { IconExclamationCircle } from "@tabler/icons-react";

interface SlugInputProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
}

const SlugInput = ({
  value,
  onChange,
  onBlur,
  name,
  placeholder = "my-product-slug",
  disabled,
  invalid,
}: SlugInputProps) => {
  return (
    <div className="space-y-1.5">
      <input
        type="text"
        name={name}
        value={value ?? ""}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid}
        className="flex h-10 sm:h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm sm:text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-input disabled:cursor-not-allowed disabled:opacity-50 font-mono"
      />

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <IconExclamationCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
        Just enter lowercase texts with hyphens, nothing else. Leave empty to
        auto-generate from the name.
      </p>
    </div>
  );
};

export default SlugInput;
