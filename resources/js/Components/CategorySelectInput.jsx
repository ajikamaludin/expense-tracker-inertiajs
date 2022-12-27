/*
  Select Input Common React Component
  Inspired By: react-select , https://codepen.io/dixie0704/pen/jOVxGXL, and others
  Created By: Aji Kamaludin <aji19kamaludin@gmail.com> 
*/

import React, { useRef, useEffect, useState } from 'react'
import { useDebounce } from '@/Hooks'

export default function CategorySelectInput(props) {
  const { value = '', onItemSelected = null, disabled = false, createNew = null, invalid = false} = props

  const ref = useRef()

  const [showItems, setShowItem] = useState([])

  const [isSelected, setIsSelected] = useState(true)
  const [selected, setSelected] = useState(value)
  const [query, setQuery] = useState('')
  const q = useDebounce(query, 300)

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggle = () => {
    setIsSelected(false)
    setQuery('')
    setIsOpen(!isOpen)
  }

  const onInputMouseDown = () => {
    setIsSelected(false)
    setQuery('')
    setIsOpen(true)
  }

  const handleSelectItem = (item) => {
    setIsSelected(true)
    onItemSelected(item)
    setSelected(item.name)
    setIsOpen(false)
  }

  const filterItems = (value) => {
    setIsSelected(false)
    setQuery(value)
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

  useEffect(() => {
    setLoading(true)
    fetch(`${route('api.categories.query')}?q=${q}`)
        .then((res) => res.json())
        .then((json) => {
            setShowItem(json)
        })
        .catch((err) => {
            alert(err)
        })
        .finally(() => setLoading(false))
  }, [q])

  useEffect(() => {
      setSelected('')
  }, [disabled])

  useEffect(() => {
      setSelected(value)
  }, [value])

  return (
      <div className="flex flex-col items-center" ref={ref}>
          <div className="w-full flex flex-col items-center">
              <div className="w-full">
                  <div className="flex flex-col items-center relative">
                      <div className="w-full">
                          <div
                              className={`my-2 p-1 bg-white flex border rounded-lg 
                                ${
                                    invalid
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                }
                                ${disabled ? 'bg-gray-50' : ''}`}
                          >
                              <input
                                  className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                                  onMouseDown={onInputMouseDown}
                                  placeholder="select category..."
                                  value={isSelected ? selected : query}
                                  onChange={(e) => filterItems(e.target.value)}
                                  disabled={disabled}
                              />
                              <div onClick={disabled ? () => {} : toggle}>
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
                                  {loading ? (
                                      <div>
                                          <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-neutral-content">
                                              <div className="w-full items-center justify-center flex">
                                                  <div className="mx-2 my-5">
                                                      <span>Loading...</span>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  ) : (
                                      <>
                                          {createNew !== null && (
                                              <div
                                                  className="bordered"
                                                  onClick={createNew}
                                              >
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
                                                                  strokeWidth={
                                                                      2
                                                                  }
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
                                                  onClick={() =>
                                                      handleSelectItem(item)
                                                  }
                                              >
                                                  <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-neutral-content hover:bg-gray-300">
                                                      <div className="w-full items-center flex">
                                                          <div className="mx-2">
                                                              <span>
                                                                  {item.name}
                                                              </span>
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
                                      </>
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