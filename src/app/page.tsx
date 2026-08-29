export default function Home() {
  return (
    <main style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>MonShift</h1>
      <p>Today: 00h00 / Target: 07h00</p>
      <button style={{ padding: "10px 20px", fontSize: "16px", background: "green", color: "white", border: "none", borderRadius: "5px" }}>
        🟢 START WORK
      </button>
    </main>
  );
}
