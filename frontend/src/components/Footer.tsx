import React from 'react';
import { Shield, Truck, RotateCcw, Lock, CheckCircle2, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onSelectCategory?: (category: string) => void;
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigateToAdmin }) => {
  return (
    <footer id="main-footer" className="bg-[#F5F5F7] text-gray-500 text-xs border-t border-gray-200/80 pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-gray-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-[#0066CC] flex-shrink-0 shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Frete Expresso Grátis</p>
              <p className="text-[11px] text-gray-500">Em compras acima de R$ 500</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-2xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Garantia Oficial de 1 Ano</p>
              <p className="text-[11px] text-gray-500">Com nota fiscal e suporte</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-amber-600 flex-shrink-0 shadow-2xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Devolução Descomplicada</p>
              <p className="text-[11px] text-gray-500">Até 14 dias após recebimento</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-purple-600 flex-shrink-0 shadow-2xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Pagamento 100% Seguro</p>
              <p className="text-[11px] text-gray-500">Pix com 10% OFF, Cartão ou Pay</p>
            </div>
          </div>
        </div>

        {/* Footnotes & Legal Fine Print */}
        <div className="py-8 space-y-2 text-[11px] text-gray-500 leading-relaxed border-b border-gray-200/80">
          <p>
            * Valores expressos em reais (BRL). Parcelamento em até 12 vezes sem juros nos cartões de crédito elegíveis. Desconto de 10% válido para pagamentos à vista via Pix.
          </p>
          <div className="flex items-center gap-2 pt-2 text-[#0066CC]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Conectado à API REST: mega-ecommerce-fullstack.onrender.com/api</span>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="py-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-8">
          <div>
            <h4 className="font-bold text-gray-900 text-xs mb-3">Nichos do Catálogo</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => onSelectCategory?.('Eletrônicos & Tech')} className="hover:text-gray-900 transition-colors">Eletrônicos & Tech</button></li>
              <li><button onClick={() => onSelectCategory?.('Moda & Vestuário')} className="hover:text-gray-900 transition-colors">Moda & Vestuário</button></li>
              <li><button onClick={() => onSelectCategory?.('Casa & Decoração')} className="hover:text-gray-900 transition-colors">Casa & Decoração</button></li>
              <li><button onClick={() => onSelectCategory?.('Beleza & Cuidados')} className="hover:text-gray-900 transition-colors">Beleza & Cuidados</button></li>
              <li><button onClick={() => onSelectCategory?.('Esportes & Fitness')} className="hover:text-gray-900 transition-colors">Esportes & Fitness</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-xs mb-3">Gestão & Admin</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={onNavigateToAdmin} className="hover:text-gray-900 transition-colors text-[#0066CC] font-semibold">+ Cadastrar Produtos</button></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">Inventário em Tempo Real</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">API REST Swagger</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">Controle de Estoque</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-xs mb-3">Conta & Pedidos</h4>
            <ul className="space-y-2 text-[11px]">
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">Meus Pedidos</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">Rastreamento de Envio</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">Sacola de Compras</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">Central de Ajuda</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-xs mb-3">Valores & Compromisso</h4>
            <ul className="space-y-2 text-[11px]">
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">Sustentabilidade & Carbon Neutral</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">Privacidade de Dados</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">Materiais Reciclados</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer transition-colors">Código de Ética</span></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-bold text-gray-900 text-xs mb-3">Sobre a E-commerce</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Plataforma de comércio eletrônico multinicho e multimarcas projetada com a filosofia e precisão visual Apple Light Clean.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>
            Copyright © {new Date().getFullYear()} E-commerce Inc. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer">Termos de Uso</span>
            <span>|</span>
            <span className="hover:text-gray-900 cursor-pointer">Privacidade</span>
            <span>|</span>
            <span className="hover:text-gray-900 cursor-pointer">Vendas e Reembolsos</span>
            <span>|</span>
            <span className="hover:text-gray-900 cursor-pointer">Brasil (Português)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
