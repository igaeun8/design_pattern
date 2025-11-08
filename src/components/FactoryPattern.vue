<template>
  <section class="pattern">
    <header>
      <h1>팩토리 메서드 패턴</h1>
      <p>
        운영체제별로 다른 버튼 구현체를 생성하기 위해 팩토리 메서드를 활용합니다. 버튼 생성 로직은
        서브클래스가 담당하고, 클라이언트는 공통 인터페이스에만 의존합니다.
      </p>
    </header>

    <div class="controls">
      <label>
        <span>운영체제</span>
        <select v-model="selectedOs">
          <option value="Windows">Windows</option>
          <option value="Mac">Mac</option>
        </select>
      </label>
      <button type="button" @click="runExample">예제 실행</button>
    </div>

    <ul class="logs">
      <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Logger = (message: string) => void

interface Button {
  render(): void
  onClick(): void
}

class WindowsButton implements Button {
  constructor(private readonly log: Logger) {}

  render(): void {
    this.log('윈도우 스타일 버튼 렌더링')
  }

  onClick(): void {
    this.log('윈도우 버튼 클릭 이벤트 처리')
  }
}

class MacButton implements Button {
  constructor(private readonly log: Logger) {}

  render(): void {
    this.log('맥 스타일 버튼 렌더링')
  }

  onClick(): void {
    this.log('맥 버튼 클릭 이벤트 처리')
  }
}

abstract class Dialog {
  constructor(protected readonly log: Logger) {}

  protected abstract createButton(): Button

  renderDialog(): void {
    const button = this.createButton()
    button.render()
    button.onClick()
  }
}

class WindowsDialog extends Dialog {
  protected createButton(): Button {
    return new WindowsButton(this.log)
  }
}

class MacDialog extends Dialog {
  protected createButton(): Button {
    return new MacButton(this.log)
  }
}

type OsType = 'Windows' | 'Mac'

const logs = ref<string[]>([])
const selectedOs = ref<OsType>('Windows')

const addLog: Logger = (message) => {
  logs.value.push(message)
}

const clientApp = (osType: OsType, log: Logger) => {
  let dialog: Dialog

  if (osType === 'Windows') {
    dialog = new WindowsDialog(log)
  } else {
    dialog = new MacDialog(log)
  }

  dialog.renderDialog()
}

const runExample = () => {
  logs.value = []
  clientApp(selectedOs.value, addLog)
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
  color: #fff;
  border-color: #1d4ed8;
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

