import React from 'react';

interface SubMenuProps {
  title: string;
  subtitle: string;
}

function SubMenu({ title, subtitle }: SubMenuProps) {
  return (
    <div className="flex flex-col ">
      <p className="font-sf-pro text-[28px] text-[#1F2937] font-semibold">{title}</p>
      <span className="font-mulish text-[16px] font-normal text-[#667085]">{subtitle}.</span>
    </div>
  );
}

export default SubMenu