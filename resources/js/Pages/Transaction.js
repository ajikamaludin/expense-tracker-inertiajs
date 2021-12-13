import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';

export default function Transaction(props) {
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
                        <span className="label-text">Username</span>
                      </label> 
                      <input type="text" placeholder="username" className="input input-bordered"/>
                    </div>
                    <div className="justify-end card-actions">
                      <button className="btn btn-secondary">Save</button>
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
                            <th></th> 
                            <th>Name</th> 
                            <th>Job</th> 
                            <th>Favorite Color</th>
                          </tr>
                        </thead> 
                        <tbody>
                          <tr>
                            <th>9</th> 
                            <td>Lesya Tinham</td> 
                            <td>Safety Technician IV</td> 
                            <td>Maroon</td>
                          </tr>
                          <tr>
                            <th>10</th> 
                            <td>Zaneta Tewkesbury</td> 
                            <td>VP Marketing</td> 
                            <td>Green</td>
                          </tr>
                          <tr>
                            <th>11</th> 
                            <td>Andy Tipple</td> 
                            <td>Librarian</td> 
                            <td>Indigo</td>
                          </tr>
                          <tr>
                            <th>12</th> 
                            <td>Sophi Biles</td> 
                            <td>Recruiting Manager</td> 
                            <td>Maroon</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
                
            </div>
        </Authenticated>
    );
}
