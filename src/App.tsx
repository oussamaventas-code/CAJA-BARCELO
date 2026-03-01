/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Printer, Trash2, Scissors, Sparkles, CreditCard, Banknote, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Transaction {
  id: string;
  clientName: string;
  service: string;
  price: number;
  paymentMethod: string;
  timestamp: Date;
}

const SERVICES = [
  { name: 'Corte de Cabello', defaultPrice: 25 },
  { name: 'Manicura', defaultPrice: 35 },
  { name: 'Corte y Secado', defaultPrice: 50 },
  { name: 'Depilación Cejas', defaultPrice: 12 },
  { name: 'Pedicura', defaultPrice: 40 },
  { name: 'Tinte', defaultPrice: 60 },
];

const PAYMENT_METHODS = ['Efectivo', 'Tarjeta', 'Transferencia'];

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clientName, setClientName] = useState('');
  const [employeeName, setEmployeeName] = useState('Admin');
  const [service, setService] = useState(SERVICES[0].name);
  const [price, setPrice] = useState<string>(SERVICES[0].defaultPrice.toString());
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [transactionToPrint, setTransactionToPrint] = useState<Transaction | null>(null);
  const [lastPrintedTicket, setLastPrintedTicket] = useState<Transaction | null>(null);

  const totalToday = useMemo(() => 
    transactions.reduce((sum, t) => sum + t.price, 0),
    [transactions]
  );

  const salesCount = transactions.length;

  const handleFinalizeSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || isNaN(parseFloat(price))) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: clientName || 'Cliente Genérico',
      service,
      price: parseFloat(price),
      paymentMethod,
      timestamp: new Date(),
    };

    setTransactions([newTransaction, ...transactions]);
    
    // Reset form
    setClientName('');
    setService(SERVICES[0].name);
    setPrice(SERVICES[0].defaultPrice.toString());
    setPaymentMethod(PAYMENT_METHODS[0]);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedService = e.target.value;
    setService(selectedService);
    const found = SERVICES.find(s => s.name === selectedService);
    if (found) {
      setPrice(found.defaultPrice.toString());
    }
  };

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que deseas cerrar la caja y limpiar todas las transacciones de hoy?')) {
      setTransactions([]);
    }
  };

  const handlePrint = (t: Transaction) => {
    setTransactionToPrint(t);
  };

  const confirmPrint = () => {
    if (transactionToPrint) {
      setLastPrintedTicket(transactionToPrint);
      setTransactionToPrint(null);
      
      // Pequeño delay para asegurar que el contenido del ticket se renderice en el área de impresión
      setTimeout(() => {
        window.print();
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800">
      {/* Área de Impresión (Solo visible al imprimir) */}
      <div className="hidden print:block bg-white p-8 text-black font-mono text-[12pt] leading-tight w-[80mm] mx-auto">
        {lastPrintedTicket && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xl font-bold">✨ ESTÉTICA GLAMOUR ✨</p>
              <p>---------------------------------</p>
            </div>
            
            <div className="space-y-1">
              <p>Fecha: {lastPrintedTicket.timestamp.toLocaleDateString('es-ES')}   Hora: {lastPrintedTicket.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
              <p>Cliente: {lastPrintedTicket.clientName}</p>
              <p>Atendido por: {employeeName}</p>
            </div>
            
            <p>---------------------------------</p>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>SERVICIO</span>
                <span>PRECIO</span>
              </div>
              <p>---------------------------------</p>
              <div className="flex justify-between">
                <span>{lastPrintedTicket.service}</span>
                <span>${lastPrintedTicket.price.toFixed(2)}</span>
              </div>
            </div>
            
            <p>---------------------------------</p>
            
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>${lastPrintedTicket.price.toFixed(2)}</span>
              </div>
              <p>Método de Pago: {lastPrintedTicket.paymentMethod}</p>
            </div>
            
            <p>---------------------------------</p>
            
            <div className="text-center space-y-1">
              <p>¡Gracias por tu confianza!</p>
              <p>Síguenos en IG: @tu_estetica</p>
              <p className="font-bold">CONSERVE ESTE COMPROBANTE</p>
            </div>
          </div>
        )}
      </div>

      {/* Aplicación Principal (Oculta al imprimir) */}
      <div className="print:hidden p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-semibold text-slate-900 flex items-center justify-center gap-2">
            <Sparkles className="text-[#D14D72]" />
            Caja Rápida Estética
          </h1>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl border border-[#F2E5E5] shadow-sm">
          <div className="text-center md:border-r border-[#F2E5E5] space-y-2">
            <p className="text-slate-500 font-medium uppercase tracking-wider text-sm">Total de Hoy:</p>
            <p className="text-5xl font-bold text-[#D14D72] tracking-tight">
              ${totalToday.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-slate-500 font-medium uppercase tracking-wider text-sm">Ventas Realizadas:</p>
            <p className="text-5xl font-bold text-[#D14D72] tracking-tight">{salesCount}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* New Sale Form */}
          <section className="bg-white rounded-2xl border border-[#F2E5E5] shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#F8F9FA] p-4 border-bottom border-[#F2E5E5]">
              <h2 className="text-xl font-semibold text-slate-700">Nueva Venta</h2>
            </div>
            <form onSubmit={handleFinalizeSale} className="p-6 space-y-6 flex-grow">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <User size={16} /> Nombre del Cliente
                </label>
                <input
                  type="text"
                  placeholder="Nombre del Cliente"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D14D72]/20 focus:border-[#D14D72] transition-all"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <User size={16} className="text-slate-400" /> Atendido por
                </label>
                <input
                  type="text"
                  placeholder="Nombre del Empleado"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D14D72]/20 focus:border-[#D14D72] transition-all"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Scissors size={16} /> Servicio
                </label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D14D72]/20 focus:border-[#D14D72] transition-all appearance-none bg-white"
                  value={service}
                  onChange={handleServiceChange}
                >
                  {SERVICES.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Banknote size={16} /> Precio
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full p-3 pl-8 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D14D72]/20 focus:border-[#D14D72] transition-all"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <CreditCard size={16} /> Método de Pago
                </label>
                <select
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D14D72]/20 focus:border-[#D14D72] transition-all appearance-none bg-white"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#D14D72] hover:bg-[#B13D5E] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#D14D72]/20 uppercase tracking-widest mt-4"
              >
                Finalizar Venta
              </button>
            </form>
          </section>

          {/* Daily Transactions */}
          <section className="bg-white rounded-2xl border border-[#F2E5E5] shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#F8F9FA] p-4 border-bottom border-[#F2E5E5]">
              <h2 className="text-xl font-semibold text-slate-700">Transacciones del Día</h2>
            </div>
            
            <div className="flex-grow overflow-y-auto max-h-[500px] p-2">
              <AnimatePresence initial={false}>
                {transactions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 space-y-2">
                    <Sparkles size={48} className="opacity-20" />
                    <p>No hay transacciones registradas hoy</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-slate-800">{t.service}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <User size={12} /> {t.clientName} • {t.paymentMethod}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-[#D14D72]">
                            ${t.price.toFixed(2)}
                          </p>
                          <button
                            onClick={() => handlePrint(t)}
                            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:border-[#D14D72] hover:text-[#D14D72] transition-all flex items-center gap-2 text-sm font-medium"
                          >
                            <Printer size={16} />
                            <span className="hidden sm:inline">Imprimir Ticket</span>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-6 border-t border-[#F2E5E5]">
              <button
                onClick={handleClearAll}
                className="w-full py-3 border-2 border-[#D14D72] text-[#D14D72] hover:bg-[#D14D72] hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Cerrar Caja y Limpiar
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Modal de Confirmación de Impresión */}
      <AnimatePresence>
        {transactionToPrint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTransactionToPrint(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="bg-[#F8F9FA] p-4 border-b border-[#F2E5E5] flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Printer size={18} className="text-[#D14D72]" />
                  Confirmar Impresión
                </h3>
                <button 
                  onClick={() => setTransactionToPrint(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Cliente:</span>
                    <span className="font-medium text-slate-800">{transactionToPrint.clientName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Servicio:</span>
                    <span className="font-medium text-slate-800">{transactionToPrint.service}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Método:</span>
                    <span className="font-medium text-slate-800">{transactionToPrint.paymentMethod}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-slate-500 font-semibold">Total:</span>
                    <span className="text-xl font-bold text-[#D14D72]">
                      ${transactionToPrint.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setTransactionToPrint(null)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmPrint}
                    className="flex-1 py-3 bg-[#D14D72] text-white font-semibold rounded-xl hover:bg-[#B13D5E] transition-colors shadow-lg shadow-[#D14D72]/20"
                  >
                    Imprimir
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
}
