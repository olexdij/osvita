import { toast } from "sonner";

interface EmailResponse {
  success: boolean;
  message: string;
}

export async function sendPasswordResetEmail(email: string, tempPassword: string): Promise<void> {
  try {
    const response = await fetch('/api/send-reset-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        tempPassword,
        origin: window.location.origin
      })
    });

    const data: EmailResponse = await response.json();

    if (data.success) {
      toast.success("Password reset email sent successfully");
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    toast.error("Failed to send password reset email");
    
    // For development/demo purposes
    toast.info(
      `Demo mode: Your temporary password is: ${tempPassword}`, 
      { duration: 10000 }
    );
  }
}

export function generateTempPassword(): string {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}