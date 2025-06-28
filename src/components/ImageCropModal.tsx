import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, RotateCw, ZoomIn, ZoomOut, Crop, Download, Check } from 'lucide-react';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
  title: string;
  description: string;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 1.91, // Default para Facebook (1200x630)
  title,
  description
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteCallback = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getRadianAngle = (degreeValue: number) => {
    return (degreeValue * Math.PI) / 180;
  };

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = getRadianAngle(rotation);
    return {
      width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  };

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false }
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const rotRad = getRadianAngle(rotation);
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    if (!croppedCtx) {
      throw new Error('No 2d context');
    }

    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCropSave = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(croppedImage);
      onClose();
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 1));
  };

  const getAspectRatioLabel = () => {
    if (aspectRatio === 1.91) return '1200x630 (Facebook/Twitter)';
    if (aspectRatio === 1) return '1:1 (Quadrado)';
    if (aspectRatio === 16/9) return '16:9 (Widescreen)';
    return `${aspectRatio}:1`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-75" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Crop className="w-6 h-6 text-blue-600" />
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            <div className="text-xs text-blue-600 mt-1">
              Proporção: {getAspectRatioLabel()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative h-96 bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            showGrid={true}
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                backgroundColor: '#1f2937'
              }
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={zoom <= 1}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 min-w-32">
                  <span className="text-sm text-gray-600">Zoom:</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-8">{zoom.toFixed(1)}x</span>
                </div>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Rotation */}
              <button
                onClick={handleRotate}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span className="text-sm">Girar</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCropSave}
                disabled={isProcessing || !croppedAreaPixels}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Aplicar Corte
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>Instruções:</strong>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Arraste para mover a imagem</li>
                <li>• Use a roda do mouse ou controles para ajustar o zoom</li>
                <li>• Clique em "Girar" para rotacionar a imagem</li>
                <li>• A área destacada será a imagem final</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;