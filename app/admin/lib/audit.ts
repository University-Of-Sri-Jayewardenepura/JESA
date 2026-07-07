import { getAdminDb } from "@/lib/firebase-admin";

export type AuditAction =
  | "login"
  | "logout"
  | "view_applications"
  | "delete_application"
  | "bulk_delete_applications"
  | "status_update"
  | "bulk_status_update"
  | "approve_admin"
  | "reject_admin"
  | "revoke_admin"
  | "request_admin_access";

interface AuditLogEntry {
  action: AuditAction;
  actor: string;
  actorUid: string;
  targetId?: string;
  targetEmail?: string;
  details?: Record<string, unknown>;
  userAgent?: string;
  ip?: string;
  timestamp: Date;
}

export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    await getAdminDb().collection("audit_logs").add({
      ...entry,
      timestamp: new Date(),
    });
  } catch (error) {
    // Audit logging should never break the main flow
    console.error("[Audit] Failed to write audit log:", error);
  }
}

export async function logAdminAction(
  action: AuditAction,
  actor: { email: string; uid: string },
  request: Request,
  metadata?: {
    targetId?: string;
    targetEmail?: string;
    details?: Record<string, unknown>;
  }
): Promise<void> {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  await logAuditEvent({
    action,
    actor: actor.email,
    actorUid: actor.uid,
    targetId: metadata?.targetId,
    targetEmail: metadata?.targetEmail,
    details: metadata?.details,
    ip,
    userAgent: request.headers.get("user-agent") || undefined,
    timestamp: new Date(),
  });
}
