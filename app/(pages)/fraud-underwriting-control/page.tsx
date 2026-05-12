"use client";
import SubMenu from "@/components/SubMenu";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDown } from "react-icons/io";

type MainTabKey =
  | "fraud-decision-log"
  | "blacklist-manager"
  | "whitelist-manager"
  | "fraud-config"
  | "underwriting-config"
  | "risk-rule-tester";

const mockFraudDecisions = [
  {
    msisdn: "07086022674",
    decision: "Failed",
    rule: "DUPLICATE_FINGERPRINT",
    reason: "Unauthorized signature",
    timestamp: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08123456789",
    decision: "Pending",
    rule: "SIGNATURE_INVALID",
    reason: "Unauthorized signature",
    timestamp: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "09087654321",
    decision: "Success",
    rule: "DUPLICATE_FINGERPRINT",
    reason: "Duplicate identity",
    timestamp: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "07012345678",
    decision: "Failed",
    rule: "SIGNATURE_INVALID",
    reason: "Charge-back",
    timestamp: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08098765432",
    decision: "Pending",
    rule: "DUPLICATE_FINGERPRINT",
    reason: "Fraud callback mismatch",
    timestamp: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "07086022674",
    decision: "Success",
    rule: "SIGNATURE_INVALID",
    reason: "Velocity breach",
    timestamp: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08123456789",
    decision: "Failed",
    rule: "DUPLICATE_FINGERPRINT",
    reason: "Duplicate identity",
    timestamp: "05/05/2026, 14:30:00",
  },
];

const mockBlacklist = [
  {
    msisdn: "07086022674",
    reason: "Unauthorized signature",
    rule: "SYSTEM",
    createdDate: "05/05/2026, 14:30:00",
    updatedDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08123456789",
    reason: "Unauthorized signature",
    rule: "ADMIN",
    createdDate: "05/05/2026, 14:30:00",
    updatedDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "09087654321",
    reason: "Duplicate identity",
    rule: "SYSTEM",
    createdDate: "05/05/2026, 14:30:00",
    updatedDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "07012345678",
    reason: "Charge-back",
    rule: "ADMIN",
    createdDate: "05/05/2026, 14:30:00",
    updatedDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08098765432",
    reason: "Fraud callback mismatch",
    rule: "SYSTEM",
    createdDate: "05/05/2026, 14:30:00",
    updatedDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "07086022674",
    reason: "Velocity breach",
    rule: "ADMIN",
    createdDate: "05/05/2026, 14:30:00",
    updatedDate: "05/05/2026, 14:30:00",
  },
  {
    msisdn: "08123456789",
    reason: "Duplicate identity",
    rule: "SYSTEM",
    createdDate: "05/05/2026, 14:30:00",
    updatedDate: "05/05/2026, 14:30:00",
  },
];

const mockWhitelist = [...mockBlacklist];

const mockFraudConfig = [
  {
    key: "fraud.velocity.limit",
    value: 3,
    description: "Max inquiries per minute",
  },
  {
    key: "fraud.min.score",
    value: 100,
    description: "Minimum score for approval",
  },
  { key: "loan.max.amount", value: 55, description: "Maximum loan principal" },
  {
    key: "recovery.grace.days",
    value: 80,
    description: "Grace period before delinquency",
  },
  {
    key: "callback.duplicate.window",
    value: 90,
    description: "Duplicate window in seconds",
  },
  {
    key: "fraud.velocity.limit",
    value: 20,
    description: "Max inquiries per minute",
  },
  {
    key: "fraud.min.score",
    value: 110,
    description: "Minimum score for approval",
  },
];

const mockUnderwritingConfig = [...mockFraudConfig];

const mockRuleEvaluations = [
  { rule: "Not blacklisted", detail: "Clean", passed: true },
  { rule: "Underwriting score ≥ 55", detail: "Score: 61", passed: true },
  { rule: "Behavioural score < 60", detail: "Score: 42", passed: true },
  { rule: "Active loans ≤ 2", detail: "Active: 1", passed: true },
  { rule: "Principal ≤ 1000", detail: "Amount: ₦500", passed: true },
  { rule: "SIM tenure ≥ 90 days", detail: "180 days", passed: true },
];

const mainTabs: { key: MainTabKey; label: string; count?: number }[] = [
  { key: "fraud-decision-log", label: "Fraud Decision Log", count: 80 },
  { key: "blacklist-manager", label: "Blacklist Manager", count: 89 },
  { key: "whitelist-manager", label: "Whitelist Manager", count: 60 },
  { key: "fraud-config", label: "Fraud Config", count: 12 },
  { key: "underwriting-config", label: "Underwriting Config", count: 12 },
  { key: "risk-rule-tester", label: "Risk Rule Tester" },
];

// ── Modal ──────────────────────────────────────────────────────────────
const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-sm w-full max-w-lg mx-4 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-semibold text-[#1F2937] font-sf-pro">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ModalInput = ({
  label,
  placeholder,
  value,
  onChange,
  textarea,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) => (
  <div className="mb-4">
    <label className="block text-[13px] text-[#374151] font-ibm-plex-sans mb-1">
      {label}
    </label>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-[#E5E7EB] rounded-sm px-3 py-2 text-[13px] text-[#374151] outline-none placeholder:text-gray-400 focus:border-[#5490DE] transition-colors resize-none"
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#E5E7EB] rounded-sm px-3 h-10 text-[13px] text-[#374151] outline-none placeholder:text-gray-400 focus:border-[#5490DE] transition-colors"
      />
    )}
  </div>
);

const ModalActions = ({ onClose }: { onClose: () => void }) => (
  <div className="flex justify-end gap-3 mt-6">
    <button
      onClick={onClose}
      className="px-6 h-10 rounded-sm text-[13px] text-[#374151] font-medium border border-[#E5E7EB] hover:bg-gray-50 transition-colors"
    >
      Cancel
    </button>
    <button className="px-6 h-10 rounded-sm text-[13px] text-white font-medium bg-[#243B6B] hover:bg-[#1E3A5F] transition-colors">
      Yes, Proceed
    </button>
  </div>
);

// ── Shared Table UI ────────────────────────────────────────────────────
const SortableTh = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
    <button className="flex items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
      {children}
      <IoMdArrowDown className="inline ml-1 opacity-50" />
    </button>
  </th>
);

const Td = ({
  children,
  bold,
}: {
  children: React.ReactNode;
  bold?: boolean;
}) => (
  <td
    className={`px-4 py-4 text-[13px] ${bold ? "text-[#1F2937] font-medium" : "text-[#667085]"}`}
  >
    {children}
  </td>
);

const decisionBadge = (decision: string) => {
  const styles: Record<string, string> = {
    Failed: "bg-red-100 text-red-600",
    Pending: "bg-orange-100 text-orange-500",
    Success: "bg-green-100 text-green-600",
  };
  return (
    <span
      className={`inline-flex px-3 py-0.5 rounded text-xs font-semibold ${styles[decision] ?? "bg-gray-100 text-gray-600"}`}
    >
      {decision}
    </span>
  );
};

// ── Sections ───────────────────────────────────────────────────────────
const FraudDecisionLog = () => {
  const [search, setSearch] = useState("");
  return (
    <div>
      <div className="flex justify-end mb-6 gap-3">
        <div className="flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-sm px-3 h-10 w-72">
          <IoSearch size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MSISDN"
            className="flex-1 text-[13px] text-[#374151] outline-none placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <button className="flex items-center gap-2 bg-[#243B6B] px-4 h-10 rounded-sm text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors">
          <AiOutlineSearch size={16} /> Search
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-[#F3F4F6] bg-gray-50">
              <SortableTh>MSISDN</SortableTh>
              <SortableTh>Decision</SortableTh>
              <SortableTh>Rule</SortableTh>
              <SortableTh>Reason</SortableTh>
              <SortableTh>Timestamp</SortableTh>
            </tr>
          </thead>
          <tbody>
            {mockFraudDecisions.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]"
              >
                <Td bold>{row.msisdn}</Td>
                <td className="px-4 py-4">{decisionBadge(row.decision)}</td>
                <Td>{row.rule}</Td>
                <Td>{row.reason}</Td>
                <Td>{row.timestamp}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Shared list table for Blacklist / Whitelist ────────────────────────
const ListManager = ({
  data,
  modalTitle,
  buttonLabel,
}: {
  data: typeof mockBlacklist;
  modalTitle: string;
  buttonLabel: string;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ msisdn: "", reason: "", source: "" });

  return (
    <div>
      {showModal && (
        <Modal title={modalTitle} onClose={() => setShowModal(false)}>
          <ModalInput
            label="MSISDN"
            placeholder="e.g (08115422207)"
            value={form.msisdn}
            onChange={(v) => setForm((p) => ({ ...p, msisdn: v }))}
          />
          <ModalInput
            label="Reason"
            placeholder="Enter Reason...."
            value={form.reason}
            onChange={(v) => setForm((p) => ({ ...p, reason: v }))}
            textarea
          />
          <ModalInput
            label="Source"
            placeholder="Enter Source"
            value={form.source}
            onChange={(v) => setForm((p) => ({ ...p, source: v }))}
          />
          <ModalActions onClose={() => setShowModal(false)} />
        </Modal>
      )}

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#243B6B] px-4 h-10 rounded-sm text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors"
        >
          <AiOutlinePlus /> {buttonLabel}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-[#F3F4F6] bg-gray-50">
              <SortableTh>MSISDN</SortableTh>
              <SortableTh>Reason</SortableTh>
              <SortableTh>Source</SortableTh>
              <SortableTh>Created Date</SortableTh>
              <SortableTh>Updated Date</SortableTh>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]"
              >
                <Td bold>{row.msisdn}</Td>
                <Td>{row.reason}</Td>
                <Td>{row.rule}</Td>
                <Td>{row.createdDate}</Td>
                <Td>{row.updatedDate}</Td>
                <td className="px-4 py-4">
                  <button className="text-red-500 text-[13px] font-medium hover:text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ConfigTable = ({
  data,
  buttonLabel,
  modalTitle,
}: {
  data: typeof mockFraudConfig;
  buttonLabel: string;
  modalTitle: string;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ key: "", value: "", description: "" });

  return (
    <div>
      {showModal && (
        <Modal title={modalTitle} onClose={() => setShowModal(false)}>
          <ModalInput
            label="Key"
            placeholder="fraud.velocity.limit"
            value={form.key}
            onChange={(v) => setForm((p) => ({ ...p, key: v }))}
          />
          <ModalInput
            label="Value"
            placeholder="Enter value"
            value={form.value}
            onChange={(v) => setForm((p) => ({ ...p, value: v }))}
          />
          <ModalInput
            label="Description"
            placeholder="Enter Description...."
            value={form.description}
            onChange={(v) => setForm((p) => ({ ...p, description: v }))}
            textarea
          />
          <ModalActions onClose={() => setShowModal(false)} />
        </Modal>
      )}

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#243B6B] px-4 h-10 rounded-sm text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors"
        >
          <AiOutlinePlus /> {buttonLabel}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-[#F3F4F6] bg-gray-50">
              <SortableTh>Key</SortableTh>
              <SortableTh>Value</SortableTh>
              <SortableTh>Description</SortableTh>
              <SortableTh>Action</SortableTh>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]"
              >
                <Td bold>{row.key}</Td>
                <Td>{row.value}</Td>
                <Td>{row.description}</Td>
                <td className="px-4 py-4">
                  <button className="text-blue-500 text-[13px] font-medium hover:text-blue-700">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RiskRuleTester = () => {
  const [form, setForm] = useState({
    msisdn: "",
    amount: "",
    behaviouralScore: "",
    underwritingScore: "",
    activeLoans: "",
    tenure: "",
    blacklisted: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-[#F3F4F6] rounded-sm p-6">
        <h2 className="text-[18px] font-semibold text-[#1F2937] font-sf-pro mb-6">
          Applicant Inputs
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              name: "msisdn",
              label: "MSISDN",
              placeholder: "e.g (08115422207)",
            },
            { name: "amount", label: "Amount", placeholder: "Enter amount" },
            {
              name: "behaviouralScore",
              label: "Behavioural Score",
              placeholder: "Enter Score",
            },
            {
              name: "underwritingScore",
              label: "Underwriting Score",
              placeholder: "Enter Score",
            },
            {
              name: "activeLoans",
              label: "Active Loans",
              placeholder: "Input number",
            },
            {
              name: "tenure",
              label: "Tenure (days)",
              placeholder: "Input number",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-[13px] text-[#374151] font-ibm-plex-sans mb-1">
                {field.label}
              </label>
              <input
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-[#E5E7EB] rounded-sm px-3 h-10 text-[13px] text-[#374151] outline-none placeholder:text-gray-400 focus:border-[#5490DE] transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            name="blacklisted"
            checked={form.blacklisted}
            onChange={handleChange}
            className="w-4 h-4 accent-[#243B6B]"
          />
          <label className="text-[13px] text-[#374151] font-ibm-plex-sans">
            Blacklisted MSISDN
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button className="bg-[#243B6B] text-white px-6 h-10 rounded-sm text-[13px] font-medium hover:bg-[#1E3A5F] transition-colors">
            Run Rule
          </button>
          <button
            onClick={() =>
              setForm({
                msisdn: "",
                amount: "",
                behaviouralScore: "",
                underwritingScore: "",
                activeLoans: "",
                tenure: "",
                blacklisted: false,
              })
            }
            className="text-[#374151] px-6 h-10 rounded-sm text-[13px] font-medium border border-[#E5E7EB] hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#F3F4F6] rounded-sm p-6">
        <h2 className="text-[18px] font-semibold text-[#1F2937] font-sf-pro mb-6">
          Rule Evaluation
        </h2>
        <div className="flex flex-col gap-3">
          {mockRuleEvaluations.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#F9FAFB] rounded-sm px-4 py-3"
            >
              <div>
                <div className="text-[13px] font-medium text-[#1F2937]">
                  {item.rule}
                </div>
                <div className="text-[12px] text-[#667085] mt-0.5">
                  {item.detail}
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.passed ? "bg-green-500" : "bg-red-500"}`}
              >
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────
export default function Page() {
  const [activeMainTab, setActiveMainTab] =
    useState<MainTabKey>("fraud-decision-log");

  return (
    <div className="p-6">
      <SubMenu
        title="Fraud & Underwriting Control"
        subtitle="Manage blacklists, whitelists, and fraud detection rules"
      />

      <div className="flex border border-[#DCE9F9] bg-[#EEF4FC] rounded-sm mt-6 mb-6 pl-1 py-1 gap-1 overflow-x-auto">
        {mainTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveMainTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-ibm-plex-sans whitespace-nowrap rounded transition-colors ${
              activeMainTab === tab.key
                ? "bg-[#243B6B] text-white font-semibold"
                : "text-[#6B7280] hover:text-[#374151]"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded font-semibold ${
                  activeMainTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-[#D1E3F8] text-[#243B6B]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div
        className={`bg-white rounded-sm border border-gray-200 ${activeMainTab !== "risk-rule-tester" ? "p-6" : "p-4"}`}
      >
        {activeMainTab === "fraud-decision-log" && <FraudDecisionLog />}
        {activeMainTab === "blacklist-manager" && (
          <ListManager
            data={mockBlacklist}
            modalTitle="Add to Blacklist"
            buttonLabel="Add to Blacklist"
          />
        )}
        {activeMainTab === "whitelist-manager" && (
          <ListManager
            data={mockWhitelist}
            modalTitle="Add to Whitelist"
            buttonLabel="Add to Whitelist"
          />
        )}
        {activeMainTab === "fraud-config" && (
          <ConfigTable
            data={mockFraudConfig}
            buttonLabel="New Fraud Configuration"
            modalTitle="Add Fraud Configuration"
          />
        )}
        {activeMainTab === "underwriting-config" && (
          <ConfigTable
            data={mockUnderwritingConfig}
            buttonLabel="New Underwriting Configuration"
            modalTitle="Add Underwriting Configuration"
          />
        )}
        {activeMainTab === "risk-rule-tester" && <RiskRuleTester />}
      </div>
    </div>
  );
}
