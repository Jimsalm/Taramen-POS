import getToken from "../../shared/helpers/getToken";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ element }) {
	const token = getToken();

	if (!token) {
		return (
			<Navigate
				to='/login'
				replace
			/>
		);
	}

	return element;
}
