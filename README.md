<a> <picture> <source media="(prefers-color-scheme: dark)" srcset="./docs/assets/banner.png" /> <source media="(prefers-color-scheme: light)" srcset="./docs/assets/banner.png" /> <img alt="React Native Math" src="./docs/assets/banner.png" /> </picture> </a> <br />

> **rn-math** — an experimental, native-backed math engine for React Native.

> **Status (straight):** performance is *not* meeting expectations yet. I am planning to implement **direct native GPU integration** next; once GPU support and thorough testing are in place we will target a stable release where the expected performance improvements will be delivered. Until then, do **not** rely on rn-math for large-performance gains in production.

---

## ⚠️ Experimental — Read this first

**Important:** `rn-math` is experimental. It exposes a C++/native-backed engine (via Nitro modules) to accelerate advanced math. That means:

* It can give massive speed-ups for *large-scale* operations — but for tiny arrays or trivial math, plain JavaScript is still faster due to native call overhead.
* API and internals may change while the project stabilizes.
* Mobile platform differences may affect numeric behavior and performance; test on your target devices.
* If you're building production-critical features (finance, medical, safety systems), **bench and audit** before shipping.

If you’re not sure whether this lib is a fit, prefer: plain JS or a WebAssembly approach unless your workloads are large enough to amortize the native-call cost.

---

## Quick install

```bash
npm install rn-math
# or
yarn add rn-math
```

> Works on iOS and Android. Follow platform-specific native build steps if your environment requires extra linking (Expo/managed workflow notes below).

---

## When to use rn-math (short)

* ⚠️ **Intended for** large-scale numerical work (large matrices, signal pipelines, ML helpers) — but: **current builds may not deliver the expected speedups.**
* ✅ Use if you want to experiment with a native-backed math engine and help test features.
* ❌ Do **not** use rn-math in production expecting big performance wins yet — wait for the GPU integration and stable release.

---

## API snapshot

Minimal examples to get rolling. `MathLibrary` is the default export.

### Linear algebra

```ts
const algebra = MathLibrary.algebra;
const mA = algebra.matrix.from([[1,2],[3,4]]);
const mB = algebra.matrix.identity(2);
const mul = algebra.matrix.mul(mA, mB);
const det = algebra.matrix.det(mA);
```

### Vectors

```ts
const vector = MathLibrary.algebra.vector;
const dot = vector.dot([1,2,3], [4,5,6]);
const norm = vector.normalize([10, 0, 0]);
```

### FFT / Signal

```ts
const [real, imag] = MathLibrary.signal.fft(realInput, imagInput);
const convolved = MathLibrary.signal.convolve(signal, kernel);
```

### Statistics & Random

```ts
const mean = MathLibrary.statistics.mean(data);
const normalSamples = MathLibrary.random.normal(1000, 0, 1);
```

### Machine learning helpers

```ts
const [slope, intercept] = MathLibrary.ml.linearRegression(X, y);
```

---

## Performance — current status

Short and honest: the library **has not** achieved the performance targets advertised earlier. Benchmarks in the repo should be considered preliminary and, in some cases, optimistic. We are pausing broad performance claims until the next major workstream — **native GPU integration** — is implemented and validated.

What this means for you:

* The current release may not show large speedups for many real-world workloads.
* We will focus next on direct GPU paths (native compute on device GPUs) and careful cross-device testing.
* A stable release with realistic performance expectations will follow after GPU integration and validation.

If you depend on reliable speed improvements today, do not adopt rn-math for production workloads that require those gains. We appreciate early testers and contributors who can help validate GPU work when it lands.

---

## Best practices & tips

* **Batch work**: Combine many small ops into larger ones when possible to amortize native call cost.
* **Warm-up**: On first-run the native module may need to JIT/Warm caches — include warm-up runs in benchmarks.
* **Memory**: Large matrices allocate native buffers — be mindful of memory on low-end devices.
* **Threading**: Computation runs on native threads; avoid blocking UI by running heavier flows off the main JS loop.

---

## Expo / Managed workflows

Using `rn-math` with Expo managed workflow may need custom dev clients or prebuilds because of native C++ modules. If you’re using the managed Expo client, prefer building a custom dev client or EAS-build to include native modules.

---

## Contributing

Contributions are welcome. If you want to help:

1. Check open issues and feature requests.
2. Run the benchmarks and add **device-specific results when possible.**
3. Open PRs for bugfixes, new algos, docs, or CI improvements.

Please follow the code style and include tests for numeric changes.

---

## Known limitations

* Experimental API surface; breaking changes are possible.
* Not optimized for tiny arrays or scalar-bound loops.
* Platform FP consistency is not guaranteed — validate on target devices.

---

## License

MIT — see [LICENSE](LICENSE).
