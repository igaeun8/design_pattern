<template>
  <section class="pattern">
    <header>
      <h1>프로토타입 패턴</h1>
      <p>
        기본이 되는 프로토타입 객체를 복제(clone)하여 새로운 객체를 빠르게 생성합니다. 원본을 수정하지 않고
        복제본을 커스터마이징할 수 있습니다.
      </p>
    </header>

    <div class="controls">
      <label>
        <span>기본 캐릭터</span>
        <select v-model="selectedPrototypeId">
          <option v-for="prototype in prototypes" :key="prototype.id" :value="prototype.id">
            {{ prototype.name }} ({{ prototype.role }})
          </option>
        </select>
      </label>

      <label>
        <span>새 캐릭터 이름</span>
        <input v-model="customName" type="text" placeholder="복제본 이름" />
      </label>

      <label>
        <span>추가 무기</span>
        <input v-model="customWeapon" type="text" placeholder="ex) 장궁" />
      </label>

      <button type="button" @click="cloneCharacter">복제하기</button>
    </div>

    <section class="result">
      <h2>생성된 캐릭터 목록</h2>
      <ul>
        <li v-for="(hero, index) in heroes" :key="hero.id">
          <strong>#{{ index + 1 }} {{ hero.name }}</strong>
          <span>{{ hero.role }} · 무기: {{ hero.weapon }}</span>
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

interface HeroPrototype {
  id: string
  name: string
  role: string
  weapon: string
  clone(customizer?: Partial<Omit<HeroPrototype, 'clone' | 'id'>>): HeroPrototypeInstance
}

interface HeroPrototypeInstance {
  id: string
  name: string
  role: string
  weapon: string
}

class WarriorPrototype implements HeroPrototype {
  id = 'warrior'
  name = '강철 기사'
  role = '탱커'
  weapon = '장검'

  constructor(private readonly log: Logger) {}

  clone(customizer?: Partial<Omit<HeroPrototype, 'clone' | 'id'>>): HeroPrototypeInstance {
    const copied: HeroPrototypeInstance = {
      id: crypto.randomUUID(),
      name: customizer?.name ?? this.name,
      role: customizer?.role ?? this.role,
      weapon: customizer?.weapon ?? this.weapon,
    }
    this.log(`워리어 프로토타입 복제 → ${copied.name}`)
    return copied
  }
}

class ArcherPrototype implements HeroPrototype {
  id = 'archer'
  name = '바람 궁수'
  role = '원거리 딜러'
  weapon = '활'

  constructor(private readonly log: Logger) {}

  clone(customizer?: Partial<Omit<HeroPrototype, 'clone' | 'id'>>): HeroPrototypeInstance {
    const copied: HeroPrototypeInstance = {
      id: crypto.randomUUID(),
      name: customizer?.name ?? this.name,
      role: customizer?.role ?? this.role,
      weapon: customizer?.weapon ?? this.weapon,
    }
    this.log(`아처 프로토타입 복제 → ${copied.name}`)
    return copied
  }
}

class MagePrototype implements HeroPrototype {
  id = 'mage'
  name = '비전 마법사'
  role = '버스트 딜러'
  weapon = '지팡이'

  constructor(private readonly log: Logger) {}

  clone(customizer?: Partial<Omit<HeroPrototype, 'clone' | 'id'>>): HeroPrototypeInstance {
    const copied: HeroPrototypeInstance = {
      id: crypto.randomUUID(),
      name: customizer?.name ?? this.name,
      role: customizer?.role ?? this.role,
      weapon: customizer?.weapon ?? this.weapon,
    }
    this.log(`메이지 프로토타입 복제 → ${copied.name}`)
    return copied
  }
}

const logs = ref<string[]>([])
const heroes = reactive<HeroPrototypeInstance[]>([])

const addLog: Logger = (message: string) => {
  logs.value.unshift(new Date().toLocaleTimeString() + ' · ' + message)
}

const prototypes = reactive<HeroPrototype[]>([
  new WarriorPrototype(addLog),
  new ArcherPrototype(addLog),
  new MagePrototype(addLog),
])

const selectedPrototypeId = ref<HeroPrototype['id']>('warrior')
const customName = ref('')
const customWeapon = ref('')

const cloneCharacter = () => {
  const prototype = prototypes.find((candidate) => candidate.id === selectedPrototypeId.value)

  if (!prototype) {
    addLog('⚠️ 선택한 프로토타입을 찾을 수 없습니다.')
    return
  }

  const cloned = prototype.clone({
    name: customName.value.trim() || undefined,
    weapon: customWeapon.value.trim() || undefined,
  })

  heroes.push(cloned)
  addLog(`✅ 새 캐릭터 생성: ${cloned.name} (${cloned.role})`)
  customName.value = ''
  customWeapon.value = ''
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
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.controls label {
  display: grid;
  gap: 0.5rem;
}

.controls input,
.controls select {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #c0c0c0;
  background-color: #fff;
}

.controls button {
  align-self: end;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #2563eb;
  background-color: #2563eb;
  color: #fff;
  cursor: pointer;
}

.result ul,
.logs ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.75rem;
}

.result li,
.logs li {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logs ul {
  gap: 0.5rem;
}
</style>

