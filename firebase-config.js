// إعدادات ربط تطبيق الويب بمشروع Firebase: mawad-naseer-store.
// إعدادات الويب ليست بيانات دخول؛ صلاحيات الإدارة يجب أن تُحمى بقواعد Firebase.
window.MNS_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAA6lRUU7wMduCyalwp5jJMaZQpTRmF6FQ",
  authDomain: "mawad-naseer-store.firebaseapp.com",
  projectId: "mawad-naseer-store",
  storageBucket: "mawad-naseer-store.firebasestorage.app",
  messagingSenderId: "404783403260",
  appId: "1:404783403260:web:19802d8aaee25ce27f0779",
  measurementId: "G-9P6QRF5YPH"
};

// UID حساب الإدارة المعتمد في Firebase Authentication.
// يجب أن يطابق UID نفسه الموجود في firestore.rules. لا تضع كلمة مرور هنا.
window.MNS_ADMIN_UID = "i4tb4fJn8VQ23Fp5VH2wjiNepOz1";

// رقم واتساب المتجر لتلقي البلاغات واستفسارات متابعة الطلبات، بصيغة دولية بدون +.
window.MNS_STORE_WHATSAPP = "201067046324";

// أضف هنا مفتاح Web Push العام من Firebase Console > Project settings > Cloud Messaging.
window.MNS_VAPID_KEY = "PASTE_VAPID_KEY_HERE";
