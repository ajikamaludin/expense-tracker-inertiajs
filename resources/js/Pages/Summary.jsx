import React from 'react';
import Pagination from '@/Components/Pagination'
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { formatIDR } from '@/utils';
import ModalClosing from './ModalClosing';

export default function Summary(props) {
  const { data: budgets , links } = props.budgets

  return (
      <Authenticated
          errors={props.errors}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Summary</h2>}
      >
          <Head title="Summary" />

          <div className="flex flex-col space-x-0 space-y-2 md:space-y-0 md:space-x-4 md:flex-row pt-6 px-6">
            <div className="card bg-white w-full md:w-1/4">
              <div className="card-body">
                <h1 className="font-bold text-xl">Total Income : {formatIDR(props.income)}</h1>
              </div>
            </div>
            <div className="card bg-white w-full md:w-1/4">
              <div className="card-body">
                <h1 className="font-bold text-xl">Total Expense : {formatIDR(props.expense)}</h1>
              </div>
            </div>
            <div className="card bg-white w-full md:w-1/4">
              <div className="card-body">
                <h1 className="font-bold text-xl">Balance : {formatIDR(props.balance)}</h1>
              </div>
            </div>
            <div className="card bg-white w-full md:w-1/4">
              <div className="card-body">
                <a href="#my-modal"className="btn btn-primary">monthly closing</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row py-6">
            
            <div className="w-full px-6 md:pr-8">
              <div className="card bg-white">
                <div className="card-body">
                  <div className="overflow-x-auto">
                    <table className="table w-full table-zebra">
                      <thead>
                        <tr>
                          <th></th> 
                          <th>Category Name</th> 
                          <th>Description</th> 
                          <th>Budget</th>
                          <th>Previous Budget</th>
                          <th>Total Expense/month</th>
                          <th>Remain per Category</th>
                        </tr>
                      </thead> 
                      <tbody>
                        {budgets?.map((budget, index) => (
                          <tr key={budget.id}>
                            <th>{index+1}</th> 
                            <td>{budget?.category?.name}</td> 
                            <td>{budget?.category?.description}</td> 
                            <td>{formatIDR(budget.budget)}</td>
                            <td>{formatIDR(budget.rollover)}</td>
                            <td>{formatIDR(budget.total_used)}</td>
                            <td>{formatIDR(budget.remain)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination links={links}/>
                </div>
              </div>
            </div>
          </div>
        <ModalClosing />
      </Authenticated>
  );
}
