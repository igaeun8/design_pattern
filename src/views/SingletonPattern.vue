<template>
  <section class="pattern">
    <header>
      <h1>싱글톤 패턴</h1>
      <p>
        인스턴스를 하나만 유지하는 세 가지 초기화 전략을 비교합니다. 전략을 선택하고 실행하면 같은 인스턴스를
        반환하는지 로그로 확인할 수 있습니다.
      </p>
    </header>

    <div class="controls">
      <label>
        <span>초기화 전략</span>
        <select v-model="strategy">
          <option value="eager">Eager 초기화</option>
          <option value="static-block">Static Block 초기화</option>
          <option value="lazy">Lazy 초기화</option>
        </select>
      </label>
      <button type="button" @click="runExample">실행</button>
    </div>

    <ul class="logs">
      <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

class EagerSingletonDemo {
  private static readonly instance = new EagerSingletonDemo()
  private static creationCount = 0

  private readonly createdAt: string

  private constructor() {
    EagerSingletonDemo.creationCount += 1
    this.createdAt = new Date().toISOString()
  }

  static getInstance(): EagerSingletonDemo {
    return EagerSingletonDemo.instance
  }

  static getCreationCount(): number {
    return EagerSingletonDemo.creationCount
  }

  describe(): string {
    return `Eager Singleton 생성 시각: ${this.createdAt}`
  }
}

class StaticBlockSingletonDemo {
  private static instance: StaticBlockSingletonDemo
  private static creationCount = 0
  private readonly createdAt: string

  private constructor() {
    StaticBlockSingletonDemo.creationCount += 1
    this.createdAt = new Date().toISOString()
  }

  static {
    StaticBlockSingletonDemo.instance = new StaticBlockSingletonDemo()
  }

  static getInstance(): StaticBlockSingletonDemo {
    return StaticBlockSingletonDemo.instance
  }

  static getCreationCount(): number {
    return StaticBlockSingletonDemo.creationCount
  }

  describe(): string {
    return `Static Block Singleton 생성 시각: ${this.createdAt}`
  }
}

class LazySingletonDemo {
  private static instance: LazySingletonDemo | null = null
  private static creationCount = 0
  private readonly createdAt: string

  private constructor() {
    LazySingletonDemo.creationCount += 1
    this.createdAt = new Date().toISOString()
  }

  static getInstance(): LazySingletonDemo {
    if (!LazySingletonDemo.instance) {
      LazySingletonDemo.instance = new LazySingletonDemo()
    }
    return LazySingletonDemo.instance
  }

  static getCreationCount(): number {
    return LazySingletonDemo.creationCount
  }

  static resetForDemo(): void {
    LazySingletonDemo.instance = null
    LazySingletonDemo.creationCount = 0
  }

  describe(): string {
    return `Lazy Singleton 생성 시각: ${this.createdAt}`
  }
}

type StrategyKey = 'eager' | 'static-block' | 'lazy'

const logs = ref<string[]>([])
const strategy = ref<StrategyKey>('eager')

const runEager = () => {
  const instanceA = EagerSingletonDemo.getInstance()
  const instanceB = EagerSingletonDemo.getInstance()
  logs.value.push(instanceA.describe())
  logs.value.push(`생성 횟수: ${EagerSingletonDemo.getCreationCount()}회`)
  logs.value.push(`같은 인스턴스 반환 여부: ${instanceA === instanceB}`)
}

const runStaticBlock = () => {
  const instanceA = StaticBlockSingletonDemo.getInstance()
  const instanceB = StaticBlockSingletonDemo.getInstance()
  logs.value.push(instanceA.describe())
  logs.value.push(`생성 횟수: ${StaticBlockSingletonDemo.getCreationCount()}회`)
  logs.value.push(`같은 인스턴스 반환 여부: ${instanceA === instanceB}`)
}

const runLazy = () => {
  LazySingletonDemo.resetForDemo()
  const instanceA = LazySingletonDemo.getInstance()
  const instanceB = LazySingletonDemo.getInstance()
  logs.value.push(instanceA.describe())
  logs.value.push(`생성 횟수: ${LazySingletonDemo.getCreationCount()}회`)
  logs.value.push(`같은 인스턴스 반환 여부: ${instanceA === instanceB}`)
}

const runExample = () => {
  logs.value = []

  switch (strategy.value) {
    case 'eager':
      runEager()
      break
    case 'static-block':
      runStaticBlock()
      break
    case 'lazy':
      runLazy()
      break
  }
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
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.controls select,
.controls button {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #c0c0c0;
  background-color: #fff;
  cursor: pointer;
}

.controls button {
  background-color: #2563eb;
  border-color: #1d4ed8;
  color: #fff;
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

