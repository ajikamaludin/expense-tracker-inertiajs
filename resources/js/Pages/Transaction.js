import React, { useState } from 'react';
import Pagination from '@/Components/Pagination';
import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { formatIDR } from '@/utils';

export default function Transaction(props) {
  const { categories, transactions } = props
  const [transaction, setTransaction] = useState(null)
  const { data, setData, errors, post, put, processing, delete: destroy } = useForm({
    category_id: '',
    description: '',
    amount: 0,
    date: moment().format('yyyy-MM-DD'),
    is_income: 0,
    income_type: 0
  })

  const toggleCashType = () => {
    setData('income_type', data.income_type === 0 ? 1 : 0)
  }

  const toggleIncome = () => {
    setData('is_income', data.is_income === 0 ? 1 : 0)
  }

  const handleSelectedcategory = (e) => {
    setData('category_id', e.target.value)
  }

  const handleChange = (e) => {
    const key = e.target.id;
    const value = e.target.value
    setData(key, value)
  }

  const handleReset = () => {
    setTransaction(null)
    setData({
      category_id: '',
      description: '',
      amount: 0,
      date: moment().format('yyyy-MM-DD'),
      is_income: 0,
      income_type: 0
    })
  }

  const handleDelete = (transaction) => {
      destroy(route('transactions.destroy', transaction), {
        onBefore: () => confirm('Are you sure you want to delete this record?'),
        onSuccess: () => Promise.all([
          handleReset(),
          toast.success('data has been deleted')
        ])
      })
  }

  const handleEdit = (transaction) => {
    setTransaction(transaction)
    setData({
      category_id: transaction.category_id === null ? '' : transaction.category_id,
      description: transaction.description,
      amount: transaction.amount,
      date: moment(transaction.date).format('yyyy-MM-DD'),
      is_income: +transaction.is_income,
      income_type: +transaction.income_type
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(transaction !== null) {
      put(route('transactions.update', transaction), {
        onSuccess: () => Promise.all([
          handleReset(),
          toast.success('The Data has been changed')
        ])})
      return
    }
    post(route('transactions.store'), {
      onSuccess: () => Promise.all([
        handleReset(),
        toast.success('Data has been saved')
      ])
    })
  }

  return (
      <Authenticated
          errors={props.errors}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Transaction</h2>}
      >
          <Head title="Transaction" />

          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row py-12">
            <div className="w-full md:w-1/3 px-6 md:pl-8">
              <div className="card bg-white">
                <div className="card-body">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date</span>
                    </label> 
                    <input 
                      type="date"
                      className={`input input-bordered ${errors.date ? 'input-error' : ''}`} 
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
                      <input type="checkbox" checked={data.is_income === 1 ? true : false} onChange={toggleIncome}/>
                      <span className="label-text font-bold">Income</span> 
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Category</span>
                    </label>
                    <select 
                      className={`select select-bordered w-full max-w-xs ${errors.category_id && 'select-error'}`} 
                      id="category_id" 
                      onChange={handleSelectedcategory} 
                      disabled={data.is_income === 1}
                      value={data.category_id}
                    >
                      <option disabled="disabled" selected={'' === data.category_id} value=''>Choose your category</option> 
                      {categories.map(category => ( 
                          <option key={category.id} value={category.id} selected={category.id === data.category_id}>{category.name}</option>
                        )
                      )}
                    </select>
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
                      className={`input input-bordered ${errors.description ? 'input-error' : ''}`} 
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
                      <span className="label-text font-bold">{data.income_type === 0 ? 'Cash Out' : 'Cash In'}</span> 
                      <input type="checkbox" checked={data.income_type === 0 ? true : false} className="toggle" onChange={toggleCashType}/>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Amount</span>
                    </label> 
                    <input 
                      type="number"
                      placeholder="Amount"
                      className={`input input-bordered ${errors.amount ? 'input-error' : ''}`} 
                      id="amount" 
                      value={data.amount} 
                      onChange={handleChange}
                    />
                    <label className="label">
                        <span className="label-text-alt">
                            {errors.amount}
                        </span>
                    </label>
                  </div>
                  <div className="card-actions">
                    <button className={`btn btn-primary ${processing && 'animate-spin'}`} onClick={handleSubmit} disabled={processing}>Add</button>
                    <button className="btn btn-secondary" onClick={handleReset} disabled={processing}>Clear</button>
                  </div>
                </div>
              </div> 
            </div>

            <div className="w-full md:w-2/3 px-6 md:pr-8">
              <div className="card bg-white">
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="table w-full table-zebra">
                      <thead>
                        <tr>
                          <th>Date</th> 
                          <th>Income</th> 
                          <th>Category</th>
                          <th>Cash In/Out</th>
                          <th>Description</th>
                          <th>Amount</th>
                          <th></th>
                        </tr>
                      </thead> 
                      <tbody className={processing ? "opacity-70" : ""}>
                        {transactions?.data?.map(transaction => (
                          <tr key={transaction.id}>
                            <td>{moment(transaction.date).format('DD/MM/yyyy')}</td>
                            <td>
                              {+transaction.is_income === 0 ? (
                                <div className="badge badge-secondary">Expense</div> 
                              ) : (
                                <div className="badge badge-primary">Income</div> 
                              )}
                            </td>
                            <td>{transaction?.category?.name}</td> 
                            <td>
                              {+transaction.income_type === 0 ? (
                                <div className="badge badge-secondary">Cash Out</div> 
                              ) : (
                                <div className="badge badge-accent">Cash In</div> 
                              )}
                            </td>
                            <td>{transaction.description}</td>
                            <td>{formatIDR(transaction.amount)}</td>
                            <td>
                              <div className="btn btn-warning mx-1" onClick={() => handleEdit(transaction)}>Edit</div>
                              <div className="btn btn-error mx-1" onClick={() => handleDelete(transaction)}>Delete</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination links={transactions?.links} />
                </div>
              </div>
            </div>
              
          </div>
      </Authenticated>
  );
}
