"use client";

import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Application } from "./types";

interface DeleteDialogProps {
	application: Application | null;
	loading: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export default function DeleteDialog({
	application,
	loading,
	onClose,
	onConfirm,
}: DeleteDialogProps) {
	return (
		<Dialog open={!!application} onOpenChange={onClose}>
			<DialogContent className="rounded-2xl border-red-500/30 bg-slate-900 text-slate-100">
				<DialogHeader>
					<DialogTitle className="font-title text-2xl text-red-200">
						Delete Application
					</DialogTitle>
					<DialogDescription className="text-slate-400">
						Are you sure you want to delete the application from{" "}
						<strong className="text-slate-200">
							{application?.personalInfo?.publicDisplayName}
						</strong>
						? This action cannot be undone and will also release their NIC,
						WhatsApp, and university email for re-registration.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={loading}
						className="rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800"
					>
						Cancel
					</Button>
					<Button
						onClick={onConfirm}
						disabled={loading}
						className="rounded-[8px] bg-red-600 hover:bg-red-500"
					>
						{loading ? (
							<Loader2 className="w-4 h-4 animate-spin mr-2" />
						) : (
							<Trash2 className="w-4 h-4 mr-2" />
						)}
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
