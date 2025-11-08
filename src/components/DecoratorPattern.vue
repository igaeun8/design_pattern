<template>
  <section class="pattern">
    <header>
      <h1>데코레이터 패턴</h1>
      <p>
        알림 전송 기능 위에 부가 기능을 동적으로 쌓아 올립니다. 각 채널은 데코레이터로 구현되어, 조합에 따라
        다른 전송 흐름을 만들 수 있습니다.
      </p>
    </header>

    <div class="controls">
      <label class="field">
        <span>메시지</span>
        <input v-model="message" type="text" placeholder="알림 내용을 입력하세요" />
      </label>

      <fieldset class="field toggles">
        <legend>사용할 알림 채널</legend>
        <label>
          <input v-model="useEmail" type="checkbox" /> 이메일
        </label>
        <label>
          <input v-model="useSms" type="checkbox" /> SMS
        </label>
        <label>
          <input v-model="useSlack" type="checkbox" /> Slack
        </label>
      </fieldset>

      <button type="button" @click="runExample">알림 보내기</button>
    </div>

    <ul class="logs">
      <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Logger = (message: string) => void

interface Notifier {
  send(message: string): void
}

class BaseNotifier implements Notifier {
  constructor(private readonly log: Logger) {}

  send(message: string): void {
    this.log(`기본 알림: ${message}`)
  }
}

abstract class NotifierDecorator implements Notifier {
  constructor(protected readonly wrappee: Notifier, protected readonly log: Logger) {}

  send(message: string): void {
    this.wrappee.send(message)
  }
}

class EmailNotifier extends NotifierDecorator {
  send(message: string): void {
    super.send(message)
    this.log(`이메일 발송: ${message}`)
  }
}

class SMSNotifier extends NotifierDecorator {
  send(message: string): void {
    super.send(message)
    this.log(`SMS 발송: ${message}`)
  }
}

class SlackNotifier extends NotifierDecorator {
  send(message: string): void {
    super.send(message)
    this.log(`Slack 발송: ${message}`)
  }
}

const message = ref('긴급 서버 장애 발생!')
const useEmail = ref(true)
const useSms = ref(true)
const useSlack = ref(true)
const logs = ref<string[]>([])

const addLog: Logger = (entry) => {
  logs.value.push(entry)
}

const buildNotifier = (): Notifier => {
  let notifier: Notifier = new BaseNotifier(addLog)

  if (useEmail.value) {
    notifier = new EmailNotifier(notifier, addLog)
  }

  if (useSms.value) {
    notifier = new SMSNotifier(notifier, addLog)
  }

  if (useSlack.value) {
    notifier = new SlackNotifier(notifier, addLog)
  }

  return notifier
}

const runExample = () => {
  logs.value = []
  const notifier = buildNotifier()
  notifier.send(message.value)
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

.field {
  display: grid;
  gap: 0.5rem;
}

.field input[type='text'] {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #c0c0c0;
  font-size: 1rem;
}

.toggles {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.toggles label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
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

