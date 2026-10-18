const admin = require("firebase-admin");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
admin.initializeApp();
const db = admin.firestore();
const REGION = "us-central1";
const ADMIN_UID = "i4tb4fJn8VQ23Fp5VH2wjiNepOz1";

async function sendToUid(uid, title, body, url) {
  if (!uid) return false;
  const ref = db.collection("pushTokens").doc(uid);
  const snap = await ref.get();
  if (!snap.exists) return false;
  const token = snap.get("token");
  if (typeof token !== "string" || !token) return false;
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      data: { url: url || "./" },
      webpush: { fcmOptions: { link: url || "./" }, notification: { icon: "./icon.svg", dir: "rtl" } }
    });
    return true;
  } catch (error) {
    if (error.code === "messaging/registration-token-not-registered" || error.code === "messaging/invalid-registration-token") {
      await ref.delete().catch(() => {});
      return false;
    }
    console.error("FCM send failed", error);
    throw error;
  }
}

exports.notifyAdminOnNewOrder = onDocumentCreated({ document: "orders/{orderId}", region: REGION }, async (event) => {
  const order = event.data && event.data.data();
  if (!order) return;
  const buyer = String(order.buyer || "عميل جديد").slice(0, 100);
  await sendToUid(ADMIN_UID, "فاتورة جديدة — معوض نصير", "وصل طلب جديد من " + buyer + " • رقم الطلب: " + event.params.orderId, "./admin.html");
});

exports.notifyCustomerOnOrderStatus = onDocumentUpdated({ document: "orders/{orderId}", region: REGION }, async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();
  if (!after || before.status === after.status) return;
  const uid = typeof after.customerUid === "string" ? after.customerUid : null;
  if (!uid) return;
  const labels = {
    new: "تم استلام طلبك", contacted: "تم التواصل بخصوص طلبك", confirmed: "تم تأكيد طلبك",
    preparing: "طلبك قيد التجهيز", ready: "طلبك جاهز للشحن", out_for_delivery: "طلبك خرج للتوصيل",
    delivered: "تم تسليم طلبك", completed: "تم إكمال الطلب", cancelled: "تم إلغاء طلبك"
  };
  const status = String(after.status || "");
  const title = status === "cancelled" ? "تم إلغاء الفاتورة" : "تحديث طلبك — معوض نصير";
  await sendToUid(uid, title, (labels[status] || "تم تحديث حالة طلبك") + " • رقم الطلب: " + event.params.orderId, "./index.html#home");
});