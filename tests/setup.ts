import "@testing-library/jest-dom/vitest";

class IntersectionObserverMock {
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}

if (!("IntersectionObserver" in globalThis)) {
  // @ts-expect-error - define global for jsdom
  globalThis.IntersectionObserver = IntersectionObserverMock;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

