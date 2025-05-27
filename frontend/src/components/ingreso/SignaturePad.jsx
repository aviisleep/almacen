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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialValue && sigCanvas.current) {
      try {
        // Verificar que el valor inicial sea un DataURL válido
        if (typeof initialValue === 'string' && initialValue.startsWith('data:')) {
          sigCanvas.current.fromDataURL(initialValue);
          setIsSigned(true);
          setError(null);
        } else {
          console.warn('Valor inicial de firma inválido');
          setError('Error al cargar la firma inicial');
        }
      } catch (err) {
        console.error('Error al cargar firma inicial:', err);
        setError('Error al cargar la firma inicial');
      }
    }
  }, [initialValue]);

  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsSigned(false);
      setError(null);
      if (onClear) onClear();
    }
  };

  const save = () => {
    if (!sigCanvas.current) {
      setError('Error: No se pudo acceder al canvas de firma');
      return;
    }

    if (sigCanvas.current.isEmpty()) {
      setError('Por favor, firme antes de guardar');
      return;
    }

    try {
      // Obtener el canvas y asegurarse de que tenga un fondo blanco
      const canvas = sigCanvas.current.getCanvas();
      const context = canvas.getContext('2d');
      
      // Crear un canvas temporal para la firma con fondo blanco
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempContext = tempCanvas.getContext('2d');
      
      // Establecer fondo blanco en el canvas temporal
      tempContext.fillStyle = 'white';
      tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Copiar la firma al canvas temporal
      tempContext.drawImage(canvas, 0, 0);

      // Generar el DataURL con calidad máxima desde el canvas temporal
      const signature = tempCanvas.toDataURL('image/png', 1.0);
      
      // Validar que el DataURL sea válido
      if (!signature || !signature.startsWith('data:image/png;base64,')) {
        throw new Error('Error al generar la firma');
      }

      onSave(signature);
      setIsSigned(true);
      setError(null);
    } catch (err) {
      console.error('Error al guardar firma:', err);
      setError('Error al guardar la firma');
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
          clearOnResize={false}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
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