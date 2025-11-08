<template>
  <section class="pattern">
    <header>
      <h1>어댑터 패턴</h1>
      <p>
        기존 결제 인터페이스에 맞추기 위해 새로운 결제 게이트웨이를 어댑터로 감쌉니다. 클라이언트는 기존
        인터페이스만 사용하면서도 새로운 구현을 활용할 수 있습니다.
      </p>
    </header>

    <div class="controls">
      <label>
        <span>결제 금액</span>
        <input v-model.number="amount" type="number" min="0" step="100" />
      </label>
      <button type="button" @click="runExample">결제 요청</button>
    </div>

    <ul class="logs">
      <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Logger = (message: string) => void

interface OldPaymentProcessor {
  pay(amount: number): void
}

class NewPaymentGateway {
  constructor(private readonly log: Logger) {}

  makePayment(value: number): void {
    this.log(`${value.toLocaleString()}원을 새 결제 게이트웨이로 처리함`)
  }
}

class PaymentAdapter implements OldPaymentProcessor {
  constructor(private readonly gateway: NewPaymentGateway) {}

  pay(amount: number): void {
    this.gateway.makePayment(amount)
  }
}

function processPayment(processor: OldPaymentProcessor, amount: number) {
  processor.pay(amount)
}

const logs = ref<string[]>([])
const amount = ref(5000)

const addLog: Logger = (message) => {
  logs.value.push(message)
}

const runExample = () => {
  logs.value = []
  const gateway = new NewPaymentGateway(addLog)
  const adapter = new PaymentAdapter(gateway)
  processPayment(adapter, amount.value)
}

onMounted(runExample)
</script>

<style scoped>
.pattern {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  background-color: #fafafa;
}

header > h1 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.controls input,
.controls button {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #c0c0c0;
  background-color: #fff;
}

.controls button {
  background-color: #2563eb;
  color: #fff;
  border-color: #1d4ed8;
  cursor: pointer;
}

.logs {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;
}

.logs li {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
}
</style>

