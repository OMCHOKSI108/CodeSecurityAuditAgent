"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { TeamMember } from "@/types";
import { fetchTeamMembers } from "@/lib/api";
import { UserGroupIcon } from "@/components/ui/Icons";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Developer" | "Security Lead" | "Viewer">("Developer");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers().then((m) => setMembers(m));
  }, []);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      prs_reviewed: 0,
      findings_resolved: 0,
      last_active: "Invited",
    };
    setMembers([...members, newMember]);
    setShowInviteModal(false);
    setInviteEmail("");
    setToastMessage(`Invitation sent to ${inviteEmail} as ${inviteRole}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {toastMessage && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 px-4 py-2.5 rounded-lg text-sm flex items-center justify-between">
            <span>✓ {toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Team &amp; Access Controls</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage organization members, RBAC permissions, and DevSecOps activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Seats: <strong className="text-slate-200">{members.length} / 10</strong></span>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
            >
              + Invite Team Member
            </button>
          </div>
        </div>

        {/* Team Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/70 text-slate-400 text-xs uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Member</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">PRs Audited</th>
                  <th className="py-3.5 px-4 font-semibold">Findings Resolved</th>
                  <th className="py-3.5 px-4 font-semibold">Last Active</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-950 border border-sky-800 flex items-center justify-center text-xs font-bold text-sky-400">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-slate-200 block text-xs">{member.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        member.role === "Admin" ? "bg-purple-950 text-purple-300 border border-purple-800" :
                        member.role === "Security Lead" ? "bg-sky-950 text-sky-300 border border-sky-800" :
                        "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-200">{member.prs_reviewed}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-emerald-400">{member.findings_resolved}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-400">{member.last_active}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Manage permissions for ${member.name}`)}
                        className="text-xs text-sky-400 hover:text-sky-300 font-medium"
                      >
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <h2 className="text-base font-bold text-slate-100">Invite New Team Member</h2>
              <form onSubmit={handleInvite} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Role &amp; Permissions</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Developer">Developer (View and resolve findings)</option>
                    <option value="Security Lead">Security Lead (Approve gates and policy)</option>
                    <option value="Viewer">Viewer (Read-only reports)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
