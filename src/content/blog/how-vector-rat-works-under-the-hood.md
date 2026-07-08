---
title: "HOW VECTOR RAT WORKS UNDER THE HOOD"
slug: "how-vector-rat-works-under-the-hood"
category: "SECURITY"
date: "April 2026"
excerpt: "A technical deep dive into the architecture of Vector Rat - remote access, persistence mechanisms, and the C# internals."
displayOrder: 1
---

> **Scope.** Vector Rat is a remote administration tool built for authorized red-team engagements and lab research.
> This article explains its *architecture* so defenders can recognise the shape of tools like it.
> It does not contain deployment instructions, evasion payloads, or anything you can point at a system you do not own.

Remote administration tools all share the same skeleton, whether they are legitimate IT software or offensive tooling: an agent, a controller, and a channel between them.
Understanding that skeleton is what lets a blue team spot one, so this is written from the defender's side of the glass.

## The three components

Every RAT decomposes into the same three parts:

- **The agent** - runs on the target, executes tasks, reports results.
- **The controller** - the operator's console, issues tasks and stores results.
- **The transport** - how the two talk, and how that traffic tries to look ordinary.

The interesting engineering - and the interesting detection opportunities - live in how those parts are decoupled.

## Task dispatch: the part worth understanding

A well-built agent does not hard-code its capabilities.
It exposes a registry of *commands*, each behind a common interface.
Here is the pattern, in C#, reduced to its essentials:

```csharp
public interface IAgentTask
{
    string Name { get; }
    Task<TaskResult> ExecuteAsync(TaskContext ctx, CancellationToken token);
}

// The dispatcher is deliberately dumb: it looks up a name and runs it.
public sealed class TaskDispatcher
{
    private readonly Dictionary<string, IAgentTask> _tasks;

    public TaskDispatcher(IEnumerable<IAgentTask> tasks) =>
        _tasks = tasks.ToDictionary(t => t.Name, StringComparer.OrdinalIgnoreCase);

    public async Task<TaskResult> RunAsync(string name, TaskContext ctx, CancellationToken ct)
    {
        if (!_tasks.TryGetValue(name, out var task))
            return TaskResult.Unknown(name);

        return await task.ExecuteAsync(ctx, ct);
    }
}
```

This registry pattern is why RATs are modular: new capabilities are new `IAgentTask` classes, and the transport never changes.
It is also a **detection insight** - the dispatch loop is a tight, predictable state machine (receive task -> resolve handler -> execute -> serialize result), and its behavioural fingerprint is far more stable than any single payload's signature.

## The beacon loop

Agents do not hold open connections and wait; that is loud.
They *beacon* - wake on an interval, ask "is there work for me", act, sleep.
Conceptually:

```csharp
while (!token.IsCancellationRequested)
{
    var jobs = await _transport.PollAsync(token);   // check in
    foreach (var job in jobs)
        await _dispatcher.RunAsync(job.Task, ctx, token);

    await Task.Delay(_jitter.Next(), token);        // sleep with jitter
}
```

The `_jitter` matters. A fixed beacon interval draws a perfect line on a traffic graph; jitter smears it.
For defenders, that is exactly the tell: beaconing with *bounded randomness* still clusters, and check-in interval analysis (mean, variance, and the gaps between connections to a single destination) remains one of the most reliable network-level detections for tools in this class.

## Persistence, in the abstract

Persistence is just "survive a reboot", and on any OS it reduces to a small set of hook points the operating system offers to *legitimate* software: scheduled tasks, service definitions, login/init hooks, and autostart entries.
There is nothing exotic here, and that is the point for defenders - the same enumeration that inventories your legitimate autostart surface also surfaces the illegitimate one.
Monitoring *changes* to those hook points is worth more than chasing any specific implant.

## What this means if you defend

If you take three things from the internals above:

1. **The dispatch loop is the stable part.** Behavioural detection beats signature detection because operators can re-skin payloads but rarely rewrite the control flow.
2. **Beaconing has a statistical shape.** Interval and jitter analysis on egress traffic finds it even when the payload is unknown.
3. **Persistence uses documented OS features.** Inventory and diff them; you do not need to know the tool to see the change.

Building Vector Rat taught us how these tools are engineered.
Publishing how they are engineered is the part that helps the people defending against them.
