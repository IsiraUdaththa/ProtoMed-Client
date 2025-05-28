import { getMe } from "@/services/auth.service";
import { useState, useEffect } from "react";

type Role = "admin" | "designer" | "finance" | "packing" | "guest";

const useRole = () => {
	const [userRole, setUserRole] = useState<Role>("guest"); // Default role as "guest"

	useEffect(() => {
		const fetchUserRole = async () => {
			const userData = await getMe();
			console.log(userData);
			const role = userData.roles?.[0] || "guest"; // Assuming `roles` is an array
			setUserRole(role as Role);
			console.log("Current User Role:", role);
		};

		fetchUserRole();
	}, []);

	const hasRole = (allowedRoles: Role[]) => {
		return allowedRoles.includes(userRole);
	};

	return { userRole, hasRole };
};

export default useRole;
