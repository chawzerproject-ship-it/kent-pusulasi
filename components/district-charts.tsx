"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

const COLORS = ["#154871", "#ea8a45", "#38a575", "#2472ad"];

function ComparisonChart({
  title,
  data,
  unit,
  valueFormatter,
}: {
  title: string;
  data: { name: string; value: number }[];
  unit?: string;
  valueFormatter?: (v: number) => string;
}) {
  const format = valueFormatter ?? ((v: number) => formatNumber(Math.round(v)));
  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-navy-950">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ee" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(v) => [`${format(Number(v))}${unit ?? ""}`, ""]} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function DistrictCharts({
  populationComparison,
  densityComparison,
  settlementBreakdown,
  peerComparison,
}: {
  populationComparison: { name: string; value: number }[];
  densityComparison: { name: string; value: number }[];
  settlementBreakdown: { name: string; value: number }[];
  peerComparison: { name: string; value: number }[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <ComparisonChart title="Nüfus: ilçe / il ortalaması / Türkiye ortalaması" data={populationComparison} />
      <ComparisonChart
        title="Nüfus yoğunluğu (kişi/km²)"
        data={densityComparison}
        unit=" kişi/km²"
      />
      <ComparisonChart
        title="Mahalle ve köy sayısı"
        data={settlementBreakdown}
        unit=" adet"
      />
      <ComparisonChart
        title="Benzer belediyelerle nüfus kıyası"
        data={peerComparison}
      />
    </div>
  );
}
