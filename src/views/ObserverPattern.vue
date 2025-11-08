<template>
  <section class="pattern">
    <header>
      <h1>옵저버 패턴</h1>
      <p>
        주식 가격 변동을 여러 관찰자에게 자동으로 전달하는 예제입니다. 관찰자는 등록과 해제를 통해 동적으로
        관리되며, 상태 변화가 발생하면 모두에게 통지됩니다.
      </p>
    </header>

    <div class="controls">
      <fieldset class="field">
        <legend>가격 시나리오</legend>
        <label>
          <span>첫 번째 가격</span>
          <input v-model.number="firstPrice" type="number" min="0" step="1" />
        </label>
        <label>
          <span>두 번째 가격</span>
          <input v-model.number="secondPrice" type="number" min="0" step="1" />
        </label>
      </fieldset>

      <fieldset class="field toggles">
        <legend>구독 중인 관찰자</legend>
        <label>
          <input v-model="useDisplay" type="checkbox" /> 가격 화면 표시
        </label>
        <label>
          <input v-model="useAlert" type="checkbox" /> 임계치 알림
        </label>
        <label class="threshold" :class="{ disabled: !useAlert }">
          <span>알림 임계값</span>
          <input v-model.number="alertThreshold" type="number" min="0" step="1" :disabled="!useAlert" />
        </label>
      </fieldset>

      <button type="button" @click="runExample">시나리오 실행</button>
    </div>

    <ul class="logs">
      <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Logger = (message: string) => void

interface Observer {
  update(price: number): void
}

interface Subject {
  register(observer: Observer): void
  unregister(observer: Observer): void
  notify(): void
}

class Stock implements Subject {
  private observers: Observer[] = []
  private price = 0

  register(observer: Observer): void {
    this.observers.push(observer)
  }

  unregister(observer: Observer): void {
    this.observers = this.observers.filter((candidate) => candidate !== observer)
  }

  setPrice(newPrice: number): void {
    this.price = newPrice
    this.notify()
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.price)
    }
  }
}

class PriceDisplay implements Observer {
  constructor(private readonly log: Logger) {}

  update(price: number): void {
    this.log(`📺 화면에 표시: 현재 주가 = ${price}`)
  }
}

class PriceAlert implements Observer {
  constructor(private readonly log: Logger, private readonly threshold: number) {}

  update(price: number): void {
    if (price > this.threshold) {
      this.log(`🚨 알림: 주가 ${price} (임계값 ${this.threshold} 초과)`)
    }
  }
}

const logs = ref<string[]>([])
const firstPrice = ref(90)
const secondPrice = ref(120)
const useDisplay = ref(true)
const useAlert = ref(true)
const alertThreshold = ref(100)

const addLog: Logger = (entry) => {
  logs.value.push(entry)
}

const runExample = () => {
  logs.value = []
  const stock = new Stock()

  if (useDisplay.value) {
    stock.register(new PriceDisplay(addLog))
  }

  if (useAlert.value) {
    stock.register(new PriceAlert(addLog, alertThreshold.value))
  }

  stock.setPrice(firstPrice.value)
  stock.setPrice(secondPrice.value)
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
  display: grid;
  gap: 1rem;
}

fieldset.field {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: grid;
  gap: 0.75rem;
}

fieldset label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

fieldset label span {
  min-width: 6rem;
}

input[type='number'] {
  width: 6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #c0c0c0;
}

.threshold.disabled span {
  color: #9ca3af;
}

.controls button {
  justify-self: flex-start;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #1d4ed8;
  background-color: #2563eb;
  color: #fff;
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

