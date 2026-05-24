"use client";

import type { BudgetPayment, BudgetPaymentStatus } from "@/types/budget";

import { getStoredVendors, upsertStoredVendor } from "./vendors-store";

const STORAGE_KEY = "casarei:vendor-finance-payments";

export type VendorFinancePaymentInput = {
  vendorId: string;
  supplier: string;
  category: string;
  amount: number;
  dueDate: string;
  method: string;
  status?: BudgetPaymentStatus;
  note?: string;
};

export function getVendorFinancePayments(): BudgetPayment[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveVendorFinancePayment(input: VendorFinancePaymentInput) {
  const payment: BudgetPayment = {
    id: `vendor-payment-${input.vendorId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    supplier: input.supplier,
    category: input.category,
    amount: input.amount,
    dueDate: input.dueDate,
    month: monthName(input.dueDate),
    status: input.status ?? "pendente",
    method: input.method,
    source: "fornecedor",
    vendorId: input.vendorId
  };

  const current = getVendorFinancePayments();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([payment, ...current]));
  window.dispatchEvent(new CustomEvent("casarei:vendor-payment-created", { detail: payment }));
  return payment;
}

export function updateVendorFinancePaymentStatus(paymentId: string, status: BudgetPaymentStatus) {
  const current = getVendorFinancePayments();
  const next = current.map((payment) => (payment.id === paymentId ? { ...payment, status } : payment));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  syncStoredVendorPaymentStatus(paymentId, status);
  window.dispatchEvent(new CustomEvent("casarei:vendor-payment-created"));
}

export function getVendorFinancePaymentsByVendor(vendorId: string) {
  return getVendorFinancePayments().filter((payment) => payment.vendorId === vendorId);
}

export function subscribeVendorFinancePayments(callback: () => void) {
  window.addEventListener("casarei:vendor-payment-created", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("casarei:vendor-payment-created", callback);
    window.removeEventListener("storage", callback);
  };
}

function monthName(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return "A definir";

  return new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(parsed).replace(/^./, (letter) => letter.toUpperCase());
}

function syncStoredVendorPaymentStatus(paymentId: string, status: BudgetPaymentStatus) {
  const vendor = getStoredVendors().find((item) => item.payments.some((payment) => payment.id === paymentId));
  if (!vendor) return;

  const payments = vendor.payments.map((payment) => (payment.id === paymentId ? { ...payment, status } : payment));
  const paidValue = payments.filter((payment) => payment.status === "pago").reduce((sum, payment) => sum + payment.amount, 0);
  const nextPayment = payments.find((payment) => payment.status !== "pago");

  upsertStoredVendor({
    ...vendor,
    payments,
    paidValue,
    nextPayment: nextPayment ? `${formatMoney(nextPayment.amount)} em ${formatDate(nextPayment.dueDate)}` : "Tudo pago"
  });
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(parsed);
}
