import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const SignaturePad = ({ onSave }) => {
  const sigCanvas = useRef(null);
  const [isSigned, setIsSigned] = useState(false);

  const clear = () => {
    sigCanvas.current.clear();
    setIsSigned(false);
  };

  const save = () => {
    if (sigCanvas.current.isEmpty()) {
      alert('Por favor, proporcione una firma primero');
      return;
    }
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    onSave(signature);
    setIsSigned(true);
  };

  return (
    <div className="space-y-2">
      <div className="border rounded bg-white">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: '100%',
            height: 200,
            className: 'signature-canvas w-full h-48'
          }}
          onEnd={() => setIsSigned(true)}
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <XMarkIcon className="h-4 w-4 mr-2" />
          Limpiar
        </button>
        <button
          type="button"
          onClick={save}
          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <CheckIcon className="h-4 w-4 mr-2" />
          {isSigned ? 'Firma Guardada' : 'Guardar Firma'}
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;