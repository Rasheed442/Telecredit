"use client";
import React from 'react';

interface LabelProps {
   title: string;
   placeholder: string;
   type: string;
   style: string;
   labelstyle: string;
   field?: any; // Add field prop for Formik
}

const LabelInput: React.FC<LabelProps> = ({ title, placeholder, style, type, labelstyle, field }) => {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor="input" className={`text-[#36394A] text-[13px] font-medium ${labelstyle}`}>{title}</label>
      <input
        id="input" 
        type={type || "text"}
        className={style}
        style={{color:"#474747"}}
        placeholder={placeholder}
        {...field} // Spread the field props
      />
    </div>
  );
}

export default LabelInput;
