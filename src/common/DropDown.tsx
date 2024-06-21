import React from 'react';
import { Dropdown as AntDropdown, Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';

interface CustomDropdownProps {
  buttonLabel: string;
  menu: { key: number; label: string }[];
  onOptionSelect: (option: { key: number; label: string }) => void;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | 'topCenter' | 'bottomCenter';
  disabled?: boolean;
}

const Dropdown: React.FC<CustomDropdownProps> = ({ buttonLabel, menu, onOptionSelect, placement = 'bottomLeft', disabled }) => {
  const handleMenuClick = (e: MenuInfo) => {
    const selectedOption = menu.find(item => item.key === parseInt(e.key.toString()));
    if (selectedOption && onOptionSelect) {
      onOptionSelect(selectedOption); // Call parent callback with selected option
    }
  };

  const menuItems = menu.map((item) => (
    <Menu.Item key={item.key} onClick={e => handleMenuClick(e)}>
      {item.label}
    </Menu.Item>
  ));

  const antMenu = <Menu>{menuItems}</Menu>;

  return (
    <AntDropdown  placement={placement} disabled={disabled}>
      <button
        type="button"
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:border-cyan-500 focus:shadow-outline-cyan active:bg-cyan-500 transition ease-in-out duration-150`}
      >
       {buttonLabel}
      </button>
    </AntDropdown>
  );
};

export default Dropdown;
