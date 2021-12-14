import React from 'react'

export default function ModalClosing() {
  return (
    <div id="my-modal" className="modal">
      <div className="modal-box">
        <h1 className="font-bold text-2xl pb-8">Form Closing</h1>
        <div className="form-control py-4 px-6">
          <label className="cursor-pointer label">
            <span className="label-text">Roll forward Budget per Category</span> 
            <input type="checkbox" checked="checked" className="checkbox" value="" onChange={() => {}}/>
          </label>
        </div>
        <div className="modal-action">
          <a href="#" className="btn btn-primary">Download</a> 
          <a href="#" className="btn">Close</a>
        </div>
      </div>
    </div>
  )
}