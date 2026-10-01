// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

async function enterOfficerWorkspace() {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /enter secure demo/i }));
  await user.click(screen.getByRole("button", { name: /continue as procurement officer/i }));
  return user;
}

beforeEach(() => {
  vi.stubGlobal("scrollTo", vi.fn());
  vi.stubGlobal("alert", vi.fn());
  Object.defineProperty(URL, "createObjectURL", { value: vi.fn(() => "blob:test"), configurable: true });
  Object.defineProperty(URL, "revokeObjectURL", { value: vi.fn(), configurable: true });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("BidShield critical interactions", () => {
  it("filters bidder exceptions and opens the document evidence view", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /attention & bidders/i }));
    await user.click(screen.getByRole("button", { name: /^compliance$/i }));
    expect(screen.getByRole("button", { name: /show all results/i })).toBeInTheDocument();
    expect(screen.queryByText("GST registration status")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^documents$/i }));
    expect(screen.getByRole("heading", { name: /bidder documents/i })).toBeInTheDocument();
    expect(screen.getByText(/GST Certificate/)).toBeInTheDocument();
  });

  it("expands a replay snapshot and downloads a real evidence manifest", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /decision & replay/i }));
    await user.click(screen.getByRole("button", { name: /open submission frozen record/i }));
    expect(screen.getByText("Historical snapshot")).toBeInTheDocument();
    expect(screen.getByText("MAN-26041-V2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /generate evidence pack/i }));
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
  });

  it("searches command actions and navigates to the matching page", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /search tender, bidder/i }));
    const dialog = screen.getByText("QUICK ACTIONS").parentElement!;
    const input = within(dialog).getByPlaceholderText(/search or type a command/i);
    await user.type(input, "audit");
    expect(within(dialog).getByRole("button", { name: /audit/i })).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: /tenders/i })).not.toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: /audit/i }));
    expect(screen.getByRole("heading", { name: /audit trail/i })).toBeInTheDocument();
  });

  it("exposes separate statutory evidence and preserves unavailable as pending", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /attention & bidders/i }));
    expect(screen.getByText("Udyam / MSME registration")).toBeInTheDocument();
    expect(screen.getByText("Income Tax compliance")).toBeInTheDocument();
    await user.click(screen.getByText("Udyam / MSME registration"));
    expect(screen.getAllByText("ATC 3.3 Â· MSME / Udyam Registration").length).toBeGreaterThan(0);
    expect(screen.getAllByText("UDYAM-TN-SYN-0041").length).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: /close/i }));
    await user.click(screen.getByText("EPFO establishment status"));
    const evidenceDialog=screen.getByRole('dialog',{name:/verification evidence/i});
    expect(within(evidenceDialog).getByText("Pending", {selector:"span.pill"})).toBeInTheDocument();
    expect(within(evidenceDialog).getAllByText(/No adverse inference/).length).toBeGreaterThan(0);
  });

  it("isolates suspicious document text and records security review", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /verification center/i }));
    await user.click(screen.getByRole("button", { name: /security flag/i }));
    expect(screen.getByRole("heading", { name: /security review/i })).toBeInTheDocument();
    expect(screen.getByText(/did not change any score/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /mark safe after review/i }));
    await user.click(screen.getByRole("button", { name: /audit & evidence/i }));
    expect(screen.getByText(/marked safe after manual review/i)).toBeInTheDocument();
  });

  it("suggests reusable vault evidence only after bidder confirmation", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /enter secure demo/i }));
    await user.click(screen.getByRole("button", { name: /bidder \/ seller/i }));
    await user.click(screen.getByRole("button", { name: /continue as bidder/i }));
    await user.click(screen.getByRole("button", { name: /^documents$/i }));
    expect(screen.getByText("ORGANIZATION DOCUMENT VAULT")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /use existing document/i })).toHaveLength(3);
    expect(screen.getByText(/never attaches documents automatically/i)).toBeInTheDocument();
  });

  it("traces a finding through the accessible Evidence Nexus and WHY panel", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /attention & bidders/i }));
    await user.click(screen.getByRole("button", { name: /^evidence nexus$/i }));
    expect(screen.getByRole("heading", { name: /evidence lineage/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /finding: turnover mismatch/i }));
    expect(screen.getByRole("dialog", { name: /evidence explanation/i })).toHaveTextContent("WHAT HAPPENED");
    expect(screen.getByRole("dialog", { name: /evidence explanation/i })).toHaveTextContent("WHAT NEEDS TO HAPPEN NEXT");
    await user.click(screen.getByRole("button", { name: /close explanation/i }));
    await user.click(screen.getByRole("button", { name: /view as structured list/i }));
    expect(screen.getByText(/requires annual turnover/i)).toBeInTheDocument();
  });

  it("resolves legal-name variations without creating a false mismatch", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /attention & bidders/i }));
    await user.click(screen.getByRole("button", { name: /^evidence nexus$/i }));
    await user.click(screen.getByRole("button", { name: /entity resolution/i }));
    expect(screen.getByText("LIKELY SAME ENTITY")).toBeInTheDocument();
    expect(screen.getByText("97%")).toBeInTheDocument();
    expect(screen.getByText(/PAN match/)).toBeInTheDocument();
  });

  it("requires decision-time reverification before enabling officer decision", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /attention & bidders/i }));
    expect(screen.getByText(/decision reverification required/i)).toBeInTheDocument();
    const decision=screen.getByLabelText(/record decision/i);
    expect(decision).toBeEnabled();
    await user.selectOptions(decision,'Seek clarification');
    expect(screen.getByRole('button',{name:/continue to record reason/i})).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /reverify now/i }));
    expect(screen.getByRole('button',{name:/continue to record reason/i})).toBeEnabled();
    expect(screen.getByText(/prior snapshots remain accessible/i)).toBeInTheDocument();
  });

  it("opens the read-only auditor workspace and decision replay", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /audit & evidence/i }));
    expect(screen.getByText("Chain Valid")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /auditor view/i }));
    expect(screen.getByText("READ ONLY")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /decision replay/i }));
    expect(screen.getByText("DECISION REPLAY")).toBeInTheDocument();
    expect(screen.getByLabelText(/jump to event/i)).toBeInTheDocument();
  });

  it("supports keyboard table navigation and Escape dismissal for evidence", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /^tenders$/i }));
    const tenderRow=screen.getByLabelText(/open tender industrial safety valves/i);
    tenderRow.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('heading',{name:/industrial safety valves procurement/i})).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /attention & bidders/i }));
    await user.click(screen.getByText("OEM authorization validity"));
    expect(screen.getByRole('dialog',{name:/verification evidence/i})).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog',{name:/verification evidence/i})).not.toBeInTheDocument();
  });

  it("turns missing-item and forensic controls into functional interactions", async () => {
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /attention & bidders/i }));
    await user.click(screen.getByRole("button", { name: /what is missing/i }));
    await user.click(screen.getByRole("button", { name: /retry source/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/retry source opened/i);
    await user.click(screen.getByRole("button", { name: /close missing items/i }));
    await user.click(screen.getByRole("button", { name: /^evidence nexus$/i }));
    await user.click(screen.getByRole("button", { name: /document integrity/i }));
    await user.click(screen.getByRole("button", { name: /view raw provenance/i }));
    expect(screen.getByText(/bbox: page 17/i)).toBeInTheDocument();
  });

  it("records completed verification in the shared audit trail", async () => {
    vi.useFakeTimers({shouldAdvanceTime:true});
    const user = await enterOfficerWorkspace();
    await user.click(screen.getByRole("button", { name: /verification center/i }));
    await user.click(screen.getByRole("button", { name: /run verification/i }));
    await vi.advanceTimersByTimeAsync(3500);
    vi.useRealTimers();
    await user.click(screen.getByRole("button", { name: /audit & evidence/i }));
    expect(screen.getByText(/verification completed; exception findings refreshed/i)).toBeInTheDocument();
  });
});

