<template>
  <section class="pattern">
    <header>
      <h1>방문자 패턴</h1>
      <p>
        파일 시스템 구조는 그대로 유지하면서, 서로 다른 연산(총 크기 계산, 이름 목록 출력)을 방문자로 분리합니다.
        방문자는 구조를 순회하며 필요한 로직을 수행합니다.
      </p>
    </header>

    <div class="controls">
      <label class="field">
        <span>루트 폴더명</span>
        <input v-model="folderName" type="text" />
      </label>

      <div class="files">
        <h2>포함 파일</h2>
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>크기(KB)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in files" :key="file.id">
              <td>
                <input v-model="file.name" type="text" />
              </td>
              <td>
                <input v-model.number="file.size" type="number" min="0" step="1" />
              </td>
              <td>
                <button type="button" class="remove" @click="removeFile(file.id)">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="add" @click="addFile">파일 추가</button>
      </div>

      <fieldset class="field toggles">
        <legend>실행할 방문자</legend>
        <label>
          <input v-model="useSizeVisitor" type="checkbox" /> 총 크기 계산기
        </label>
        <label>
          <input v-model="useNameVisitor" type="checkbox" /> 이름 출력기
        </label>
      </fieldset>

      <button type="button" class="run" @click="runExample">방문자 실행</button>
    </div>

    <ul class="logs">
      <li v-for="(log, index) in logs" :key="index">{{ log }}</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Logger = (message: string) => void

interface Visitor {
  visitFile(file: FileElement): void
  visitFolder(folder: FolderElement): void
}

interface Element {
  accept(visitor: Visitor): void
}

class FileElement implements Element {
  constructor(public readonly name: string, public readonly size: number) {}

  accept(visitor: Visitor): void {
    visitor.visitFile(this)
  }
}

class FolderElement implements Element {
  constructor(public readonly name: string, public readonly children: Element[] = []) {}

  accept(visitor: Visitor): void {
    visitor.visitFolder(this)
  }
}

class SizeCalculator implements Visitor {
  private totalSize = 0

  constructor(private readonly log: Logger) {}

  visitFile(file: FileElement): void {
    this.totalSize += file.size
    this.log(`파일 크기 누적: ${file.name} = ${file.size}KB`)
  }

  visitFolder(folder: FolderElement): void {
    this.log(`폴더 진입: ${folder.name}`)
    folder.children.forEach((child) => child.accept(this))
  }

  getTotalSize(): number {
    return this.totalSize
  }
}

class NamePrinter implements Visitor {
  constructor(private readonly log: Logger) {}

  visitFile(file: FileElement): void {
    this.log(`파일: ${file.name}`)
  }

  visitFolder(folder: FolderElement): void {
    this.log(`폴더: ${folder.name}`)
    folder.children.forEach((child) => child.accept(this))
  }
}

type FileEntry = {
  id: number
  name: string
  size: number
}

const logs = ref<string[]>([])
const folderName = ref('docs')
const files = ref<FileEntry[]>([
  { id: 1, name: 'a.txt', size: 10 },
  { id: 2, name: 'b.txt', size: 20 },
])
const useSizeVisitor = ref(true)
const useNameVisitor = ref(true)
let nextId = 3

const addLog: Logger = (entry) => {
  logs.value.push(entry)
}

const addFile = () => {
  files.value.push({ id: nextId++, name: `file-${nextId}.txt`, size: 5 })
}

const removeFile = (id: number) => {
  files.value = files.value.filter((file) => file.id !== id)
}

const buildStructure = (): FolderElement => {
  const children = files.value.map((file) => new FileElement(file.name, file.size))
  return new FolderElement(folderName.value, children)
}

const runExample = () => {
  logs.value = []
  const root = buildStructure()

  if (useSizeVisitor.value) {
    const sizeVisitor = new SizeCalculator(addLog)
    root.accept(sizeVisitor)
    addLog(`총 크기: ${sizeVisitor.getTotalSize()}KB`)
  }

  if (useNameVisitor.value) {
    const nameVisitor = new NamePrinter(addLog)
    root.accept(nameVisitor)
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
}

.files {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: grid;
  gap: 0.75rem;
}

.files table {
  width: 100%;
  border-collapse: collapse;
}

.files th,
.files td {
  border-bottom: 1px solid #e5e7eb;
  padding: 0.5rem;
  text-align: left;
}

.files tbody tr:last-child td {
  border-bottom: none;
}

.files input[type='text'],
.files input[type='number'] {
  width: 100%;
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #c0c0c0;
}

.files button {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e11d48;
  background-color: #f87171;
  color: #fff;
  cursor: pointer;
}

.files button.add {
  border-color: #1d4ed8;
  background-color: #2563eb;
}

fieldset.toggles {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.run {
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

