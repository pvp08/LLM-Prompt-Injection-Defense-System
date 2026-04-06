import { useState, useEffect, useCallback } from "react";
import {
  ScrollText, Search, Filter, ShieldAlert, ShieldCheck,
  Clock, ChevronLeft, ChevronRight, Loader2, Eye, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { logsApi } from "@/lib/api";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();
      const res = await logsApi.getLogs(params);
      setLogs(res.data.logs);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadLogs();
  };

  return (
    <div className="p-6 md:p-8 h-full overflow-auto scanlines" data-testid="logs-page">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ScrollText className="w-6 h-6 text-[#FFD700]" />
          <h1 className="text-xl sm:text-2xl font-mono font-bold text-[#E0E0E0] tracking-tight">
            SECURITY LOGS
          </h1>
        </div>
        <p className="text-sm text-[#888] font-mono">
          {total} total records
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px] max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts..."
              className="pl-9 bg-[#0A0A0A] border-[#333] focus:border-[#00FF99] font-mono text-xs rounded-sm h-9 text-[#E0E0E0] placeholder:text-[#555]"
              data-testid="logs-search-input"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            className="rounded-sm border-[#333] text-[#888] hover:text-[#E0E0E0] hover:border-[#555] font-mono text-xs h-9"
            data-testid="logs-search-btn"
          >
            <Search className="w-3.5 h-3.5" />
          </Button>
        </form>

        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger
            className="w-[140px] bg-[#0A0A0A] border-[#333] font-mono text-xs text-[#E0E0E0] rounded-sm h-9"
            data-testid="logs-status-filter"
          >
            <Filter className="w-3 h-3 mr-2 text-[#555]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0A0A0A] border-[#333]">
            <SelectItem value="all" className="font-mono text-xs text-[#E0E0E0]">All</SelectItem>
            <SelectItem value="blocked" className="font-mono text-xs text-[#E0E0E0]">Blocked</SelectItem>
            <SelectItem value="passed" className="font-mono text-xs text-[#E0E0E0]">Passed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-[#0A0A0A] border border-[#333] rounded-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#00FF99] animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ScrollText className="w-8 h-8 text-[#333] mb-3" />
            <p className="text-sm font-mono text-[#555]">No logs found</p>
          </div>
        ) : (
          <>
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-[#333] bg-[#050505]">
              <div className="col-span-1 text-xs font-mono uppercase tracking-widest text-[#555]">Status</div>
              <div className="col-span-4 text-xs font-mono uppercase tracking-widest text-[#555]">Input</div>
              <div className="col-span-2 text-xs font-mono uppercase tracking-widest text-[#555]">Attack Type</div>
              <div className="col-span-2 text-xs font-mono uppercase tracking-widest text-[#555]">Blocked By</div>
              <div className="col-span-1 text-xs font-mono uppercase tracking-widest text-[#555]">Conf.</div>
              <div className="col-span-1 text-xs font-mono uppercase tracking-widest text-[#555]">Time</div>
              <div className="col-span-1 text-xs font-mono uppercase tracking-widest text-[#555]"></div>
            </div>

            {/* Rows */}
            {logs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-[#222] hover:bg-[#121212] transition-colors duration-150 items-center"
                data-testid={`log-row-${log.id}`}
              >
                <div className="col-span-1">
                  {log.is_blocked ? (
                    <ShieldAlert className="w-4 h-4 text-[#FF3333]" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-[#00FF99]" />
                  )}
                </div>
                <div className="col-span-4 text-xs font-mono text-[#E0E0E0] truncate" title={log.input_text}>
                  {log.input_text}
                </div>
                <div className="col-span-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-sm ${
                    log.attack_type === "none" ? "text-[#00FF99] bg-[#00FF99]/10" : "text-[#FF3333] bg-[#FF3333]/10"
                  }`}>
                    {log.attack_type === "none" ? "clean" : log.attack_type.replace("_", " ")}
                  </span>
                </div>
                <div className="col-span-2 text-xs font-mono text-[#888]">
                  {log.blocked_by || "-"}
                </div>
                <div className="col-span-1 text-xs font-mono text-[#888]">
                  {(log.max_confidence * 100).toFixed(0)}%
                </div>
                <div className="col-span-1 text-xs font-mono text-[#555] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {log.total_duration_ms?.toFixed(0)}ms
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-1 text-[#555] hover:text-[#00CCFF] transition-colors"
                    data-testid={`view-log-${log.id}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs font-mono text-[#555]">
            Page {page} of {pages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-sm border-[#333] text-[#888] font-mono text-xs h-8"
              data-testid="logs-prev-btn"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="rounded-sm border-[#333] text-[#888] font-mono text-xs h-8"
              data-testid="logs-next-btn"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="bg-[#0A0A0A] border-[#333] max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm uppercase tracking-wider text-[#E0E0E0] flex items-center gap-2">
              {selectedLog?.is_blocked ? (
                <ShieldAlert className="w-4 h-4 text-[#FF3333]" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-[#00FF99]" />
              )}
              Analysis Detail
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 mt-2">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#555] mb-1">Input</p>
                <div className="bg-[#050505] border border-[#333] rounded-sm p-3 font-mono text-sm text-[#E0E0E0]">
                  {selectedLog.input_text}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#555] mb-1">Status</p>
                  <Badge className={`font-mono text-xs rounded-sm ${selectedLog.is_blocked ? "badge-blocked" : "badge-passed"}`}>
                    {selectedLog.is_blocked ? "BLOCKED" : "PASSED"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#555] mb-1">Attack Type</p>
                  <p className="text-sm font-mono text-[#E0E0E0]">{selectedLog.attack_type}</p>
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#555] mb-1">Duration</p>
                  <p className="text-sm font-mono text-[#E0E0E0]">{selectedLog.total_duration_ms?.toFixed(0)}ms</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#555] mb-2">Layer Results</p>
                <div className="space-y-2">
                  {selectedLog.layers?.map((layer) => (
                    <div
                      key={layer.layer_num}
                      className={`border rounded-sm p-3 ${
                        layer.passed ? "border-[#333] bg-[#050505]" : "border-[#FF3333]/30 bg-[#FF3333]/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold text-[#E0E0E0]">
                          L{layer.layer_num}: {layer.layer}
                        </span>
                        <span className={`text-xs font-mono ${layer.passed ? "text-[#00FF99]" : "text-[#FF3333]"}`}>
                          {layer.passed ? "PASS" : "BLOCKED"} ({(layer.confidence * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <p className="text-xs font-mono text-[#888]">{layer.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs font-mono text-[#555]">
                {new Date(selectedLog.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
