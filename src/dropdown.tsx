import { Fragment, useEffect, useState } from 'react';
import React = require('react');

import { isMobile } from 'react-device-detect';

// ref: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
// ref: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-scrollable/

type DropdownValue = string | number;

export type DropdownItem = {
  id: string;
  label?: string;
  isDisabled?: boolean;
  value: DropdownValue;
};

type NativeDropdownProps = {
  //isLoading?: boolean;
  isReadOnly?: boolean;
  //label?: string;

  options: DropdownItem[];
  onSelectFn?: (selectedItem: DropdownItem) => void;
  preSelectedOptionId?: DropdownItem['id'];
};

const NativeDropdown = ({
  //isLoading = false,
  isReadOnly = false,
  options,
  onSelectFn,
  //label,
  preSelectedOptionId,
}: NativeDropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<DropdownItem>(
    preSelectedOptionId
      ? options.find((e) => e.id == preSelectedOptionId)
      : options[0]
  );
  const [isSleveOpen, setIsSleveOpen] = useState(false);

  useEffect(() => {
    if (isSleveOpen) {
      document
        .querySelectorAll(`[data-id='${selectedOption.id}']`)[0]
        .scrollIntoView();
    }
  }, [isSleveOpen]);

  const wrapperStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: 'yellow',
    display: 'flex',
  };
  const inputStype = {
    position: 'absolute',
    top: 0,
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
    border: 0,
    padding: 0,
  };
  const selectStyle = {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    opacity: '0%',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    backgroundColor: 'cyan',
    border: 0,
    padding: 0,
  };

  const sleveStyle = {
    width: '100%',
    backgroundColor: 'hotpink',
    position: 'relative',
    zIndex: 20,
    top: '50px',
    height: 'fit-content',
    maxHeight: '200px',
    scrollBehavior: 'auto',
    overflowY: 'scroll',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  };

  const sleveItemStyle = {
    cursor: 'pointer',
    backgroundColor: 'orange',
    margin: '15px',
    display: 'block',
  };

  const selectedSleveItemStyle = {
    cursor: 'unset',
    fontWeight: 'bold',
    color: 'red',
  };

  const disabledSleveItemStyle = {
    cursor: 'not-allowed',
    opacity: '50%',
  };

  const isOnMobile = isMobile;

  function triggerOnKeyUp(e) {
    console.log('trigger key-up yo!');
    switch (e.code) {
      case 'Enter':
      case 'Space':
        setIsSleveOpen(true);
        break;
    }
  }

  function sleveOnKeyUp(e) {
    console.log('item key-up yo!');
    e.preventDefault();
    switch (e.code) {
      case 'ArrowUp':
        const prevValid = tryGetPreviousValid(options, selectedOption);
        if (prevValid) {
          //console.log('going uppa');
          setSelectedOption(prevValid);
        }
        break;
      case 'ArrowDown':
        const nextValid = tryGetNextValid(options, selectedOption);
        if (nextValid) {
          //console.log('down we go');
          setSelectedOption(nextValid);
        }
        break;
    }
  }

  function tryGetPreviousValid(
    options: DropdownItem[],
    selectedOption: DropdownItem
  ): DropdownItem | false {
    const currentIndex = options.findIndex((e) => e.id === selectedOption.id);
    if (currentIndex !== 0) {
      for (let i = currentIndex - 1; i > 0; i--) {
        //console.log(`loop i: ${i}`);
        if (options[i].isDisabled !== true) return options[i];
      }
    }
    return false;
  }

  // ------------------------------------------

  function tryGetNextValid(
    options: DropdownItem[],
    selectedOption: DropdownItem
  ): DropdownItem | false {
    const currentIndex = options.findIndex((e) => e.id === selectedOption.id);
    if (currentIndex !== options.length - 1) {
      for (let i = currentIndex + 1; i < options.length; i++) {
        //console.log(`loop i: ${i}`);
        if (options[i].isDisabled !== true) return options[i];
      }
    }
    return false;
  }

  return (
    <div style={wrapperStyle}>
      {!isReadOnly ? (
        <Fragment>
          {isOnMobile ? (
            <select
              style={selectStyle}
              value={selectedOption.value}
              disabled={isReadOnly}
              onChange={(e) => {
                setSelectedOption(e.target);
                onSelectFn(options.find((o) => o.value == e.target.value));
              }}
            >
              {options.map((option) => {
                return (
                  <option
                    key={option.id}
                    value={option.value}
                    disabled={option.isDisabled}
                    data-qa={`value-${option.value}`}
                    role="option"
                  >
                    {option.label ?? option.value.toString()}
                  </option>
                );
              })}
            </select>
          ) : (
            <ul
              style={{ ...sleveStyle, display: isSleveOpen ? 'block' : 'none' }}
              tabIndex={1}
              onKeyUp={sleveOnKeyUp}
            >
              {options.map((option) => {
                const itemStyle = option.isDisabled
                  ? { ...sleveItemStyle, ...disabledSleveItemStyle }
                  : selectedOption.id === option.id
                  ? { ...sleveItemStyle, ...selectedSleveItemStyle }
                  : sleveItemStyle;

                return (
                  <li
                    key={option.id}
                    style={itemStyle}
                    data-id={option.id}
                    data-qa={`value-${option.value}`}
                    role="option"
                    aria-selected={
                      selectedOption.id === option.id ? 'true' : 'false'
                    }
                    onClick={() => {
                      if (!option.isDisabled) {
                        setSelectedOption(option);
                        onSelectFn(option);
                        setIsSleveOpen(!isSleveOpen);
                      }
                    }}
                  >
                    {option.label ?? option.value.toString()}
                  </li>
                );
              })}
            </ul>
          )}
        </Fragment>
      ) : null}

      <input
        tabIndex={0}
        readOnly
        onKeyUp={triggerOnKeyUp}
        data-qa={`value-${selectedOption.value}`}
        role="button"
        aria-haspopup="true"
        aria-expanded={isSleveOpen ? 'true' : 'false'}
        value={selectedOption.label ?? selectedOption.value}
        style={inputStype}
        onClick={() => {
          setIsSleveOpen(!isSleveOpen);
          document
            .querySelectorAll(`[data-id='${selectedOption.id}']`)[0]
            .scrollIntoView();
        }}
      ></input>
    </div>
  );
};

export default NativeDropdown;
