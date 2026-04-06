import { useState, useEffect } from "react";
import {
  BarChart3, Shield, ShieldAlert, ShieldCheck, Activity,
  Percent, Loader2, TrendingUp,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { dashboardApi } from "@/lib/api";

const PIE_COLORS = ["#00FF99", "#FF3333", "#00CCFF", "#FFD700"];

function StatCard({ icon: Icon, label, value, subtext, color }) {
  return (
    <div className="stat-card bg-[#0A0A0A] rounded-sm p-5" data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-[#888]">{label}</span>
        <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-mono font-bold" style={{ color }}>{value}</p>
      {subtext && <p className="text-xs font-mono text-[#555] mt-1">{subtext}</p>}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#121212] border border-[#333] rounded-sm p-3 font-mono text-xs">
      <p className="text-[#E0E0E0] mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-[#00FF99] animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm font-mono text-[#555]">Failed to load dashboard</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 h-full overflow-auto scanlines" data-testid="dashboard-page">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-[#00CCFF]" />
          <h1 className="text-xl sm:text-2xl font-mono font-bold text-[#E0E0E0] tracking-tight">
            DEFENSE DASHBOARD
          </h1>
        </div>
        <p className="text-sm text-[#888] font-mono">Real-time attack analytics and system metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Activity} label="Total Scans" value={stats.total_scans} color="#00CCFF" />
        <StatCard icon={ShieldAlert} label="Blocked" value={stats.blocked} subtext={`${stats.block_rate}% block rate`} color="#FF3333" />
        <StatCard icon={ShieldCheck} label="Passed" value={stats.passed} color="#00FF99" />
        <StatCard icon={Percent} label="Avg Confidence" value={`${(stats.avg_confidence * 100).toFixed(1)}%`} color="#FFD700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Timeline Chart */}
        <div className="bg-[#0A0A0A] border border-[#333] rounded-sm p-5" data-testid="timeline-chart">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#00CCFF]" />
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#888]">Scan Timeline</h3>
          </div>
          {stats.timeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" tick={{ fill: "#555", fontSize: 10, fontFamily: "JetBrains Mono" }} tickFormatter={(v) => v.slice(5)} stroke="#333" />
                <YAxis tick={{ fill: "#555", fontSize: 10, fontFamily: "JetBrains Mono" }} stroke="#333" />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "JetBrains Mono" }} />
                <Line type="monotone" dataKey="blocked" stroke="#FF3333" strokeWidth={2} dot={false} name="Blocked" />
                <Line type="monotone" dataKey="passed" stroke="#00FF99" strokeWidth={2} dot={false} name="Passed" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-xs font-mono text-[#555]">
              No data yet. Run some analyses first.
            </div>
          )}
        </div>

        {/* Attack Types Chart */}
        <div className="bg-[#0A0A0A] border border-[#333] rounded-sm p-5" data-testid="attack-types-chart">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-[#FF3333]" />
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#888]">Attack Types</h3>
          </div>
          {stats.attack_types.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.attack_types}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="type" tick={{ fill: "#555", fontSize: 9, fontFamily: "JetBrains Mono" }} stroke="#333" />
                <YAxis tick={{ fill: "#555", fontSize: 10, fontFamily: "JetBrains Mono" }} stroke="#333" />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" fill="#FF3333" radius={[2, 2, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-xs font-mono text-[#555]">
              No attacks detected yet.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Blocked by Layer */}
        <div className="bg-[#0A0A0A] border border-[#333] rounded-sm p-5" data-testid="blocked-by-layer-chart">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[#00FF99]" />
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#888]">Blocked by Layer</h3>
          </div>
          {stats.blocked_by_layer.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={stats.blocked_by_layer} dataKey="count" nameKey="layer" cx="50%" cy="50%" outerRadius={70} strokeWidth={1} stroke="#0A0A0A">
                    {stats.blocked_by_layer.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {stats.blocked_by_layer.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs font-mono text-[#888]">{item.layer}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: PIE_COLORS[i % PIE_COLORS.length] }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-xs font-mono text-[#555]">
              No blocked attacks yet.
            </div>
          )}
        </div>

        {/* Model Usage */}
        <div className="bg-[#0A0A0A] border border-[#333] rounded-sm p-5" data-testid="model-usage-chart">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#FFD700]" />
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#888]">Model Usage</h3>
          </div>
          {stats.model_usage.length > 0 ? (
            <div className="space-y-3 pt-2">
              {stats.model_usage.map((m, i) => {
                const total = stats.model_usage.reduce((s, x) => s + x.count, 0);
                const pct = total > 0 ? (m.count / total) * 100 : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-mono text-[#888] mb-1">
                      <span className="uppercase">{m.model}</span>
                      <span>{m.count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-[#121212] rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-xs font-mono text-[#555]">
              No usage data yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
