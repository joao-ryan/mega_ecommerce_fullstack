import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency, formatInstallments } from '../lib/formatters';
import { 
  Sparkles, 
  ShoppingBag, 
  ChevronRight, 
  Check, 
  Eye, 
  ShieldCheck, 
  Cpu, 
  Layers 
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ product, onOpenDetail }) => {
  const { addToCart } = useCart();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeColor = product.colors?.[selectedColorIndex] || { name: 'Titânio Espacial', hex: '#8E8E93' };

  return (
    <section 
      id="hero-keynote" 
      className="relative overflow-hidden bg-black pt-8 pb-16 md:pt-14 md:pb-24 border-b border-white/10"
    >
      {/* Subtle Apple Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] bg-gradient-to-tr from-[#0071E3]/15 via-[#2997FF]/10 to-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tagline */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md mb-4 shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2997FF]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-white/90">
              {product.tag || 'Lançamento Exclusivo'}
            </span>
          </motion.div>

          {/* Keynote Cinematic Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-gray-400">
              {product.name}
            </span>
          </motion.h1>

          {/* Subtitle / Promise */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl font-normal leading-relaxed tracking-tight"
          >
            {product.description}
          </motion.p>

          {/* Pricing & Installments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-5 flex flex-col sm:flex-row items-center gap-2 text-center"
          >
            <span className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              A partir de {formatCurrency(product.price)}
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="text-xs sm:text-sm text-white/60">
              {formatInstallments(product.price)}
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              id="hero-buy-button"
              onClick={() => addToCart(product, 1, activeColor.name)}
              className="group relative flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-sm font-semibold shadow-xl shadow-[#0071E3]/30 active:scale-95 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Comprar Agora</span>
            </button>

            <button
              id="hero-details-button"
              onClick={() => onOpenDetail(product)}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white text-sm font-medium border border-white/15 backdrop-blur-md active:scale-95 transition-all duration-200"
            >
              <Eye className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              <span>Saiba Mais</span>
              <ChevronRight className="w-4 h-4 text-white/50 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
            </button>
          </motion.div>

          {/* Color Switcher Swatches */}
          {product.colors && product.colors.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-center gap-3 bg-white/[0.04] px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
            >
              <span className="text-xs text-white/50">Acabamento:</span>
              <span className="text-xs text-white font-medium">{activeColor.name}</span>
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    id={`hero-color-${index}`}
                    onClick={() => setSelectedColorIndex(index)}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                      selectedColorIndex === index
                        ? 'border-[#0071E3] scale-125 shadow-md shadow-[#0071E3]/40'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Cor ${color.name}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Cinematic Visual Stage Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/[0.08] to-black/80 backdrop-blur-xl shadow-2xl p-4 sm:p-8 flex items-center justify-center min-h-[380px] sm:min-h-[480px]">
            
            {/* Product Centerpiece */}
            <div className="relative z-10 w-full max-w-2xl flex items-center justify-center">
              <motion.img
                src={product.image_url}
                alt={product.name}
                referrerPolicy="no-referrer"
                animate={{
                  scale: isHovered ? 1.04 : 1,
                  y: isHovered ? -6 : 0,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-h-[420px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] filter brightness-105"
              />
            </div>

            {/* Floating Glass Badges */}
            <div className="absolute top-6 left-6 hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-white shadow-xl">
              <Cpu className="w-4 h-4 text-[#2997FF]" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Arquitetura</span>
                <span className="text-xs font-semibold">Dual-Chip Apple M2 + R1</span>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 text-white shadow-xl">
              <Layers className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Displays</span>
                <span className="text-xs font-semibold">Micro-OLED 4K por olho</span>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Garantia Oficial Apple de 12 Meses</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights Ticker */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { title: 'Computação Espacial', subtitle: 'Interface intuitiva por olhar e gestos' },
            { title: 'Áudio Espacial 3D', subtitle: 'Calibração acústica personalizada' },
            { title: 'Bateria Removível', subtitle: 'Design ergonômico ultraleve' },
            { title: 'visionOS Nativo', subtitle: 'Centenas de apps espaciais otimizados' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col text-left"
            >
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2997FF]" />
                {item.title}
              </h4>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">{item.subtitle}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
