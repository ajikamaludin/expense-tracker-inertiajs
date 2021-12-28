/*
  Select Input Common React Component
  Inspired By: react-select , https://codepen.io/dixie0704/pen/jOVxGXL, and others
  Created By: Aji Kamaludin <aji19kamaludin@gmail.com> 
*/

import React, { useRef, useEffect, useState } from 'react'

export default function SelectInput(props) {
  const ref = useRef()

  const items = [
    'rahayuheni3@gmail.com',
    'inovacell04@gmail.com',
    'Btg33@gmail.com',
    'nikolampo96@gmail.com',
    'grinaldifoc@gmail.com',
    'nienha_tj26@yahoo.com',
    'rizkitriwhyuni139@gmail.com',
    'wahyu.saputro6982@gmail.com',
    'fariyath315@gmail.com',
    'suryaningsihworo@gmail.com',
    'andiyanayudi@gmail.com',
    'hoshos2303@gmail.com',
    'emailnaontehiyeu@gmail.com',
    'surahmanomez@gmail.com',
    'mmainah172@gmail.com',
    'kiosbuuyun@gmail.com',
  ]

  const [showItems, setShowItem] = useState(items)
  const [selected, setSelected] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [createNew] = useState(true)
  const disable = false

  const toggle = () => {
    setSelected('')
    setShowItem(items)
    setIsOpen(!isOpen)
  }

  const onInputMouseDown = () => {
    setSelected('')
    setShowItem(items)
    setIsOpen(true)
  }

  const handleSelectItem = (item) => {
    setSelected(item)
    setIsOpen(false)
  }

  const filterItems = (value) => {
    setSelected(value)
    setShowItem(items.filter(item => item.toLowerCase().includes(value)))
  }

  useEffect(() => {
      const checkIfClickedOutside = (e) => {
          if (isOpen && ref.current && !ref.current.contains(e.target)) {
              setIsOpen(false)
          }
      }
      document.addEventListener('mousedown', checkIfClickedOutside)
      return () => {
          document.removeEventListener('mousedown', checkIfClickedOutside)
      }
  }, [isOpen])

  return (
      <div className="flex flex-col items-center" ref={ref}>
          <div className="w-full flex flex-col items-center">
              <div className="w-full">
                  <div className="flex flex-col items-center relative">
                      <div className="w-full">
                          <div className="my-2 p-1 bg-white flex border border-gray-300 rounded-lg">
                              <input
                                  className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                                  onMouseDown={onInputMouseDown}
                                  placeholder="select category..."
                                  value={selected}
                                  onChange={(e) => filterItems(e.target.value)}
                                  disabled={disable}
                              />
                              <div
                                  onClick={disable ? () => {} : toggle}
                                  className={`text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200 ${
                                      disable ? 'bg-gray-50' : ''
                                  }`}
                              >
                                  <button className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                                      <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                      >
                                          {isOpen ? (
                                              <polyline points="18 15 12 9 6 15"></polyline>
                                          ) : (
                                              <polyline points="18 15 12 20 6 15"></polyline>
                                          )}
                                      </svg>
                                  </button>
                              </div>
                          </div>
                      </div>
                      {isOpen && (
                          <div
                              className="absolute shadow-lg bg-white top-100 z-40 w-full lef-0 rounded overflow-y-auto"
                              style={{ maxHeight: '300px', top: '100%' }}
                          >
                              <div className="flex flex-col w-full">
                                  {createNew && (
                                      <div className="bordered">
                                          <div className="flex w-full items-center justify-center p-2 pl-2 border-transparent border-l-2 relative hover:bg-gray-600 hover:text-white">
                                              <div className="w-full items-center justify-center flex space-x-2">
                                                  <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      className="h-6 w-6"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                  >
                                                      <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                      />
                                                  </svg>
                                                  <div>New</div>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                                  {showItems.map((item, index) => (
                                      <div
                                          key={index}
                                          onClick={() => handleSelectItem(item)}
                                      >
                                          <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-neutral-content hover:bg-gray-300">
                                              <div className="w-full items-center flex">
                                                  <div className="mx-2">
                                                      <span>{item}</span>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                                  {showItems.length <= 0 && (
                                      <div>
                                          <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-neutral-content">
                                              <div className="w-full items-center justify-center flex">
                                                  <div className="mx-2 my-5">
                                                      <span>
                                                          No Items Found
                                                      </span>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
  )
}