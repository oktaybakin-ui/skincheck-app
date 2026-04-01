import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikasi - Beauty Check",
  description: "Beauty Check uygulamasi gizlilik politikasi ve kisisel verilerin korunmasi",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, sans-serif", lineHeight: 1.7, color: "#333" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8, color: "#1a1a1a" }}>
        BeautyCheck - Gizlilik Politikasi / Privacy Policy
      </h1>
      <p style={{ color: "#666", marginBottom: 32, fontSize: 14 }}>
        Son guncelleme / Last updated: 1 Nisan 2026 / April 1, 2026
      </p>
      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: "#1a1a1a" }}>1. Introduction</h2>
      <p>BeautyCheck respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our mobile application.</p>
      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: "#1a1a1a" }}>2. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul style={{ marginLeft: 24, marginBottom: 16 }}>
        <li style={{ marginBottom: 8 }}><strong>Camera Access:</strong> We access your device camera solely to provide the core functionality of the app (barcode scanning, ingredient OCR). Photos are processed locally on your device.</li>
        <li style={{ marginBottom: 8 }}><strong>Device Information:</strong> We may collect basic device information such as device model, OS version, and app version.</li>
        <li style={{ marginBottom: 8 }}><strong>Usage Data:</strong> We may collect anonymous usage statistics to improve our services.</li>
      </ul>
      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: "#1a1a1a" }}>3. How We Use Your Information</h2>
      <ul style={{ marginLeft: 24, marginBottom: 16 }}>
        <li style={{ marginBottom: 8 }}>Provide and maintain core features</li>
        <li style={{ marginBottom: 8 }}>Improve and expand our services</li>
        <li style={{ marginBottom: 8 }}>Fix bugs and troubleshoot issues</li>
      </ul>
      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: "#1a1a1a" }}>4. Data Storage and Security</h2>
      <p>Your photos and personal data are processed locally on your device and are not uploaded to our servers unless you explicitly choose to share them.</p>
      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: "#1a1a1a" }}>5. Third-Party Services</h2>
      <p>Our app may use third-party services that may collect information used to identify you.</p>
      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12, color: "#1a1a1a" }}>6. Contact Us</h2>
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20, marginTop: 16 }}>
        <p>If you have any questions, please contact us:</p>
        <p><strong>Email:</strong> oktaybakin@gmail.com</p>
        <p><strong>App:</strong> BeautyCheck</p>
      </div>
    </div>
  );
}
