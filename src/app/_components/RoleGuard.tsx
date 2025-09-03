"use client";

import React, { ReactNode } from "react";

interface RoleGuardProps {
    roles: string[];       // roles of the current user
    allowed?: string[];    // roles allowed to view
    blocked?: string[];    // roles explicitly blocked
    fallback?: ReactNode;  // UI to show if blocked
    children: ReactNode;   // content to render if allowed
}

const RoleGuard: React.FC<RoleGuardProps> = ({ roles, allowed = [], blocked = [], children, fallback = null }) => {
	// Blocked roles
	if (blocked.some((role) => roles.includes(role))) return <>{fallback}</>;

	// Allowed roles
	if (allowed.length && !allowed.some((role) => roles.includes(role))) return <>{fallback}</>;

	return <>{children}</>;
};

export default RoleGuard;
