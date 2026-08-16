import React, { useState, useRef, useEffect } from 'react';
import { Product, ProductFormData, NicheCategory } from '../types';
import { createProduct, updateProduct, deleteProduct, getProducts, getLocalCustomProducts } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../lib/formatters';
import {
  PlusCircle,
  Image as ImageIcon,
  Package,
  Boxes,
  Upload,
  Link as LinkIcon,
  Trash2,
  Check,
  Edit3,
  Search,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  ArrowLeft,
  RefreshCw,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminProductCreateProps {
  onBackToStore: () => void;
  onProductCreated?: (product: Product) => void;
  onProductUpdated?: (product: Product) => void;
  onProductDeleted?: (id: string | number) => void;
  initialEditProduct?: Product | null;
}

const NICHE_OPTIONS: { label: NicheCategory; icon: string }[] = [
  { label: 'Eletrônicos & Tech', icon: '⚡' },
  { label: 'Moda & Vestuário', icon: '👔' },
  { label: 'Casa & Decoração', icon: '🪴' },
  { label: 'Beleza & Cuidados', icon: '✨' },
  { label: 'Esportes & Fitness', icon: '🏃' },
];

export const AdminProductCreate: React.FC<AdminProductCreateProps> = ({
  onBackToStore,
  onProductCreated,
  onProductUpdated,
  onProductDeleted,
  initialEditProduct = null
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);
  
  // Products Management State
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('Todos');

  // Form & Edit State
  const [editingProduct, setEditingProduct] = useState<Product | null>(initialEditProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'Eletrônicos & Tech',
    price: '',
    stock: 10,
    image_url: '',
    description: '',
    brand: '',
    tag: '',
    isFeatured: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  // Fetch all current products
  const fetchProductsList = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await getProducts();
      setProductsList(data);
    } catch (err) {
      console.warn('Failed to load products list', err);
      setProductsList(getLocalCustomProducts());
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  // When initialEditProduct changes
  useEffect(() => {
    if (initialEditProduct) {
      loadProductIntoForm(initialEditProduct);
    }
  }, [initialEditProduct]);

  // Load a product into the editing form
  const loadProductIntoForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: (product.category as NicheCategory) || 'Eletrônicos & Tech',
      price: product.price,
      stock: product.stock,
      image_url: product.image_url || '',
      description: product.description || '',
      brand: product.brand || '',
      tag: product.tag || '',
      isFeatured: product.isFeatured || false
    });

    if (product.image_url?.startsWith('data:image/')) {
      setImageMode('upload');
      setUploadedFileName('Imagem salva anteriormente');
    } else if (product.image_url) {
      setImageMode('url');
      setUploadedFileName(null);
    }

    setErrors({});
    setImageLoadError(false);

    // Smooth scroll to form
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Cancel edit and reset form
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Eletrônicos & Tech',
      price: '',
      stock: 10,
      image_url: '',
      description: '',
      brand: '',
      tag: '',
      isFeatured: false
    });
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setErrors({});
    setImageLoadError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle File Upload to Base64 Data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP, etc).', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('O tamanho da imagem não pode ultrapassar 8MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormData(prev => ({ ...prev, image_url: result }));
        setUploadedFileName(file.name);
        setUploadedFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
        setImageLoadError(false);
        if (errors.image_url) {
          setErrors(prev => ({ ...prev, image_url: undefined }));
        }
        showToast('Imagem carregada com sucesso!', 'success');
      }
    };
    reader.onerror = () => {
      showToast('Falha ao processar o arquivo de imagem.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setUploadedFileName(null);
    setUploadedFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'O nome do produto é obrigatório.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'O nome deve ter pelo menos 2 caracteres.';
    }

    if (!formData.category) {
      newErrors.category = 'Selecione uma categoria válida.';
    }

    const numPrice = typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price;
    if (!formData.price || isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Informe um preço válido maior que zero.';
    }

    const numStock = typeof formData.stock === 'string' ? parseInt(formData.stock, 10) : formData.stock;
    if (formData.stock === '' || isNaN(numStock) || numStock < 0) {
      newErrors.stock = 'Informe uma quantidade válida em estoque.';
    }

    if (!formData.image_url || !formData.image_url.trim()) {
      newErrors.image_url = 'Adicione uma imagem via upload de arquivo ou link de foto.';
    } else if (imageMode === 'url' && !formData.image_url.startsWith('http://') && !formData.image_url.startsWith('https://') && !formData.image_url.startsWith('data:image/')) {
      newErrors.image_url = 'A URL deve iniciar com http:// ou https://';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'A descrição detalhada é obrigatória.';
    } else if (formData.description.trim().length < 5) {
      newErrors.description = 'A descrição deve conter no mínimo 5 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'image_url') {
      setImageLoadError(false);
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Por favor, verifique os campos obrigatórios antes de continuar.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingProduct) {
        // UPDATE MODE
        const response = await updateProduct(editingProduct.id, formData);
        if (response.success && response.product) {
          showToast(`Produto "${response.product.name}" atualizado com sucesso!`, 'success');
          
          // Update list
          setProductsList(prev => prev.map(p => String(p.id) === String(response.product.id) ? response.product : p));

          if (onProductUpdated) {
            onProductUpdated(response.product);
          }

          // Reset form to clean create mode
          handleCancelEdit();
        } else {
          showToast(response.message || 'Erro ao atualizar produto.', 'error');
        }
      } else {
        // CREATE MODE
        const response = await createProduct(formData);

        if (response.success && response.product) {
          showToast(`"${response.product.name}" cadastrado com sucesso!`, 'success');
          
          setProductsList(prev => [response.product, ...prev]);

          if (onProductCreated) {
            onProductCreated(response.product);
          }

          // Reset form to clean state
          handleCancelEdit();
        } else {
          showToast(response.message || 'Erro ao cadastrar produto.', 'error');
        }
      }
    } catch (error: any) {
      console.error('Error submitting product:', error);
      showToast('Falha na comunicação com o servidor.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation & Execution
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteProduct(productToDelete.id);
      if (response.success) {
        showToast(`"${productToDelete.name}" excluído com sucesso!`, 'info');
        
        // Remove from list
        setProductsList(prev => prev.filter(p => String(p.id) !== String(productToDelete.id)));

        // If currently editing this product, cancel edit
        if (editingProduct && String(editingProduct.id) === String(productToDelete.id)) {
          handleCancelEdit();
        }

        if (onProductDeleted) {
          onProductDeleted(productToDelete.id);
        }
      } else {
        showToast(response.message || 'Erro ao excluir produto.', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Falha ao excluir produto.', 'error');
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  // Filter products for the list table
  const filteredProducts = productsList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedFilterCategory === 'Todos' || p.category.toLowerCase() === selectedFilterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 pb-24 font-montserrat">
      {/* Top Breadcrumb & Header Bar */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="btn-admin-back-store"
              onClick={onBackToStore}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar à Loja</span>
            </button>
            <span className="text-gray-300">/</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Painel Administrativo & Gestão
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span className="hidden sm:inline">Conexão ativa com API REST</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Title Section */}
        <div ref={formTopRef} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium mb-2 border border-gray-200/60">
              <Boxes className="w-3.5 h-3.5" />
              <span>Gestão Completa de Produtos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h1>
            <p className="text-xs sm:text-sm font-normal text-gray-500 mt-1 max-w-2xl">
              {editingProduct
                ? `Editando os dados e fotos de "${editingProduct.name}". As alterações serão salvas no banco de dados e sincronizadas na vitrine.`
                : 'Cadastre, edite fotos, altere preços, gerencie estoque e remova produtos da sua loja com integração REST.'}
            </p>
          </div>

          {editingProduct && (
            <button
              onClick={handleCancelEdit}
              className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancelar Edição</span>
            </button>
          )}
        </div>

        {/* Form & Live Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <form
              id="admin-product-form"
              onSubmit={handleSubmit}
              className={`bg-white rounded-2xl border shadow-sm p-6 sm:p-8 space-y-6 transition-all ${
                editingProduct ? 'border-black/30 ring-1 ring-black/5' : 'border-gray-200/80'
              }`}
            >
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                    {editingProduct ? (
                      <>
                        <Edit3 className="w-4 h-4 text-black" />
                        <span>Formulário de Edição</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 text-black" />
                        <span>Dados do Produto</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-gray-500 font-normal mt-0.5">
                    {editingProduct
                      ? 'Altere os campos necessários e clique em Salvar Alterações.'
                      : 'Preencha as informações para registrar o item no banco de dados.'}
                  </p>
                </div>

                {editingProduct && (
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black text-white uppercase tracking-wider">
                    Modo Edição
                  </span>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                  Nome do Produto <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-product-name"
                  type="text"
                  placeholder="Ex: Tênis Couro Premium Branco"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500 bg-red-50/20' : 'border-gray-200'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Niche Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Categoria (Nicho) <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="select-product-category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F9FAFB] border text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                      errors.category ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    {NICHE_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.icon} {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Marca / Fabricante (Opcional)
                  </label>
                  <input
                    id="input-product-brand"
                    type="text"
                    placeholder="Ex: Marca própria, Fabricante..."
                    value={formData.brand || ''}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Preço (R$) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      R$
                    </span>
                    <input
                      id="input-product-price"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFB] border text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                        errors.price ? 'border-red-500 bg-red-50/20' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Estoque Disponível <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-product-stock"
                    type="number"
                    min="0"
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border text-xs sm:text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                      errors.stock ? 'border-red-500 bg-red-50/20' : 'border-gray-200'
                    }`}
                  />
                  {errors.stock && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.stock}
                    </p>
                  )}
                </div>
              </div>

              {/* IMAGE SELECTION SYSTEM: Upload vs URL */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-gray-700" />
                    Imagem do Produto <span className="text-red-500">*</span>
                  </label>

                  {/* Mode Switcher Pills */}
                  <div className="flex items-center p-0.5 rounded-xl bg-gray-100 border border-gray-200/80">
                    <button
                      type="button"
                      onClick={() => {
                        setImageMode('upload');
                        if (errors.image_url) setErrors(prev => ({ ...prev, image_url: undefined }));
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        imageMode === 'upload'
                          ? 'bg-white text-gray-900 shadow-2xs font-semibold'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload de Foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageMode('url');
                        if (errors.image_url) setErrors(prev => ({ ...prev, image_url: undefined }));
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        imageMode === 'url'
                          ? 'bg-white text-gray-900 shadow-2xs font-semibold'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Link URL</span>
                    </button>
                  </div>
                </div>

                {/* Option 1: File Upload (Drag & Drop or Click) */}
                {imageMode === 'upload' ? (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="input-file-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {formData.image_url && formData.image_url.startsWith('data:image/') ? (
                      /* File Selected State */
                      <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={formData.image_url}
                            alt="Imagem selecionada"
                            className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-emerald-200"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {uploadedFileName || 'Foto carregada'}
                            </p>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              Imagem pronta {uploadedFileSize ? `(${uploadedFileSize})` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors"
                          >
                            Trocar
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remover imagem"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Drag and Drop Zone */
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                          isDragging
                            ? 'border-black bg-gray-50 scale-[1.01]'
                            : 'border-gray-200/80 bg-[#F9FAFB] hover:bg-gray-100/70 hover:border-gray-300'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-white text-gray-700 flex items-center justify-center mx-auto mb-3 shadow-2xs border border-gray-200/60">
                          <Upload className="w-5 h-5 text-gray-700" />
                        </div>
                        <p className="text-xs font-semibold text-gray-900">
                          Clique para selecionar ou arraste uma foto aqui
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          Suporta arquivos JPG, PNG, WebP e GIF (máx. 8MB)
                        </p>
                        <button
                          type="button"
                          className="mt-3 px-4 py-1.5 rounded-xl bg-black text-white text-xs font-medium hover:bg-gray-800 transition-colors shadow-2xs"
                        >
                          Selecionar do Dispositivo
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Option 2: Image URL Direct Input */
                  <div className="space-y-2">
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-product-image-url"
                        type="url"
                        placeholder="https://exemplo.com/imagem-do-produto.jpg"
                        value={formData.image_url.startsWith('data:image/') ? '' : formData.image_url}
                        onChange={(e) => handleInputChange('image_url', e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F9FAFB] border text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                          errors.image_url ? 'border-red-500 bg-red-50/20' : 'border-gray-200'
                        }`}
                      />
                      {formData.image_url && !formData.image_url.startsWith('data:image/') && (
                        <button
                          type="button"
                          onClick={() => handleInputChange('image_url', '')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Cole o link direto da imagem hospedada (ex: Unsplash, Cloudinary, AWS S3).
                    </p>
                  </div>
                )}

                {errors.image_url && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.image_url}
                  </p>
                )}
              </div>

              {/* Tag & Featured Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                    Tag Promocional / Destaque (Opcional)
                  </label>
                  <input
                    id="input-product-tag"
                    type="text"
                    placeholder="Ex: Novo, 10% OFF, Exclusivo"
                    value={formData.tag || ''}
                    onChange={(e) => handleInputChange('tag', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>

                <div className="pt-4 sm:pt-0 flex items-center">
                  <label className="relative flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured || false}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
                    />
                    <div>
                      <span className="text-xs font-semibold text-gray-900">
                        Destacar na Vitrine
                      </span>
                      <p className="text-[11px] text-gray-500">
                        Exibir com selo de destaque no catálogo
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-900">
                    Descrição do Produto <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {formData.description.length} caracteres
                  </span>
                </div>
                <textarea
                  id="textarea-product-description"
                  rows={4}
                  placeholder="Descreva detalhes, materiais, especificações e diferenciais do produto..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full p-3.5 rounded-xl bg-[#F9FAFB] border text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                    errors.description ? 'border-red-500 bg-red-50/20' : 'border-gray-200'
                  }`}
                />
                {errors.description && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </p>
                )}
              </div>

              {/* Submit / Save Button */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {editingProduct ? 'Sincronização via PUT /products/:id' : 'Sincronização via POST /products'}
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full sm:w-auto px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  )}

                  <button
                    id="btn-submit-product"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-black hover:bg-gray-800 text-white font-medium text-xs sm:text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{editingProduct ? 'Salvando Alterações...' : 'Cadastrando Produto...'}</span>
                      </>
                    ) : (
                      <>
                        {editingProduct ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                        <span>{editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Live Card Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-700" />
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Pré-visualização em Tempo Real
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                  Card da Loja
                </span>
              </div>

              {/* Simulated Product Card */}
              <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
                {/* Photo Aspect Ratio Box */}
                <div className="relative aspect-square bg-[#F9FAFB] flex items-center justify-center overflow-hidden p-6">
                  {formData.tag && (
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black text-white shadow-2xs">
                      {formData.tag}
                    </span>
                  )}

                  {formData.isFeatured && (
                    <span className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black text-white shadow-2xs">
                      ★ Destaque
                    </span>
                  )}

                  {formData.image_url && !imageLoadError ? (
                    <img
                      src={formData.image_url}
                      alt={formData.name || 'Preview do Produto'}
                      referrerPolicy="no-referrer"
                      onError={() => setImageLoadError(true)}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 text-center p-6 space-y-2">
                      <ImageIcon className="w-12 h-12 stroke-1 text-gray-300" />
                      <p className="text-xs font-semibold text-gray-700">Nenhuma imagem carregada</p>
                      <p className="text-[11px] text-gray-400 max-w-[200px]">
                        Faça upload de uma foto ou insira um link URL
                      </p>
                    </div>
                  )}
                </div>

                {/* Details Body */}
                <div className="p-5 bg-white space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                      {formData.category}
                    </span>
                    {formData.brand && (
                      <span className="text-[11px] text-gray-400 font-normal">
                        {formData.brand}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-gray-900 tracking-tight leading-snug line-clamp-2">
                    {formData.name || 'Nome do Produto'}
                  </h4>

                  <p className="text-xs font-normal text-gray-500 line-clamp-2 leading-relaxed">
                    {formData.description || 'A descrição detalhada inserida no formulário aparecerá neste espaço com a tipografia Montserrat.'}
                  </p>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-gray-900 font-mono tracking-tight">
                        {formData.price
                          ? formatCurrency(typeof formData.price === 'string' ? parseFloat(formData.price) || 0 : formData.price)
                          : 'R$ 0,00'}
                      </p>
                    </div>

                    <div className="px-3.5 py-2 rounded-xl bg-black text-white text-xs font-medium">
                      + Adicionar
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400 border-t border-gray-50">
                    <span>Estoque: <strong>{formData.stock || 0} unid.</strong></span>
                    <span>Classificação: ★ 5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: FULL PRODUCTS LIST & MANAGEMENT TABLE (EDIT / DELETE) */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-black" />
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  Produtos no Catálogo ({productsList.length})
                </h3>
              </div>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Gerencie todos os itens disponíveis. Clique em <strong>Editar</strong> para carregar no formulário ou em <strong>Excluir</strong> para remover.
              </p>
            </div>

            {/* Quick Refresh Button */}
            <button
              onClick={fetchProductsList}
              disabled={isLoadingProducts}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? 'animate-spin' : ''}`} />
              <span>Atualizar Lista</span>
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome, marca ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F9FAFB] border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="sm:col-span-4">
              <select
                value={selectedFilterCategory}
                onChange={(e) => setSelectedFilterCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F9FAFB] border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              >
                <option value="Todos">Todas as Categorias</option>
                {NICHE_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products List Table / Cards */}
          {isLoadingProducts ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-black" />
              <p className="text-xs text-gray-500 font-medium">Carregando catálogo de produtos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-3 p-6">
              <Package className="w-10 h-10 text-gray-300 stroke-1 mx-auto" />
              <p className="text-sm font-semibold text-gray-800">Nenhum produto encontrado</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {searchTerm || selectedFilterCategory !== 'Todos'
                  ? 'Nenhum item corresponde ao filtro ou termo de busca aplicado.'
                  : 'Nenhum produto cadastrado ainda. Use o formulário acima para adicionar o primeiro item!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-3">Produto</th>
                    <th className="py-3 px-3">Categoria</th>
                    <th className="py-3 px-3">Preço</th>
                    <th className="py-3 px-3">Estoque</th>
                    <th className="py-3 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredProducts.map((prod) => (
                    <tr
                      key={prod.id}
                      className={`hover:bg-gray-50/80 transition-colors ${
                        editingProduct && String(editingProduct.id) === String(prod.id)
                          ? 'bg-amber-50/40 font-medium'
                          : ''
                      }`}
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200/80 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {prod.image_url ? (
                              <img
                                src={prod.image_url}
                                alt={prod.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-gray-900 truncate">
                              {prod.name}
                            </p>
                            {prod.brand && (
                              <p className="text-[11px] text-gray-400 truncate">
                                {prod.brand}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200/60">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 font-mono font-bold text-gray-900">
                        {formatCurrency(prod.price)}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            prod.stock > 5
                              ? 'text-emerald-700 bg-emerald-50'
                              : prod.stock > 0
                              ? 'text-amber-700 bg-amber-50'
                              : 'text-red-700 bg-red-50'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              prod.stock > 5
                                ? 'bg-emerald-500'
                                : prod.stock > 0
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                          />
                          {prod.stock} un
                        </span>
                      </td>

                      {/* Action Buttons: Edit & Delete */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-edit-product-${prod.id}`}
                            onClick={() => loadProductIntoForm(prod)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition-colors"
                            title="Editar este produto"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-gray-700" />
                            <span className="hidden sm:inline">Editar</span>
                          </button>

                          <button
                            id={`btn-delete-product-${prod.id}`}
                            onClick={() => setProductToDelete(prod)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold shadow-2xs transition-colors"
                            title="Excluir este produto"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span className="hidden sm:inline">Excluir</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-6 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Confirmar Exclusão
                  </h3>
                  <p className="text-xs text-gray-500">
                    Esta ação removerá o produto permanentemente do catálogo.
                  </p>
                </div>
              </div>

              {/* Product preview box */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200/80">
                {productToDelete.image_url ? (
                  <img
                    src={productToDelete.image_url}
                    alt={productToDelete.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border border-gray-200 text-gray-400">
                    <Package className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {productToDelete.name}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {productToDelete.category} • {formatCurrency(productToDelete.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Excluindo...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Sim, Excluir Produto</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
