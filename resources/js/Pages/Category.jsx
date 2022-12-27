import React, { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format'
import { usePrevious } from 'react-use'
import { toast } from 'react-toastify'
import { Head, useForm } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import { formatIDR } from '@/utils'
import Pagination from '@/Components/Pagination'
import Authenticated from '@/Layouts/Authenticated'

export default function Category(props) {
  const { _search } = props
  const [search, setSearch] = useState(_search)
  const preValue = usePrevious(search)
  const [category, setCategory] = useState(null)

  const { data: categories , links } = props.categories
  const { data, setData, errors, post, put, processing, delete: destroy } = useForm({
    name: '',
    description: '',
    amount: 0
  })

  const handleChange = (e) => {
    const key = e.target.id;
    const value = e.target.value
    setData(key, value)
  }

  const handleReset = () => {
    setCategory(null)
    setData({
      name: '',
      description: '',
      amount: ''
    })
  }

  const handleEdit = (category) => {
    setCategory(category)
    setData({
      name: category.name,
      description: category.description,
      amount: category.default_budget
    })
  }

  const handleDelete = (category) => {
      destroy(route('categories.destroy', category), {
        onBefore: () => confirm('Are you sure you want to delete this record?'),
        onSuccess: () => Promise.all([
          handleReset(),
          toast.success('data has been deleted')
        ])
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(category !== null) {
      put(route('categories.update', category), {
        onSuccess: () => Promise.all([
          handleReset(),
          toast.success('The Data has been changed')
        ])
      })
      return
    }
    post(route('categories.store'), {
      onSuccess: () => Promise.all([
        handleReset(),
        toast.success('Data has been saved')
      ])
    })
  }

  useEffect(() => {
    if (preValue) {
      Inertia.get(route(route().current()), { q: search }, {
          replace: true,
          preserveState: true,
      })
    }
  }, [search])

  return (
      <Authenticated
          errors={props.errors}
          header={
              <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                  Category
              </h2>
          }
      >
          <Head title="Category" />

          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row py-12">
              <div className="w-full md:w-1/3 px-6 md:pl-8">
                  <div className="card bg-white">
                      <div className="card-body">
                          <div className="form-control">
                              <label className="label">
                                  <span className="label-text">
                                      Category Name
                                  </span>
                              </label>
                              <input
                                  type="text"
                                  placeholder="Name"
                                  className={`input input-bordered ${
                                      errors.name ? 'input-error' : ''
                                  }`}
                                  id="name"
                                  value={data.name}
                                  onChange={handleChange}
                              />
                              <label className="label">
                                  <span className="label-text-alt">
                                      {errors.name}
                                  </span>
                              </label>
                          </div>
                          <div className="form-control">
                              <label className="label">
                                  <span className="label-text">
                                      Description
                                  </span>
                              </label>
                              <input
                                  type="text"
                                  placeholder="Description"
                                  className={`input input-bordered ${
                                      errors.description ? 'input-error' : ''
                                  }`}
                                  id="description"
                                  value={data.description}
                                  onChange={handleChange}
                              />
                              <label className="label">
                                  <span className="label-text-alt">
                                      {errors.description}
                                  </span>
                              </label>
                          </div>
                          <div className="form-control">
                              <label className="label">
                                  <span className="label-text">Amount</span>
                              </label>
                              <NumberFormat
                                  className={`input input-bordered ${
                                      errors.amount ? 'input-error' : ''
                                  }`}
                                  value={data.amount}
                                  thousandSeparator="."
                                  decimalSeparator=","
                                  onValueChange={({ value }) =>
                                      setData('amount', value)
                                  }
                              />
                              <label className="label">
                                  <span className="label-text-alt">
                                      {errors.amount}
                                  </span>
                              </label>
                          </div>
                          <div className="card-actions">
                              <button
                                  className={`btn btn-primary ${
                                      processing && 'animate-spin'
                                  }`}
                                  onClick={handleSubmit}
                                  disabled={processing}
                              >
                                  Add
                              </button>
                              <button
                                  className="btn btn-secondary"
                                  onClick={handleReset}
                                  disabled={processing}
                              >
                                  Clear
                              </button>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="w-full md:w-2/3 px-6 md:pr-8">
                  <div className="card bg-white">
                      <div className="card-body">
                          <div className="flex justify-end my-1">
                              <div className="form-control">
                                  <input
                                      type="text"
                                      className="input input-bordered"
                                      value={search}
                                      onChange={(e) =>
                                          setSearch(e.target.value)
                                      }
                                      placeholder="Search"
                                  />
                              </div>
                          </div>
                          <div className="overflow-x-auto">
                              <table className="table w-full table-zebra">
                                  <thead>
                                      <tr>
                                          <th></th>
                                          <th className="w-36">
                                              Category Name
                                          </th>
                                          <th>Description</th>
                                          <th>Amount</th>
                                          <th className="w-52"></th>
                                      </tr>
                                  </thead>
                                  <tbody
                                      className={processing ? 'opacity-70' : ''}
                                  >
                                      {categories?.map((category) => (
                                          <tr key={category.id}>
                                              <th>{category.id}</th>
                                              <td>{category.name}</td>
                                              <td>{category.description}</td>
                                              <td>
                                                  {formatIDR(
                                                      category.default_budget
                                                  )}
                                              </td>
                                              <td>
                                                  <div
                                                      className="btn btn-warning mx-1"
                                                      onClick={() =>
                                                          handleEdit(category)
                                                      }
                                                  >
                                                      Edit
                                                  </div>
                                                  <div
                                                      className="btn btn-error mx-1"
                                                      onClick={() =>
                                                          handleDelete(category)
                                                      }
                                                  >
                                                      Delete
                                                  </div>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                          <Pagination links={links} params={{ q: search }}/>
                      </div>
                  </div>
              </div>
          </div>
      </Authenticated>
  )
}
