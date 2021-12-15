import React from 'react'
import { Link, useForm } from '@inertiajs/inertia-react';


export default function ModalClosing({csrf_token}) {
  const {data, setData} = useForm({
    is_rolling: 0,
  })

  return (
    <div id="my-modal" className="modal">
      <div className="modal-box">
        <h1 className="font-bold text-2xl pb-8">Form Closing</h1>
        <div className="form-control py-4 px-6">
          <label className="cursor-pointer label">
            <span className="label-text">Roll forward Budget per Category</span> 
            <input type="checkbox" checked={data.is_rolling === 1} className="checkbox" value="" onChange={() => setData('is_rolling', data.is_rolling === 0 ? 1 : 0)}/>
          </label>
        </div>
        <div className="modal-action">
          <a href={`${route('close')}?is_rolling=${data.is_rolling}`} className={`btn btn-primary`}>Download</a>
          <Link href={route('summary')} className="btn">Close</Link>
        </div>
      </div>
    </div>
  )
}