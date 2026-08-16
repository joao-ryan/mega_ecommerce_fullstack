import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../lib/formatters';
import { deleteProduct } from '../services/api';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Star,
  CheckCircle2,
  Shield,
  Truck,
  Sparkles,
  RotateCcw,
  Share2,
  Edit3,
  Trash2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (id: string | number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onEditProduct,
  onDeleteProduct,
}) => {
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Sync state when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.image_url);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0].name : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setSelectedStorage(product.storageOptions && product.storageOptions.length > 0 ? product.storageOptions[0] : '');
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image_url];

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor || undefined, selectedStorage || undefined, selectedSize || undefined);
    showToast(`"${product.name}" adicionado à sacola!`, 'success');
    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-gray-200/80 shadow-2xl overflow-hidden z-10 text-gray-900 my-8"
      >
        {/* Close Button */}
        <button
          id="btn-close-product-detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 bg-[#F5F5F7] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200/80">
            <div className="relative aspect-[4/3] flex items-center justify-center">
              <img
                src={selectedImage || product.image_url}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-72 w-full object-contain mix-blend-multiply transition-all duration-300"
              />
            </div>

            {/* Thumbnail Carousel if multiple images */}
            {galleryImages.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200/60">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-xl p-1 bg-white border transition-all ${
                      selectedImage === img
                        ? 'border-black shadow-xs ring-1 ring-black'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specs & Purchase Options */}
          <div className="md:col-span-6 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="font-semibold text-[#0066CC] uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="text-gray-400 font-medium">
                      • {product.brand}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating || 4.9}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    {product.reviewCount || 100}+ avaliações verificadas
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-medium text-emerald-600">
                    {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-2">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through block font-mono">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                <div className="text-3xl font-extrabold text-gray-900 font-mono tracking-tight">
                  {formatCurrency(product.price)}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Em até 12x de {formatCurrency(product.price / 12)} sem juros ou com 10% OFF no Pix.
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {product.description}
              </p>

              {/* Colors Options if available */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-900 block">
                    Acabamento / Cor: <strong className="text-gray-700">{selectedColor}</strong>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                          selectedColor === c.name
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 inline-block"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes if available (Moda/Calçados) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-900 block">
                    Tamanho Selecionado: <strong className="text-gray-700">{selectedSize}</strong>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`w-10 h-10 rounded-xl text-xs font-semibold border flex items-center justify-center transition-all ${
                          selectedSize === s
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage options if available (Tech) */}
              {product.storageOptions && product.storageOptions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-900 block">
                    Capacidade: <strong className="text-gray-700">{selectedStorage}</strong>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.storageOptions.map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedStorage(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedStorage === st
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights & Specs list */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                    Especificações Técnicas
                  </h4>
                  <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200/60">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium text-gray-500">{key}:</span>
                        <span className="font-semibold text-gray-900 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bar: Quantity & Add Button */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-gray-200 rounded-full p-1 bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-full bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center shadow-2xs transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-xs text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-7 h-7 rounded-full bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center shadow-2xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  id="btn-modal-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3 px-6 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar à Sacola • {formatCurrency(product.price * quantity)}</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 pt-1 text-center">
                <span className="flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" /> Frete Rápido Brasil
                </span>
                <span className="flex items-center justify-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#0066CC]" /> Compra 100% Segura
                </span>
              </div>

              {/* Administrative Management Actions (Edit & Delete) */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Administração
                </span>

                <div className="flex items-center gap-2">
                  {onEditProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditProduct(product);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                      <span>Editar Produto</span>
                    </button>
                  )}

                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={async () => {
                          setIsDeleting(true);
                          try {
                            const res = await deleteProduct(product.id);
                            if (res.success) {
                              showToast(`"${product.name}" excluído com sucesso!`, 'info');
                              if (onDeleteProduct) onDeleteProduct(product.id);
                              onClose();
                            }
                          } catch (err) {
                            showToast('Erro ao excluir produto.', 'error');
                          } finally {
                            setIsDeleting(false);
                            setIsConfirmingDelete(false);
                          }
                        }}
                        disabled={isDeleting}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        <span>Confirmar?</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingDelete(false)}
                        className="px-2 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(true)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-100/60 text-red-600 font-semibold text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      <span>Excluir</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
