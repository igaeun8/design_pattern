<template>
  <section class="pattern">
    <header>
      <h1>컴포지트 패턴</h1>
      <p>
        개별 객체(Leaf)와 복합 객체(Composite)를 동일하게 다루어 계층 구조를 구성합니다. 아래 예제에서는
        프로젝트 작업 항목을 트리 구조로 관리하고 전체 예상 시간을 계산합니다.
      </p>
    </header>

    <div class="controls">
      <label>
        <span>새 작업 이름</span>
        <input v-model="newTaskName" type="text" placeholder="ex) UI 설계" />
      </label>

      <label>
        <span>예상 시간 (시간)</span>
        <input v-model.number="newTaskHours" type="number" min="1" step="1" />
      </label>

      <label>
        <span>추가 위치</span>
        <select v-model="selectedCompositeId">
          <option v-for="option in compositeOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
      </label>

      <button type="button" @click="addTask">작업 추가</button>
    </div>

    <section class="summary">
      <strong>총 예상 시간:</strong>
      <span>{{ root.estimate() }} 시간</span>
    </section>

    <section class="tree">
      <h2>작업 트리</h2>
      <TaskNode :node="root" />
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, PropType, reactive, ref } from 'vue'

interface WorkUnit {
  id: string
  name: string
  estimate(): number
}

class Task implements WorkUnit {
  public readonly id = crypto.randomUUID()
  constructor(
    public name: string,
    private readonly hours: number,
  ) {}

  estimate(): number {
    return this.hours
  }
}

class TaskGroup implements WorkUnit {
  public readonly id = crypto.randomUUID()
  public children: WorkUnit[] = []

  constructor(
    public name: string,
    private readonly hours: number = 0,
  ) {}

  add(child: WorkUnit): void {
    this.children.push(child)
  }

  estimate(): number {
    return this.hours + this.children.reduce((total, child) => total + child.estimate(), 0)
  }
}

const root = reactive(
  Object.assign(new TaskGroup('신규 서비스 런칭 프로젝트'), {
    children: [
      Object.assign(new TaskGroup('기획'), {
        children: [new Task('요구사항 정의', 8), new Task('와이어프레임', 12)],
      }),
      Object.assign(new TaskGroup('개발'), {
        children: [
          new Task('프론트엔드 환경 구성', 6),
          new Task('디자인 시스템 구축', 10),
          new Task('백엔드 API 설계', 14),
        ],
      }),
    ],
  }),
) as TaskGroup

const newTaskName = ref('')
const newTaskHours = ref(4)
const selectedCompositeId = ref(root.id)

const compositeOptions = computed(() => {
  const options: Array<{ id: string; label: string }> = []

  const traverse = (node: WorkUnit, prefix = '') => {
    if (node instanceof TaskGroup) {
      options.push({ id: node.id, label: `${prefix}${node.name}` })
      node.children.forEach((child) => traverse(child, prefix + '· '))
    }
  }

  traverse(root)
  return options
})

const findComposite = (node: WorkUnit, id: string): TaskGroup | null => {
  if (node instanceof TaskGroup) {
    if (node.id === id) return node
    for (const child of node.children) {
      const found = findComposite(child, id)
      if (found) return found
    }
  }
  return null
}

const TaskNode = defineComponent({
  name: 'TaskNode',
  props: {
    node: {
      type: Object as PropType<WorkUnit>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const isGroup = props.node instanceof TaskGroup
      return h('div', { class: 'task-node' }, [
        h('div', { class: 'task-node__info' }, [
          h('strong', props.node.name),
          h('span', `${props.node.estimate()} 시간`),
        ]),
        isGroup && props.node.children.length > 0
          ? h(
              'div',
              { class: 'task-node__children' },
              props.node.children.map((child) => h(TaskNode, { key: child.id, node: child })),
            )
          : null,
      ])
    }
  },
})

const addTask = () => {
  if (!newTaskName.value.trim() || newTaskHours.value <= 0) return

  const parent = findComposite(root, selectedCompositeId.value)
  if (!parent) return

  parent.add(new Task(newTaskName.value.trim(), newTaskHours.value))
  newTaskName.value = ''
  newTaskHours.value = 4
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
  border: 1px solid #047857;
  background-color: #059669;
  color: #fff;
  cursor: pointer;
}

.summary {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  font-size: 1.125rem;
}

.tree {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  background-color: #fff;
}

.tree h2 {
  margin-top: 0;
}

.task-node {
  border-left: 2px solid #cbd5f5;
  margin-left: 0.75rem;
  padding-left: 0.75rem;
  margin-top: 0.75rem;
}

.task-node__info {
  display: flex;
  justify-content: space-between;
  background-color: #eff6ff;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #bfdbfe;
}

.task-node__children {
  margin-top: 0.5rem;
}
</style>

