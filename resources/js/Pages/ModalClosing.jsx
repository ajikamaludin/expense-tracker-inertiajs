import React, { useState } from 'react'
import { Link, useForm } from '@inertiajs/inertia-react';
import { toast } from 'react-toastify';
import { Inertia } from '@inertiajs/inertia'

export default function ModalClosing() {
  const {data, setData} = useForm({
    is_rolling: 0,
  })

  const [loading, setLoading] = useState(false)

  const handleDownload = () => {
    const confirm = window.confirm('hapus transaksi dan buat budget baru ?')
    if(!confirm){
      return
    }
    setLoading(true)
    fetch(`${route('close')}?is_rolling=${data.is_rolling}`, {
      method: 'GET'
    })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `summary.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .finally(() => {
      toast.success('berhasil mendownload, silahkan klik close')
      setLoading(false)
      setTimeout(() => {
        Inertia.visit(route('summary'))
      }, 3000)
    });
  }

  return (
    <div id="my-modal" className="modal">
      <div className="modal-box">
        <h1 className="font-bold text-2xl pb-8">Monthly Closing</h1>
        <div className="form-control py-4 px-6">
          <label className="cursor-pointer label">
            <span className="label-text">Roll forward Budget per Category</span> 
            <input type="checkbox" checked={data.is_rolling === 1} className="checkbox" value="" onChange={() => setData('is_rolling', data.is_rolling === 0 ? 1 : 0)}/>
          </label>
        </div>
        <div className="modal-action">
          <div onClick={handleDownload} className={`btn btn-primary ${loading && 'animate-spin'}`} disabled={loading}>Download</div>
          <Link href={route('summary')} className="btn">Close</Link>
        </div>
      </div>
    </div>
  )
}