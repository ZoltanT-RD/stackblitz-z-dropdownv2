import * as React from 'react';
import NativeDropdown from './dropdown';
import './style.css';

export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
      <div style={{ width: '200px', height: '50px' }}>
        <NativeDropdown
          options={[
            { id: '1', value: 'test11', isDisabled: 'true' },
            { id: '2', label: 'I am a label', value: 'test2' },
            { id: '3', value: 'something' },
            {
              id: '4',
              label: 'I am an annoyingly long label! coz why not?!',
              value: 'else',
              isDisabled: true,
            },
            { id: '5', value: 'here' },
            { id: '6', value: 'here 2' },
            { id: '7', value: 'here 3' },
            { id: '8', value: 'here 4' },
            { id: '9', value: 'here 5' },
          ]}
          preSelectedOptionId={'6'}
          onSelectFn={(e) => {
            console.log(e);
          }}
        />
      </div>
    </div>
  );
}
