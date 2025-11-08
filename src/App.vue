<template>
  <main class="home">
    <section class="intro">
      <h1>GoF 디자인 패턴 데모</h1>
      <p>아래 링크를 눌러 각 패턴 예제를 개별 페이지로 실행해 보세요.</p>
    </section>

    <ul class="links">
      <li><a href="/factory.html">팩토리 메서드 패턴</a></li>
      <li><a href="/adapter.html">어댑터 패턴</a></li>
      <li><a href="/decorator.html">데코레이터 패턴</a></li>
      <li><a href="/observer.html">옵저버 패턴</a></li>
      <li><a href="/singleton.html">싱글톤 패턴</a></li>
      <li><a href="/visitor.html">방문자 패턴</a></li>
    </ul>
  </main>
</template>

<style scoped>
.home {
  min-height: 100vh;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  max-width: 960px;
  display: grid;
  gap: 2rem;
  align-content: flex-start;
}

.intro h1 {
  margin: 0 0 0.75rem;
  font-size: 2rem;
}

.links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.links a {
  display: block;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background-color: #f9fafb;
  color: #111827;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.links a:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
}
</style>
