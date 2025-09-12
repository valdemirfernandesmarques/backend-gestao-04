if (!email || !senha) {
  console.error("❌ ADMIN_EMAIL e ADMIN_PASS devem estar definidos no .env");
  process.exit(1);
}
