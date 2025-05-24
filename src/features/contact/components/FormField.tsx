"use client";

import React from "react";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  errors?: string[];
  required?: boolean;
  as?: "input" | "textarea" | "select";
  children?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  errors,
  required = false,
  as = "input",
  children,
}) => {
  const hasErrors = errors && errors.length > 0;

  const renderField = () => {
    switch (as) {
      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            className={`w-full bg-slate-700 text-white rounded-md p-3 ${
              hasErrors ? "border border-red-500" : "border border-slate-600"
            }`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={6}
            required={required}
          />
        );
      case "select":
        return (
          <select
            id={name}
            name={name}
            className={`w-full bg-slate-700 text-white rounded-md p-3 ${
              hasErrors ? "border border-red-500" : "border border-slate-600"
            }`}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e)}
            required={required}
          >
            {children}
          </select>
        );
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            className={`w-full bg-slate-700 text-white rounded-md p-3 ${
              hasErrors ? "border border-red-500" : "border border-slate-600"
            }`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
          />
        );
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-white mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {renderField()}
      {hasErrors && (
        <div className="mt-1 text-red-400 text-sm">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};
