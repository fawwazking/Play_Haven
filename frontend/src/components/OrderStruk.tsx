import React, { useMemo, useState } from "react";
import QRCode from "qrcode";

export interface OrderItem {
  game_title: string;
  platform: string;
  condition: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}
export interface OrderSnapshot {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  regionLabel?: string;
  recipientName?: string;
  courier?: string;
  createdAt?: string;
}

export function readLastOrder(): OrderSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("playhaven_last_order");
    return raw ? (JSON.parse(raw) as OrderSnapshot) : null;
  } catch {
    return null;
  }
}

/** Minimal Code39-ish barcode (rendered as SVG bars from the order number). */
function OrderBarcode({ value }: { value: string }) {
  // Deterministic pseudo-random bars derived from the string, stable & decorative.
  const bars = useMemo(() => {
    const out: number[] = [];
    let h = 0;
    for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
    for (let i = 0; i < 64; i++) {
      h ^= h << 13; h >>>= 0;
      h ^= h >> 7; h >>>= 0;
      h ^= h << 17; h >>>= 0;
      out.push((h & 1) + (i % 2 === 0 ? 0 : 0)); // alternating width pattern
    }
    return out.map((b, i) => (b ? 2 + (i % 3) : 1));
  }, [value]);
  let x = 0;
  const barsSvg = bars.map((w, i) => {
    const el = <rect key={i} x={x} y={0} width={w} height={48} fill="#0f172a" />;
    x += w + 1;
    return el;
  });
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox={`0 0 ${x} 48`} preserveAspectRatio="none" className="h-10 w-full max-w-[260px]">
        {barsSvg}
      </svg>
      <span className="font-mono text-xs tracking-[0.3em] text-slate-600">{value}</span>
    </div>
  );
}

async function buildQrDataUrl(text: string): Promise<string> {
  const url = await QRCode.toDataURL(text, {
    margin: 1,
    width: 180,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
  return url;
}

export default function OrderStruk({ order, isPending }: { order: OrderSnapshot; isPending: boolean }) {
  const [qrSrc, setQrSrc] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [printed, setPrinted] = useState(false);

  const trackingUrl = `https://playhaven-store.vercel.app/order-success?order=${order.orderNumber}`;

  React.useEffect(() => {
    let cancelled = false;
    buildQrDataUrl(trackingUrl).then((u) => { if (!cancelled) setQrSrc(u); }).catch(() => {});
    return () => { cancelled = true; };
  }, [trackingUrl]);

  const fmt = (n: number) => n.toLocaleString("id-ID");
  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce((s, i) => s + Number(i.subtotal || 0), 0);
  const total = Number(order.total) || subtotal + Number(order.shippingCost || 0);

  const share = () => {
    const text = `Pesanan PlayHaven ${order.orderNumber} ${isPending ? "(menunggu bayar)" : "(lunas)"} • Total Rp ${fmt(total)}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };
  const copyNo = async () => {
    try { await navigator.clipboard.writeText(order.orderNumber); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div className="print:shadow-none print:border-0 rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden text-slate-800">
      {/* Header banner */}
      <div className={`p-6 sm:p-8 text-center text-white bg-gradient-to-r ${isPending ? "from-amber-500 to-orange-600" : "from-emerald-600 to-teal-600"}`}>
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md">
          {isPending ? (
            <span className="font-gaming text-2xl font-black">!</span>
          ) : (
            <span className="font-gaming text-2xl font-black">✓</span>
          )}
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-white backdrop-blur-md">
          {isPending ? "Menunggu Pembayaran" : "Pembayaran Berhasil Diverifikasi"}
        </span>
        <h1 className="mt-3 font-gaming text-2xl sm:text-3xl font-black">
          {isPending ? "Pesananmu Sudah Dibuat" : "Terima Kasih Atas Pesananmu!"}
        </h1>
        <p className="mx-auto mt-1 max-w-md text-xs text-white/80 sm:text-sm">
          {isPending
            ? "Selesaikan pembayaran lewat Midtrans Snap. Setelah terkonfirmasi, pesanan otomatis masuk QC & pengemasan."
            : "Kaset game fisik sedang disiapkan, dikemas aman dengan bubble wrap ganda, dan segera diserahkan ke kurir."}
        </p>
      </div>

      {/* Body */}
      <div className="space-y-6 p-6 sm:p-8">
        {/* Invoice line */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Nomor Faktur / Pesanan</span>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="font-gaming text-xl font-black tracking-wider text-slate-900">{order.orderNumber}</p>
              <button onClick={copyNo} className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100">
                {copied ? "Tersalin" : "Salin"}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${isPending ? "border-amber-200 bg-amber-100 text-amber-700" : "border-emerald-200 bg-emerald-100 text-emerald-700"}`}>
              {isPending ? "BELUM DIBAYAR" : "LUNAS (Midtrans Snap)"}
            </span>
            <button onClick={() => { window.print(); setPrinted(true); }} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
              Cetak
            </button>
          </div>
        </div>

        {/* Barcode */}
        <div className="border-y border-slate-100 py-4">
          <OrderBarcode value={order.orderNumber} />
        </div>

        {/* Itemizer */}
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Rincian Pesanan</h4>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Kaset Game</th>
                  <th className="px-3 py-2 text-right font-semibold">Jml</th>
                  <th className="px-3 py-2 text-right font-semibold">Harga</th>
                  <th className="px-3 py-2 text-right font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2.5">
                      <p className="font-bold text-slate-800">{it.game_title}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {it.platform && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">{it.platform}</span>}
                        {it.condition && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">{it.condition}</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600">{it.quantity}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">Rp {fmt(Number(it.unit_price))}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-900">Rp {fmt(Number(it.subtotal))}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-400">Rincian item tidak tersedia.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Totals */}
          <div className="mt-3 space-y-1.5 rounded-2xl bg-slate-50 p-4 text-xs">
            <div className="flex justify-between text-slate-500"><span>Subtotal Produk</span><span>Rp {fmt(subtotal)}</span></div>
            <div className="flex justify-between text-slate-500"><span>Ongkir {order.courier ? `(${order.courier})` : ""}</span><span>Rp {fmt(Number(order.shippingCost || 0))}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
              <span>Total Pembayaran</span><span className="font-gaming text-sky-600">Rp {fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping / tracking card */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Kirim ke</h4>
            <p className="text-xs font-bold text-slate-800">{order.recipientName || "—"}</p>
            {order.regionLabel && <p className="mt-1 text-xs text-slate-500">{order.regionLabel}</p>}
            <p className="mt-1 text-xs text-slate-500">{order.courier ? `${order.courier}` : "Ekspedisi"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">No. Resi / Tracking</h4>
            <p className="font-mono text-sm font-bold tracking-wider text-slate-900">{order.orderNumber}</p>
            <p className="mt-1 text-[10px] text-slate-400">Resi dikirim ke WhatsApp penerima setelah QC selesai.</p>
          </div>
        </div>

        {/* Status stepper */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Pembayaran", sub: isPending ? "Menunggu" : "Terverifikasi", active: !isPending, color: "bg-emerald-500" },
            { label: "Quality Check", sub: "Optik & Kemasan", active: true, pulse: true, color: "bg-sky-500" },
            { label: "Diserahkan Kurir", sub: "Ekspedisi JNE/TIKI", active: false, color: "bg-slate-200 text-slate-600" },
          ].map((s) => (
            <div key={s.label} className={`flex flex-col items-center ${!s.active ? "opacity-40" : ""}`}>
              <div className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ${s.color} ${s.pulse ? "animate-pulse" : ""}`}>
                {s.active && !s.pulse ? "✓" : s.label === "Quality Check" ? "QC" : s.label === "Diserahkan Kurir" ? "›" : "!"}
              </div>
              <span className="text-xs font-bold text-slate-800">{s.label}</span>
              <span className="text-[10px] text-slate-400">{s.sub}</span>
            </div>
          ))}
        </div>

        {/* QR + share */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            {qrSrc ? (
              <img src={qrSrc} alt={`QR ${order.orderNumber}`} className="h-28 w-28 rounded-lg border border-slate-200" />
            ) : (
              <div className="h-28 w-28 animate-pulse rounded-lg bg-slate-100" />
            )}
            <div className="max-w-[220px] text-xs text-slate-500">
              <p className="font-bold text-slate-800">Cek status pesanan</p>
              <p className="mt-1 break-words">Scan QR atau buka tautan untuk melacak paket & resi.</p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[180px]">
            <button onClick={() => window.print()} className="w-full rounded-xl bg-sky-500 py-2.5 text-sm font-bold text-white hover:bg-sky-600">
              {printed ? "Dicetak" : "Cetak Struk"}
            </button>
            <button onClick={share} className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white hover:bg-emerald-600">
              Share ke WhatsApp
            </button>
          </div>
        </div>

        {/* Guarantee */}
        <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
          <div className="mt-0.5 text-sky-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" /></svg>
          </div>
          <div className="text-xs leading-relaxed text-slate-600">
            <p className="font-bold text-slate-800">Garansi Toko PlayHaven</p>
            Setiap kaset game fisik melewati pengujian pembacaan optik di konsol sebelum dikirim. Garansi penukaran 7 hari berlaku jika kaset mengalami kendala saat dimainkan.
          </div>
        </div>
      </div>
    </div>
  );
}
