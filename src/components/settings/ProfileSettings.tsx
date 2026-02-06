import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateEmail, changePassword } from "../../api/user";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../types";

interface ProfileSettingsProps {
    user: User | null;
    onUserUpdated: (user: User) => void;
}

const ProfileSettings = ({ user, onUserUpdated }: ProfileSettingsProps) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Email form state
    const [newEmail, setNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(null);
        setEmailSuccess(null);

        if (!newEmail.trim()) {
            setEmailError("Please enter a new email address");
            return;
        }
        if (!emailPassword) {
            setEmailError("Please enter your current password");
            return;
        }

        setEmailLoading(true);
        try {
            const updatedUser = await updateEmail({
                new_email: newEmail,
                current_password: emailPassword,
            });
            onUserUpdated(updatedUser);
            setEmailSuccess("Email updated successfully");
            setNewEmail("");
            setEmailPassword("");
        } catch (err: any) {
            const message = err.response?.data?.detail || "Failed to update email";
            setEmailError(message);
        } finally {
            setEmailLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (!currentPassword) {
            setPasswordError("Please enter your current password");
            return;
        }
        if (!newPassword) {
            setPasswordError("Please enter a new password");
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        setPasswordLoading(true);
        try {
            await changePassword({
                current_password: currentPassword,
                new_password: newPassword,
            });
            setPasswordSuccess("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            const message = err.response?.data?.detail || "Failed to change password";
            setPasswordError(message);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Current Profile Info */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Current Profile</h3>
                <p className="text-gray-900">
                    <span className="font-medium">Email:</span> {user?.email || "Loading..."}
                </p>
                <p className="text-gray-900">
                    <span className="font-medium">Role:</span> {user?.role || "Loading..."}
                </p>
            </div>

            {/* Email Update Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Email</h3>
                <form onSubmit={handleEmailUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            New Email Address
                        </label>
                        <input
                            type="email"
                            id="newEmail"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new email"
                        />
                    </div>
                    <div>
                        <label htmlFor="emailPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password (to confirm)
                        </label>
                        <input
                            type="password"
                            id="emailPassword"
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter current password"
                        />
                    </div>
                    {emailError && (
                        <p className="text-sm text-red-600">{emailError}</p>
                    )}
                    {emailSuccess && (
                        <p className="text-sm text-green-600">{emailSuccess}</p>
                    )}
                    <button
                        type="submit"
                        disabled={emailLoading}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {emailLoading ? "Updating..." : "Update Email"}
                    </button>
                </form>
            </div>

            {/* Password Change Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter current password"
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new password (min 8 characters)"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm new password"
                        />
                    </div>
                    {passwordError && (
                        <p className="text-sm text-red-600">{passwordError}</p>
                    )}
                    {passwordSuccess && (
                        <p className="text-sm text-green-600">{passwordSuccess}</p>
                    )}
                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {passwordLoading ? "Changing..." : "Change Password"}
                    </button>
                </form>
            </div>

            {/* Logout Section */}
            <div className="bg-white border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Logout</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Sign out of your account. You will need to log in again to access the application.
                </p>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
