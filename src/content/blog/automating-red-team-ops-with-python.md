---
title: "AUTOMATING RED TEAM OPS WITH PYTHON"
slug: "automating-red-team-ops-with-python"
category: "TOOLS"
date: "September 2025"
excerpt: "Scripts, frameworks and tooling patterns that save hours during engagements - recon to post-exploitation."
displayOrder: 8
---

Most of a red team engagement is not the exploit - it is the plumbing around it: parsing scan output, correlating hosts, and driving the same three tools a hundred times.
Python is the lingua franca for that glue, and a little structure turns throwaway scripts into a durable toolkit.

## Treat tooling like a product

The difference between a folder of one-off scripts and an actual toolkit is discipline:

- **Structured output everywhere.** Emit JSON, not print statements, so stages compose.
- **Idempotent stages.** Re-running recon should update state, never duplicate it.
- **A single source of truth** for scope and host state, so every tool reads the same target list.
- **Rate limiting and jitter** baked in, because loud automation is what gets an engagement caught early.

## A recon pattern worth stealing

The most reused shape is a bounded concurrent sweep: fan out across hosts, cap parallelism, collect structured results.
`asyncio` with a semaphore expresses it in a few lines.

```python
import asyncio, json

async def probe(host, sem):
    async with sem:                     # cap concurrency to stay quiet
        # ... run a check against `host`, return a dict ...
        return {"host": host, "alive": True}

async def sweep(hosts, limit=20):
    sem = asyncio.Semaphore(limit)
    results = await asyncio.gather(*(probe(h, sem) for h in hosts))
    print(json.dumps(results, indent=2))   # structured, pipeable output

asyncio.run(sweep(["10.0.0.1", "10.0.0.2"]))
```

The semaphore is the whole trick: it turns an unbounded, noisy blast into a controlled sweep whose footprint you can reason about.

## From recon to post-exploitation

The same patterns - structured state, bounded concurrency, jitter - carry straight into credential handling and lateral movement, which is where a later write-up will go.

_Detailed write-up coming soon._
