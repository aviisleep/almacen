import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const SignaturePad = ({ 
  onSave, 
  onClear, 
  initialValue = null,
  description = "Firma aquí",
  required = false
}) => {
  const sigCanvas = useRef(null);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    if (initialValue && sigCanvas.current && !sigCanvas.current.isEmpty()) {
      sigCanvas.current.fromDataURL(initialValue);
      setIsSigned(true);
    }
  }, [initialValue]);

  const clear = () => {
    sigCanvas.current.clear();
    setIsSigned(false);
    if (onClear) onClear();
  };

  const save = () => {
  if (!sigCanvas.current.isEmpty()) {
    const canvas = sigCanvas.current.getCanvas(); // Usa getCanvas() en lugar de getTrimmedCanvas()
    const signature = canvas.toDataURL('image/png');
    onSave(signature);
    setIsSigned(true);
  }
};

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {description}
        {required && <span className="text-red-500"> *</span>}
      </label>
      
      <div className="border rounded bg-white border-gray-300">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: '100%',
            height: 200,
            className: 'signature-canvas w-full h-48 bg-white'
          }}
          penColor="black"
          backgroundColor="rgb(255, 255, 255)"
        />
      </div>
      
      <div className="flex justify-between gap-2">
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <XMarkIcon className="h-4 w-4 mr-2" />
          Limpiar
        </button>
        <button
          type="button"
          onClick={save}
          className={`inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSigned ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <CheckIcon className="h-4 w-4 mr-2" />
          {isSigned ? 'Firma Guardada' : 'Guardar Firma'}
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;