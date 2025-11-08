<template>
  <section class="pattern">
    <header>
      <h1>커맨드 패턴</h1>
      <p>
        요청을 객체로 캡슐화하여 호출자(Invoker)와 실수행자(Receiver)를 분리합니다. 아래 예제에서는 스마트 홈 장치
        제어 명령을 큐에 쌓고 실행/취소할 수 있습니다.
      </p>
    </header>

    <div class="controls">
      <label>
        <span>명령 선택</span>
        <select v-model="selectedCommandKey">
          <option v-for="command in availableCommands" :key="command.key" :value="command.key">
            {{ command.label }}
          </option>
        </select>
      </label>

      <button type="button" @click="queueCommand">명령 추가</button>
      <button type="button" class="execute" @click="executeNext">실행</button>
      <button type="button" class="undo" @click="undoLast">실행 취소</button>
      <button type="button" class="reset" @click="reset">초기화</button>
    </div>

    <section class="status">
      <h2>장치 상태</h2>
      <ul>
        <li>조명: {{ receiver.lightOn ? '켜짐 💡' : '꺼짐 🌑' }}</li>
        <li>온도: {{ receiver.temperature }}℃</li>
        <li>보안 모드: {{ receiver.securityActive ? '활성화 🔒' : '비활성화 🔓' }}</li>
      </ul>
    </section>

    <section class="queue">
      <h2>대기 중인 명령</h2>
      <ul>
        <li v-if="invoker.pending.length === 0">대기열이 비어 있습니다.</li>
        <li v-for="(cmd, index) in invoker.pending" :key="cmd.id">
          #{{ index + 1 }} {{ cmd.label }}
        </li>
      </ul>
    </section>

    <section class="logs">
      <h2>로그</h2>
      <ul>
        <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

type Logger = (message: string) => void

interface Command {
  id: string
  label: string
  execute(): void
  undo(): void
}

class SmartHomeReceiver {
  lightOn = false
  temperature = 22
  securityActive = false

  constructor(private readonly log: Logger) {}

  turnOnLight(): void {
    this.lightOn = true
    this.log('조명을 켰습니다.')
  }

  turnOffLight(): void {
    this.lightOn = false
    this.log('조명을 껐습니다.')
  }

  increaseTemp(): void {
    this.temperature += 1
    this.log(`온도를 1℃ 올렸습니다. 현재 ${this.temperature}℃`)
  }

  decreaseTemp(): void {
    this.temperature -= 1
    this.log(`온도를 1℃ 내렸습니다. 현재 ${this.temperature}℃`)
  }

  activateSecurity(): void {
    this.securityActive = true
    this.log('보안 모드를 활성화했습니다.')
  }

  deactivateSecurity(): void {
    this.securityActive = false
    this.log('보안 모드를 비활성화했습니다.')
  }
}

class TurnLightOnCommand implements Command {
  public readonly id = crypto.randomUUID()
  public readonly label = '조명 켜기'
  constructor(private readonly receiver: SmartHomeReceiver) {}

  execute(): void {
    this.receiver.turnOnLight()
  }

  undo(): void {
    this.receiver.turnOffLight()
  }
}

class TurnLightOffCommand implements Command {
  public readonly id = crypto.randomUUID()
  public readonly label = '조명 끄기'
  constructor(private readonly receiver: SmartHomeReceiver) {}

  execute(): void {
    this.receiver.turnOffLight()
  }

  undo(): void {
    this.receiver.turnOnLight()
  }
}

class IncreaseTempCommand implements Command {
  public readonly id = crypto.randomUUID()
  public readonly label = '온도 +1℃'
  constructor(private readonly receiver: SmartHomeReceiver) {}

  execute(): void {
    this.receiver.increaseTemp()
  }

  undo(): void {
    this.receiver.decreaseTemp()
  }
}

class DecreaseTempCommand implements Command {
  public readonly id = crypto.randomUUID()
  public readonly label = '온도 -1℃'
  constructor(private readonly receiver: SmartHomeReceiver) {}

  execute(): void {
    this.receiver.decreaseTemp()
  }

  undo(): void {
    this.receiver.increaseTemp()
  }
}

class ActivateSecurityCommand implements Command {
  public readonly id = crypto.randomUUID()
  public readonly label = '보안 모드 활성화'
  constructor(private readonly receiver: SmartHomeReceiver) {}

  execute(): void {
    this.receiver.activateSecurity()
  }

  undo(): void {
    this.receiver.deactivateSecurity()
  }
}

class DeactivateSecurityCommand implements Command {
  public readonly id = crypto.randomUUID()
  public readonly label = '보안 모드 비활성화'
  constructor(private readonly receiver: SmartHomeReceiver) {}

  execute(): void {
    this.receiver.deactivateSecurity()
  }

  undo(): void {
    this.receiver.activateSecurity()
  }
}

class CommandInvoker {
  pending: Command[] = []
  history: Command[] = []

  constructor(private readonly log: Logger) {}

  add(command: Command): void {
    this.pending.push(command)
    this.log(`📝 명령 추가: ${command.label}`)
  }

  executeNext(): void {
    const command = this.pending.shift()
    if (!command) {
      this.log('⚠️ 대기 중인 명령이 없습니다.')
      return
    }
    command.execute()
    this.history.push(command)
    this.log(`▶ 실행 완료: ${command.label}`)
  }

  undo(): void {
    const last = this.history.pop()
    if (!last) {
      this.log('⚠️ 되돌릴 명령이 없습니다.')
      return
    }
    last.undo()
    this.log(`↩ 실행 취소: ${last.label}`)
  }

  reset(): void {
    this.pending = []
    this.history = []
    this.log('🧹 명령 큐와 기록을 초기화했습니다.')
  }
}

const logs = ref<string[]>([])
const addLog: Logger = (message) => {
  logs.value.unshift(new Date().toLocaleTimeString() + ' · ' + message)
}

const receiver = reactive(new SmartHomeReceiver(addLog))
const invoker = reactive(new CommandInvoker(addLog))

const availableCommands = ref([
  { key: 'light-on', label: '조명 켜기', factory: () => new TurnLightOnCommand(receiver) },
  { key: 'light-off', label: '조명 끄기', factory: () => new TurnLightOffCommand(receiver) },
  { key: 'temp-up', label: '온도 +1℃', factory: () => new IncreaseTempCommand(receiver) },
  { key: 'temp-down', label: '온도 -1℃', factory: () => new DecreaseTempCommand(receiver) },
  { key: 'security-on', label: '보안 모드 활성화', factory: () => new ActivateSecurityCommand(receiver) },
  { key: 'security-off', label: '보안 모드 비활성화', factory: () => new DeactivateSecurityCommand(receiver) },
])

const selectedCommandKey = ref(availableCommands.value[0]?.key ?? '')

const queueCommand = () => {
  const commandInfo = availableCommands.value.find((item) => item.key === selectedCommandKey.value)
  if (!commandInfo) return
  invoker.add(commandInfo.factory())
}

const executeNext = () => {
  invoker.executeNext()
}

const undoLast = () => {
  invoker.undo()
}

const reset = () => {
  invoker.reset()
  receiver.lightOn = false
  receiver.temperature = 22
  receiver.securityActive = false
}
</script>

<style scoped>
.pattern {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  background-color: #fafafa;
  max-width: 960px;
  margin: 0 auto;
}

header > h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
}

.controls {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  align-items: end;
}

.controls label {
  display: grid;
  gap: 0.5rem;
}

.controls select {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #c0c0c0;
  background-color: #fff;
}

.controls button {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #2563eb;
  background-color: #2563eb;
  color: #fff;
  cursor: pointer;
}

.controls button.execute {
  border-color: #16a34a;
  background-color: #22c55e;
}

.controls button.undo {
  border-color: #f97316;
  background-color: #fb923c;
}

.controls button.reset {
  border-color: #6b7280;
  background-color: #9ca3af;
}

.status ul,
.queue ul,
.logs ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;
}

.queue li,
.logs li,
.status li {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
}

.logs ul {
  gap: 0.35rem;
}
</style>

