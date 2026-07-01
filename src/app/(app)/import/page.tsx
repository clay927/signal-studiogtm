"use client";

import { useState } from "react";
import { useSession } from "@/lib/session";
import { useData } from "@/lib/store";
import { CLIENTS } from "@/lib/data";
import { parseMeetingsCsv, meetingsTemplateCsv, type ImportResult } from "@/lib/csv";
import { deriveResults } from "@/lib/metrics";
import { Card, SectionTitle, StatTile, Pill, EmptyState, SampleBadge } from "@/components/ui";
import { STAGE_LABEL } from "@/components/meeting-detail";
import { money, num, pct, shortDate } from "@/lib/format";
import { Upload, Download, FileCheck2, AlertTriangle, CircleAlert, Check, RotateCcw } from "lucide-react";

export default function ImportPage() {
  const { clientId, user } = useSession();
  const { setImport, clearImport, imports } = useData();
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [applied, setApplied] = useState(false);

  const isOwner = user.clientAccess === "all";
  const client = CLIENTS[clientId].client;
  const existing = imports[clientId];

  if (!isOwner) {
    return (
      <EmptyState
        title="Admins only"
        body="Only StudioGTM owners can import source data. This keeps the numbers everyone sees under one vetted source."
      />
    );
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setApplied(false);
    const text = await file.text();
    setResult(parseMeetingsCsv(text));
  }

  function downloadTemplate() {
    const blob = new Blob([meetingsTemplateCsv()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signal-results-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function apply() {
    if (!result) return;
    setImport(clientId, {
      meetings: result.meetings,
      importedAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
      fileName,
      stats: result.stats,
    });
    setApplied(true);
  }

  const preview = result ? deriveResults(result.meetings) : null;

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium text-ink">Import data</h1>
          <p className="mt-0.5 text-[14px] text-ink-2">
            Upload a vetted CSV for <span className="font-medium text-ink">{client.name}</span>. Signal checks every row, then shows you exactly what it computed.
          </p>
        </div>
        <SampleBadge />
      </div>

      {existing && (
        <Card className="mb-5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[13.5px] text-ink">
              <FileCheck2 size={16} className="text-good-ink" />
              <span>
                Live data active for {client.name}: <span className="font-medium">{existing.stats.imported} meetings</span> from{" "}
                <span className="font-medium">{existing.fileName}</span> · imported {existing.importedAt}
              </span>
            </div>
            <button
              onClick={() => { clearImport(clientId); setResult(null); setApplied(false); }}
              className="flex items-center gap-1.5 rounded-[8px] border border-border px-3 py-1.5 text-[13px] text-ink-2 hover:border-border-strong"
            >
              <RotateCcw size={14} /> Revert to sample data
            </button>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <SectionTitle
          icon={<Upload size={16} />}
          title="Upload a Results / meetings CSV"
          right={
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-1.5 rounded-[8px] border border-border px-3 py-1.5 text-[12.5px] text-ink-2 hover:border-border-strong"
            >
              <Download size={14} /> Download template
            </button>
          }
        />
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-border-strong bg-surface-2 px-4 py-8 text-center hover:border-gold-line">
          <Upload size={22} className="text-ink-3" />
          <span className="text-[14px] text-ink">Choose a CSV file{fileName ? `: ${fileName}` : ""}</span>
          <span className="text-[12px] text-ink-3">Exported from your vetted Google Sheet</span>
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
        </label>
      </Card>

      {result && (
        <>
          <div className="mt-5">
            <SectionTitle icon={<FileCheck2 size={16} />} title="Data health" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatTile label="Rows found" value={num(result.stats.totalRows)} status="neutral" />
              <StatTile label="Meetings imported" value={num(result.stats.imported)} status={result.stats.imported > 0 ? "good" : "bad"} accent />
              <StatTile label="With attendance" value={num(result.stats.withAttendance)} status="neutral" />
              <StatTile label="With deal value" value={num(result.stats.withValue)} status={result.stats.withValue > 0 ? "good" : "warn"} />
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-3 flex items-start gap-2 rounded-[12px] border border-bad bg-bad-soft px-4 py-3 text-[13px] text-bad-ink">
              <CircleAlert size={16} className="mt-0.5 shrink-0" />
              <div>
                {result.errors.map((e, i) => (
                  <p key={i}>{e}</p>
                ))}
              </div>
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="mt-3 rounded-[12px] border border-warn bg-warn-soft px-4 py-3 text-[13px] text-warn-ink">
              <div className="mb-1 flex items-center gap-2 font-medium">
                <AlertTriangle size={15} /> {result.warnings.length} thing{result.warnings.length > 1 ? "s" : ""} to know
              </div>
              <ul className="ml-5 list-disc space-y-0.5">
                {result.warnings.slice(0, 8).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
                {result.warnings.length > 8 && <li>…and {result.warnings.length - 8} more.</li>}
              </ul>
            </div>
          )}

          {preview && result.meetings.length > 0 && (
            <>
              <div className="mt-5">
                <SectionTitle title="What Signal calculated from this file" />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  <StatTile label="Closed won" value={money(preview.closedWon)} status="good" accent />
                  <StatTile label="New pipeline" value={money(preview.newPipeline)} sub={`${preview.pipelineOpps} opps`} status="good" />
                  <StatTile label="Meetings held" value={num(preview.meetingsHeld)} status="good" />
                  <StatTile label="Scheduled" value={num(preview.meetingsScheduled)} status="neutral" />
                  <StatTile label="Hold rate" value={pct(preview.holdRate)} status="neutral" />
                </div>
              </div>

              <Card className="mt-5 p-5">
                <SectionTitle title={`Preview — first ${Math.min(8, result.meetings.length)} of ${result.meetings.length} rows`} />
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b border-border text-left text-[12px] text-ink-3">
                        <th className="py-2 pr-3 font-normal">Account</th>
                        <th className="py-2 pr-3 font-normal">Contact</th>
                        <th className="py-2 pr-3 font-normal">Stage</th>
                        <th className="py-2 pr-3 font-normal">Meeting</th>
                        <th className="py-2 pr-3 font-normal">Rep</th>
                        <th className="py-2 pl-3 text-right font-normal">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.meetings.slice(0, 8).map((m) => (
                        <tr key={m.id} className="border-b border-border last:border-0">
                          <td className="py-2 pr-3 text-ink">{m.company}</td>
                          <td className="py-2 pr-3 text-ink-2">{m.name}</td>
                          <td className="py-2 pr-3"><Pill tone={STAGE_LABEL[m.stage].tone}>{STAGE_LABEL[m.stage].label}</Pill></td>
                          <td className="py-2 pr-3 text-ink-2">{m.dateScheduled ? shortDate(m.dateScheduled) : "—"}</td>
                          <td className="py-2 pr-3 text-ink-2">{m.rep}</td>
                          <td className="tabular py-2 pl-3 text-right text-ink">{m.value ? money(m.value) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <button
                    onClick={apply}
                    disabled={applied}
                    className="flex items-center gap-1.5 rounded-[8px] bg-navy px-4 py-2 text-[13.5px] text-sidebar-ink-active hover:opacity-90 disabled:opacity-60"
                  >
                    <Check size={15} /> {applied ? "Applied — live now" : `Make this ${client.name}'s live data`}
                  </button>
                  {applied && (
                    <span className="text-[13px] text-good-ink">
                      Home and Results now show these numbers. Open them to see it.
                    </span>
                  )}
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
