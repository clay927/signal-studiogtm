import { describe, it, expect } from "vitest";
import { classifyDisposition, aggregateCalls } from "./calls";

describe("classifyDisposition", () => {
  it("buckets meetings as a connect + conversation + meeting", () => {
    const c = classifyDisposition("Meeting Booked");
    expect(c).toMatchObject({ bucket: "meeting", connect: true, conversation: true, meeting: true, tone: "good" });
  });
  it("no answer is not a connect", () => {
    const c = classifyDisposition("No answer");
    expect(c.connect).toBe(false);
    expect(c.bucket).toBe("no_connect");
  });
  it("not interested is a connect + conversation but negative", () => {
    const c = classifyDisposition("Not interested");
    expect(c.connect).toBe(true);
    expect(c.conversation).toBe(true);
    expect(c.tone).toBe("bad");
  });
  it("gatekeeper is a connect but not a conversation", () => {
    const c = classifyDisposition("Gatekeeper");
    expect(c.connect).toBe(true);
    expect(c.conversation).toBe(false);
    expect(c.tone).toBe("warn");
  });
  it("callback is positive", () => {
    expect(classifyDisposition("Callback").tone).toBe("good");
  });
});

function evt(id: number, disposition: string, extra: Record<string, unknown> = {}) {
  return {
    id,
    received_at: "2026-07-01T21:46:00Z",
    payload: { event: "disposition-logged-webhook", payload: { v1: { disposition, prospectName: "P" + id, repName: "Lucas Scharf", listName: "LS_Contractors", ...extra } } },
  };
}

describe("aggregateCalls", () => {
  const events = [
    evt(1, "No answer"),
    evt(2, "Voicemail"),
    evt(3, "Not interested"),
    evt(4, "Callback"),
    evt(5, "Meeting Booked"),
  ];

  it("computes the funnel accurately from real-shaped payloads", () => {
    const { metrics, calls } = aggregateCalls(events);
    expect(metrics.dials).toBe(5);
    expect(metrics.connects).toBe(3); // not interested + callback + meeting
    expect(metrics.meetings).toBe(1);
    expect(metrics.dialToConnect).toBe(60); // 3/5
    expect(metrics.connectToMeeting).toBeCloseTo(33.3, 1); // 1/3
    expect(calls[4].prospect).toBe("P5");
    expect(calls[4].rep).toBe("Lucas Scharf");
    expect(calls[4].meeting).toBe(true);
  });
});
