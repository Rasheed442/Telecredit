"use client";
import SubMenu from "@/components/SubMenu";
import React, { useState, useEffect, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowDown } from "react-icons/io";
import {
  FileSliders,
  LoaderCircle,
  ShieldAlert,
  ShieldBan,
  ShieldCheck,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import axiosInstance from "@/app/utils/axios";

type MainTabKey =
  | "fraud-decision-log"
  | "blacklist-manager"
  | "whitelist-manager"
  | "fraud-config"
  | "underwriting-config"
  | "risk-rule-tester";

/*
const mockFraudDecisions = [
  {
    msisdn: "07086022674",
    decision: "Failed",
    rule: "DUPLICATE_FINGERPRINT",
    reason: "Unauthorized signature",
    timestamp: "05/05/2026, 14:30:00",
  },
  // ... (commented out dummy data)
];
*/

/*
const mockBlacklist = [
  { msisdn: "07086022674", reason: "Unauthorized signature", rule: "SYSTEM", createdDate: "05/05/2026" },
  // ... (commented out dummy data)
];
*/

/* const mockWhitelist = [...mockBlacklist]; */

// (removed unused mockFraudConfig)

// (removed unused mockUnderwritingConfig)

const mockRuleEvaluations = [
  { rule: "Not blacklisted", detail: "Clean", passed: true },
  { rule: "Underwriting score ≥ 55", detail: "Score: 61", passed: true },
  { rule: "Behavioural score < 60", detail: "Score: 42", passed: true },
  { rule: "Active loans ≤ 2", detail: "Active: 1", passed: true },
  { rule: "Principal ≤ 1000", detail: "Amount: ₦500", passed: true },
  { rule: "SIM tenure ≥ 90 days", detail: "180 days", passed: true },
];

const defaultMainTabs: { key: MainTabKey; label: string; count?: number }[] = [
  { key: "fraud-decision-log", label: "Fraud Decision Log" },
  { key: "blacklist-manager", label: "Blacklist Manager" },
  { key: "whitelist-manager", label: "Whitelist Manager" },
  { key: "fraud-config", label: "Fraud Config" },
  { key: "underwriting-config", label: "Underwriting Config" },
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

// ── API Types ─────────────────────────────────────────────────────────
type FraudStatus = {
  msisdn: string;
  blocked: boolean;
  riskCategory: string;
  riskScore: number;
  reason: string | null;
  updatedAt: string;
};

type ConfigItem = {
  key: string;
  value: string | null;
  description: string | null;
  category: string | null;
  sensitive: boolean;
  editable: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
};

type ApiError = { response?: { data?: { message?: string } } };

// ── Shared Table UI ────────────────────────────────────────────────────
const tableClassName = "w-full min-w-[760px] table-fixed border-collapse";

const SortableTh = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280] whitespace-nowrap">
    <button type="button" className="flex h-5 items-center font-ibm-plex-sans gap-1 hover:text-[#374151]">
      {children}
      <IoMdArrowDown className="inline ml-1 size-3.5 shrink-0 opacity-50" />
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
    className={`px-4 py-4 text-[13px] align-top break-words ${bold ? "text-[#1F2937] font-medium" : "text-[#667085]"}`}
  >
    {children}
  </td>
);

const decisionBadge = (decision: string) => {
  const styles: Record<string, string> = {
    Failed: "bg-red-100 text-red-600 border border-red-200",
    Pending: "bg-orange-100 text-orange-500 border border-orange-200",
    Success: "bg-green-100 text-green-600 border border-green-200",
  };
  return (
    <span
      className={`inline-flex min-w-[74px] justify-center px-3 py-0.5 text-xs font-semibold ${styles[decision] ?? "bg-gray-100 text-gray-600"}`}
    >
      {decision}
    </span>
  );
};

const EmptyTableState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="mb-3 flex size-12 items-center justify-center rounded-sm border border-[#DCE9F9] bg-[#EEF4FC] text-[#243B6B]">
      <Icon size={24} strokeWidth={1.8} />
    </div>
    <div className="text-sm font-semibold text-[#374151]">{title}</div>
    <div className="text-xs text-gray-400">{description}</div>
  </div>
);

// ── Sections ───────────────────────────────────────────────────────────
const FraudDecisionLog = ({ onResultCountChange }: { onResultCountChange?: (count: number) => void }) => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<FraudStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayResult = result as FraudStatus | null;

  const handleSearch = async () => {
    if (!search.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await axiosInstance.get(`admin/fraud/status/${search}`);
      if (res.data?.success && res.data?.data) {
        setResult(res.data.data as FraudStatus);
        onResultCountChange?.(1);
      } else {
        setError(res.data?.message || "No data found");
        onResultCountChange?.(0);
      }
    } catch (err: unknown) {
      console.error(err);
      setError((err as ApiError)?.response?.data?.message || "Failed to fetch fraud status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-6 gap-3">
        <div className="flex items-center gap-2 border border-[#E5E7EB] bg-white rounded-sm px-3 h-10 w-72">
          <IoSearch size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleSearch();
            }}
            placeholder="Search MSISDN"
            className="flex-1 text-[13px] text-[#374151] outline-none placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !search.trim()}
          className="flex min-w-[92px] items-center justify-center gap-2 bg-[#243B6B] px-4 h-10 rounded-sm text-[13px] text-white font-medium hover:bg-[#1E3A5F] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <AiOutlineSearch size={16} />
          )}
          {loading ? "Searching" : "Search"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className={tableClassName}>
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
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2 text-[13px]">
                    <LoaderCircle size={16} className="animate-spin text-[#243B6B]" />
                    Searching fraud decisions...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <EmptyTableState
                    icon={ShieldAlert}
                    title="No Response"
                    description={error}
                  />
                </td>
              </tr>
            ) : displayResult ? (
              <tr className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
                <Td bold>{displayResult.msisdn}</Td>
                <td className="px-4 py-4 align-top">
                  {decisionBadge(displayResult.blocked ? "Failed" : "Success")}
                </td>
                <Td>{displayResult.riskCategory}</Td>
                <Td>{displayResult.reason || "N/A"}</Td>
                <Td>{new Date(displayResult.updatedAt).toLocaleString()}</Td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <EmptyTableState
                    icon={ShieldAlert}
                    title="No Fraud Decisions"
                    description="There are no fraud decision records to display."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Shared list table for Blacklist / Whitelist ────────────────────────
type ListRow = {
  msisdn: string;
  reason: string;
  rule: string;
  createdDate: string;
  updatedDate: string;
};

const ListManager = ({
  data,
  modalTitle,
  buttonLabel,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: {
  data: ListRow[];
  modalTitle: string;
  buttonLabel: string;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
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
        <table className={tableClassName}>
          <thead>
            <tr className="border-y border-[#F3F4F6] bg-gray-50">
              <SortableTh>MSISDN</SortableTh>
              <SortableTh>Reason</SortableTh>
              <SortableTh>Source</SortableTh>
              <SortableTh>Created Date</SortableTh>
              <SortableTh>Updated Date</SortableTh>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-[#6B7280]">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row: ListRow, i: number) => (
                <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
                  <Td bold>{row.msisdn}</Td>
                  <Td>{row.reason}</Td>
                  <Td>{row.rule}</Td>
                  <Td>{row.createdDate}</Td>
                  <Td>{row.updatedDate}</Td>
                  <td className="px-4 py-4 align-top">
                    <button className="text-red-500 text-[13px] font-medium hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <EmptyTableState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ConfigTable = ({
  buttonLabel = "New Configuration",
  modalTitle = "Add Configuration",
  emptyIcon = FileSliders,
  emptyTitle = "No Configurations",
  emptyDescription = "There are no configuration records to display.",
  onCountChange,
}: {
  buttonLabel?: string;
  modalTitle?: string;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  onCountChange?: (count: number) => void;
}) => {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    telco: "",
    key: "",
    value: "",
    description: "",
    category: "",
    sensitive: false,
    editable: true,
  });

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("admin/config/all");
      if (res.data?.success && Array.isArray(res.data.data)) {
        const items = res.data.data as ConfigItem[];
        setConfigs(items);
        onCountChange?.(items.length);
      } else {
        setError(res.data?.message || "Failed to load configs");
      }
    } catch (err: unknown) {
      console.error(err);
      setError((err as ApiError)?.response?.data?.message || "Failed to load configs");
    } finally {
      setLoading(false);
    }
  }, [onCountChange]);

  useEffect(() => {
    // Defer fetch to avoid synchronous setState inside effect
    const id = setTimeout(() => {
      void fetchConfigs();
    }, 0);
    return () => clearTimeout(id);
  }, [fetchConfigs]);

  const handleSave = async () => {
    if (!form.key) return;
    setSaving(true);
    try {
      const payload = {
        telco: form.telco || null,
        key: form.key,
        value: form.value || null,
        description: form.description || "",
        category: form.category || "",
        sensitive: form.sensitive,
        editable: form.editable,
      };

      const res = await axiosInstance.post("admin/config/save", payload);
      if (res.data?.success && res.data?.data) {
        // append or refresh
        const newItem = res.data.data as ConfigItem;
        setConfigs((p) => [newItem, ...p]);
        onCountChange?.(configs.length + 1);
        setShowModal(false);
        setForm({ telco: "", key: "", value: "", description: "", category: "", sensitive: false, editable: true });
      } else {
        setError(res.data?.message || "Failed to save config");
      }
    } catch (err: unknown) {
      console.error(err);
      setError((err as ApiError)?.response?.data?.message || "Failed to save config");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {showModal && (
        <Modal title={modalTitle} onClose={() => setShowModal(false)}>
          <ModalInput
            label="Telco"
            placeholder="e.g. airtel"
            value={form.telco}
            onChange={(v) => setForm((p) => ({ ...p, telco: v }))}
          />
          <ModalInput
            label="Key"
            placeholder="MAX_LOAN_LIMIT"
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
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.sensitive} onChange={(e) => setForm((p) => ({ ...p, sensitive: e.target.checked }))} className="w-4 h-4" />
              Sensitive
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.editable} onChange={(e) => setForm((p) => ({ ...p, editable: e.target.checked }))} className="w-4 h-4" />
              Editable
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowModal(false)} className="px-6 h-10 rounded-sm text-[13px] text-[#374151] font-medium border border-[#E5E7EB] hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-6 h-10 rounded-sm text-[13px] text-white font-medium bg-[#243B6B] hover:bg-[#1E3A5F] transition-colors">{saving ? 'Saving...' : 'Save'}</button>
          </div>
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
        <table className={tableClassName}>
          <thead>
            <tr className="border-y border-[#F3F4F6] bg-gray-50">
              <SortableTh>Key</SortableTh>
              <SortableTh>Value</SortableTh>
              <SortableTh>Description</SortableTh>
              <SortableTh>Action</SortableTh>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2 text-[13px]">
                    <LoaderCircle size={16} className="animate-spin text-[#243B6B]" />
                    Loading configurations...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <EmptyTableState
                    icon={emptyIcon}
                    title="No Response"
                    description={error}
                  />
                </td>
              </tr>
            ) : configs.length > 0 ? (
              configs.map((row, i) => (
                <tr key={i} className="border-b border-[#F9FAFB] hover:bg-[#FAFAFA]">
                  <Td bold>{row.key}</Td>
                  <Td>{String(row.value)}</Td>
                  <Td>{row.description}</Td>
                  <td className="px-4 py-4 align-top">
                    <button className="text-blue-500 text-[13px] font-medium hover:text-blue-700">Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <EmptyTableState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            )}
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
                value={(form as unknown as Record<string, string>)[field.name]}
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
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.passed ? "bg-green-500" : "bg-red-500"}`}
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
  const [activeMainTab, setActiveMainTab] = useState<MainTabKey>(
    "fraud-decision-log"
  );
  const [mainTabsState, setMainTabsState] = useState(defaultMainTabs);
  const updateFraudDecisionCount = useCallback((count: number) => {
    setMainTabsState((prev) =>
      prev.map((tab) =>
        tab.key === "fraud-decision-log" ? { ...tab, count } : tab,
      ),
    );
  }, []);
  const updateFraudConfigCount = useCallback((count: number) => {
    setMainTabsState((prev) =>
      prev.map((tab) =>
        tab.key === "fraud-config" ? { ...tab, count } : tab,
      ),
    );
  }, []);
  const updateUnderwritingConfigCount = useCallback((count: number) => {
    setMainTabsState((prev) =>
      prev.map((tab) =>
        tab.key === "underwriting-config" ? { ...tab, count } : tab,
      ),
    );
  }, []);

  return (
    <div className="p-6">
      <SubMenu
        title="Fraud & Underwriting Control"
        subtitle="Manage blacklists, whitelists, and fraud detection rules"
      />

      <div className="flex border border-[#DCE9F9] bg-[#EEF4FC] rounded-sm mt-6 mb-6 pl-1 py-1 gap-1 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {mainTabsState.map((tab) => (
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
        {activeMainTab === "fraud-decision-log" && (
          <FraudDecisionLog
            onResultCountChange={updateFraudDecisionCount}
          />
        )}
        {activeMainTab === "blacklist-manager" && (
          <ListManager
            data={[]}
            modalTitle="Add to Blacklist"
            buttonLabel="Add to Blacklist"
            emptyIcon={ShieldBan}
            emptyTitle="No Blacklisted Customers"
            emptyDescription="There are no blacklist records to display."
          />
        )}
        {activeMainTab === "whitelist-manager" && (
          <ListManager
            data={[]}
            modalTitle="Add to Whitelist"
            buttonLabel="Add to Whitelist"
            emptyIcon={ShieldCheck}
            emptyTitle="No Whitelisted Customers"
            emptyDescription="There are no whitelist records to display."
          />
        )}
        {activeMainTab === "fraud-config" && (
          <ConfigTable
            buttonLabel="New Fraud Configuration"
            modalTitle="Add Fraud Configuration"
            emptyIcon={SlidersHorizontal}
            emptyTitle="No Fraud Configurations"
            emptyDescription="There are no fraud configuration records to display."
            onCountChange={updateFraudConfigCount}
          />
        )}
        {activeMainTab === "underwriting-config" && (
          <ConfigTable
            buttonLabel="New Underwriting Configuration"
            modalTitle="Add Underwriting Configuration"
            emptyIcon={FileSliders}
            emptyTitle="No Underwriting Configurations"
            emptyDescription="There are no underwriting configuration records to display."
            onCountChange={updateUnderwritingConfigCount}
          />
        )}
        {activeMainTab === "risk-rule-tester" && <RiskRuleTester />}
      </div>
    </div>
  );
}
