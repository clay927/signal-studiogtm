// Orum call parsing + metrics. Each disposition-logged event is one dial.
// The disposition drives the funnel (dials -> connects -> conversations ->
// meetings). Keyword mapping has sensible defaults and is easy to tune to a
// client's exact Orum disposition names.

export type CallBucket = "meeting" | "positive" | "connected" | "no_connect" | "other";

export interface CallClass {
  bucket: CallBucket;
  connect: boolean; // reached a human
  conversation: boolean; // a real back-and-forth (excludes gatekeeper)
  meeting: boolean;
  tone: "good" | "warn" | "bad" | "neutral";
}

export function classifyDisposition(raw: string): CallClass {
  const d = (raw || "").toLowerCase();
  const has = (re: RegExp) => re.test(d);

  if (has(/meeting|demo|booked|appointment|scheduled/)) {
    return { bucket: "meeting", connect: true, conversation: true, meeting: true, tone: "good" };
  }
  // Negatives first — "not interested" contains "interested", so it must be
  // checked before the positive rule.
  if (has(/not interested|no thanks|do not call|dnc|objection|hung up|remove/)) {
    return { bucket: "connected", connect: true, conversation: true, meeting: false, tone: "bad" };
  }
  if (has(/interested|call ?back|follow.?up|warm|positive|qualified/)) {
    return { bucket: "positive", connect: true, conversation: true, meeting: false, tone: "good" };
  }
  if (has(/gatekeeper|wrong (person|number)|transfer/)) {
    return { bucket: "connected", connect: true, conversation: false, meeting: false, tone: "warn" };
  }
  if (has(/no answer|voicemail|\bvm\b|busy|no ring|disconnected|bad number|invalid|dead air|abandoned/)) {
    return { bucket: "no_connect", connect: false, conversation: false, meeting: false, tone: "neutral" };
  }
  return { bucket: "other", connect: false, conversation: false, meeting: false, tone: "neutral" };
}

export interface Call {
  id: number;
  prospect: string;
  company: string;
  disposition: string;
  tone: "good" | "warn" | "bad" | "neutral";
  meeting: boolean;
  rep: string;
  phone: string;
  at: string;
  durationSec: number | null;
  note: string;
  objection: string;
  recording: string;
  transcript: string;
  direction: string;
}

interface StoredEvent {
  id: number;
  payload: Record<string, unknown> | null;
  received_at: string;
}

function getV1(payload: Record<string, unknown> | null): Record<string, unknown> {
  if (!payload) return {};
  const inner = payload.payload as Record<string, unknown> | undefined;
  if (inner && typeof inner === "object" && inner.v1) return inner.v1 as Record<string, unknown>;
  if (payload.v1) return payload.v1 as Record<string, unknown>;
  return payload;
}

const str = (v: unknown) => (v == null ? "" : String(v));

export function parseCall(evt: StoredEvent): Call {
  const v = getV1(evt.payload);
  const disposition = str(v.disposition) || "Unknown";
  const cls = classifyDisposition(disposition);
  return {
    id: evt.id,
    prospect: str(v.prospectName) || "Unknown prospect",
    company: str(v.accountName) || str(v.listName),
    disposition,
    tone: cls.tone,
    meeting: cls.meeting,
    rep: str(v.repName) || str(v.repEmail),
    phone: str(v.prospectPhoneNumber),
    at: str(v.calledAt) || evt.received_at,
    durationSec: v.callDuration != null && v.callDuration !== "" ? Number(v.callDuration) : null,
    note: str(v.note),
    objection: str(v.objection),
    recording: str(v.recordingLink),
    transcript: str(v.transcript),
    direction: str(v.callDirection),
  };
}

export interface CallMetrics {
  dials: number;
  connects: number;
  conversations: number;
  meetings: number;
  dialToConnect: number; // %
  connectToMeeting: number; // %
}

export function aggregateCalls(events: StoredEvent[]): { metrics: CallMetrics; calls: Call[] } {
  const calls = events.map(parseCall);
  let connects = 0;
  let conversations = 0;
  let meetings = 0;
  for (const e of events) {
    const v = getV1(e.payload);
    const cls = classifyDisposition(str(v.disposition));
    if (cls.connect) connects++;
    if (cls.conversation) conversations++;
    if (cls.meeting) meetings++;
  }
  const dials = events.length;
  return {
    metrics: {
      dials,
      connects,
      conversations,
      meetings,
      dialToConnect: dials ? Math.round((connects / dials) * 1000) / 10 : 0,
      connectToMeeting: connects ? Math.round((meetings / connects) * 1000) / 10 : 0,
    },
    calls,
  };
}
