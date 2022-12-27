import React, { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format'
import moment from 'moment'
import { Head, useForm } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import { toast } from 'react-toastify'
import { formatIDR } from '@/utils'
import { usePrevious } from 'react-use'
import Pagination from '@/Components/Pagination'
import Authenticated from '@/Layouts/Authenticated'
import SelectInput from '@/Components/CategorySelectInput'

export default function Transaction(props) {
  const { transactions, _search, _startDate, _endDate } = props
  const [startDate, setStartDate] = useState(_startDate)
  const [endDate, setEndDate] = useState(_endDate)
  const [search, setSearch] = useState(_search ? _search : '')
  const prevValues = usePrevious({search, startDate, endDate})

  const [transaction, setTransaction] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const {
    data,
    setData,
    errors,
    post,
    put,
    processing,
    delete: destroy,
  } = useForm({
    category_name: '',
    category_id: '',
    description: '',
    amount: 0,
    date: moment().format('yyyy-MM-DD'),
    is_income: 0,
    income_type: 0,
  })

  const toggleForm = (transaction = null) => {
    setShowForm(!showForm)
    if (transaction !== null) {
        handleEdit(transaction)
    } else {
        handleReset()
    }
  }

  const toggleCashType = () => {
    setData('income_type', data.income_type === 0 ? 1 : 0)
  }

  const toggleIncome = () => {
    setData({
      ...data,
      category_id: '',
      description: '',
      is_income: data.is_income === 0 ? 1 : 0,
      income_type: 1,
    })
  }

  const handleSelectedcategory = (category) => {
    setData({
      ...data,
      description: category.description,
      category_id: category.id,
      category_name: category.name,
    })
  }

  const handleChange = (e) => {
    const key = e.target.id
    const value = e.target.value
    setData(key, value)
  }

  const handleReset = () => {
    setTransaction(null)
    setSearch('')
    setStartDate(_startDate)
    setEndDate(_endDate)
    setData({
      category_id: '',
      description: '',
      amount: 0,
      date: moment().format('yyyy-MM-DD'),
      is_income: 0,
      income_type: 0,
    })
  }

  const handleDelete = (transaction) => {
    destroy(route('transactions.destroy', transaction), {
      onBefore: () =>
        confirm('Are you sure you want to delete this record?'),
      onSuccess: () =>
        Promise.all([
          handleReset(),
          toast.success('data has been deleted'),
        ]),
    })
  }

  const handleEdit = (transaction) => {
    setTransaction(transaction)
    setData({
        category_name: transaction.category?.name,
        category_id:
            transaction.category_id === null ? '' : transaction.category_id,
        description: transaction.description,
        amount: transaction.amount,
        date: moment(transaction.date).format('yyyy-MM-DD'),
        is_income: +transaction.is_income,
        income_type: +transaction.income_type,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (transaction !== null) {
      put(route('transactions.update', transaction), {
        onSuccess: () =>
          Promise.all([
              toggleForm(),
              handleReset(),
              toast.success('The Data has been changed'),
          ]),
      })
      return
    }
    post(route('transactions.store'), {
      onSuccess: () =>
        Promise.all([
            toggleForm(),
            handleReset(),
            toast.success('Data has been saved'),
        ]),
    })
  }

  const params = { q: search, startDate, endDate }

  useEffect(() => {
    if(prevValues) {
        Inertia.get(route(route().current()), params, {
        replace: true,
        preserveState: true
      })
    }
  }, [search, startDate, endDate])

  return (
    <Authenticated
        errors={props.errors}
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Transaction
            </h2>
        }
    >
        <Head title="Transaction" />

        <div className="flex flex-col space-y-2 py-12">
            <div className="w-full px-6 md:pr-8">
                <div className="card bg-white">
                    <div className="card-body">
                        <div
                            className="btn btn-secondary max-w-min my-2"
                            onClick={() => toggleForm()}
                        >
                            Add
                        </div>
                        <div className="w-full flex flex-col md:flex-row justify-between my-2 space-x-0 md:space-x-2 space-y-2 md:space-y-0">
                            <div className="form-control w-full">
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                />
                            </div>
                            <div className="form-control w-full">
                                <input
                                    type="date"
                                    className="input input-bordered"
                                    value={endDate}
                                    onChange={(e) =>
                                        setEndDate(e.target.value)
                                    }
                                />
                            </div>
                            <div className="form-control w-full">
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
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Category Name</th>
                                        <th className="w-32">
                                            Cash In/Out
                                        </th>
                                        <th>Description</th>
                                        <th>Amount</th>
                                        <th className="w-52"></th>
                                    </tr>
                                </thead>
                                <tbody
                                    className={
                                        processing ? 'opacity-70' : ''
                                    }
                                >
                                    {transactions?.data?.map(
                                        (transaction) => (
                                            <tr key={transaction.id}>
                                                <td>
                                                    {moment(
                                                        transaction.date
                                                    ).format('DD/MM/yyyy')}
                                                </td>
                                                <td>
                                                    {+transaction.is_income ===
                                                    0 ? (
                                                        <div className="badge badge-secondary">
                                                            Expense
                                                        </div>
                                                    ) : (
                                                        <div className="badge badge-primary">
                                                            Income
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    {
                                                        transaction
                                                            ?.category?.name
                                                    }
                                                </td>
                                                <td>
                                                    {+transaction.income_type ===
                                                    0 ? (
                                                        <div className="badge badge-secondary">
                                                            Cash Out
                                                        </div>
                                                    ) : (
                                                        <div className="badge badge-accent">
                                                            Cash In
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    {
                                                        transaction.description
                                                    }
                                                </td>
                                                <td>
                                                    {formatIDR(
                                                        transaction.amount
                                                    )}
                                                </td>
                                                <td>
                                                    <div
                                                        className="btn btn-warning mx-1"
                                                        onClick={() =>
                                                            toggleForm(
                                                                transaction
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </div>
                                                    <div
                                                        className="btn btn-error mx-1"
                                                        onClick={() =>
                                                            handleDelete(
                                                                transaction
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={transactions?.links} params={params}/>
                    </div>
                </div>
            </div>
        </div>
        <div
            id="create-modal"
            className="modal"
            style={
                showForm
                    ? {
                          opacity: 1,
                          pointerEvents: 'auto',
                          visibility: 'visible',
                      }
                    : {}
            }
        >
            <div className="modal-box">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Date</span>
                    </label>
                    <input
                        type="date"
                        className={`input input-bordered ${
                            errors.date ? 'input-error' : ''
                        }`}
                        id="date"
                        value={data.date}
                        onChange={handleChange}
                    />
                    <label className="label">
                        <span className="label-text-alt">
                            {errors.date}
                        </span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="cursor-pointer label">
                        <input
                            type="checkbox"
                            checked={data.is_income === 1 ? true : false}
                            onChange={toggleIncome}
                            className="checkbox checkbox-primary"
                        />
                        <span className="label-text font-bold">Income</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Category</span>
                    </label>
                    <SelectInput
                        value={data.category_name}
                        onItemSelected={handleSelectedcategory}
                        disabled={data.is_income === 1}
                        invalid={errors.category_id ? true : false}
                    />
                    <label className="label">
                        <span className="label-text-alt">
                            {errors.category_id}
                        </span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Description</span>
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
                    <label className="cursor-pointer label">
                        <span className="label-text font-bold">
                            {data.income_type === 0
                                ? 'Cash Out'
                                : 'Cash In'}
                        </span>
                        <input
                            type="checkbox"
                            checked={data.income_type === 0 ? true : false}
                            disabled={data.is_income === 1}
                            className="toggle"
                            onChange={toggleCashType}
                        />
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
                <div className="modal-action">
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
                    <button
                        className="btn btn-outline btn-secondary"
                        onClick={() => toggleForm()}
                        disabled={processing}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </Authenticated>
  )
}
