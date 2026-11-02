// OmniSync High-Throughput Real-Time Engine Script
// Architected for Muhammad Aurangzeb's Production Portfolio

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Mobile Navigation Toggle
  // ==========================================
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // ==========================================
  // 2. Animated Pipeline Canvas Engine
  // ==========================================
  const canvas = document.getElementById('pipelineCanvas');
  const board = document.getElementById('pipelineBoard');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let packets = [];
  let isFlowing = true;
  let animId = null;

  function resizeCanvas() {
    if (!canvas || !board) return;
    const rect = board.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Helper: Get center coordinates of an element relative to board
  function getNodeCenter(el) {
    if (!el || !board) return null;
    const boardRect = board.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      x: (elRect.left - boardRect.left) + elRect.width / 2,
      y: (elRect.top - boardRect.top) + elRect.height / 2,
      left: elRect.left - boardRect.left,
      right: elRect.right - boardRect.left
    };
  }

  const sourceElements = Array.from(document.querySelectorAll('.source-node'));
  const sinkElements = Array.from(document.querySelectorAll('.sink-node'));
  const coreElement = document.getElementById('coreNode');

  class DataPacket {
    constructor(speedMultiplier = 1) {
      this.speedMultiplier = speedMultiplier;
      this.reset();
    }

    reset() {
      if (!board || sourceElements.length === 0 || sinkElements.length === 0 || !coreElement) {
        this.x = 0; this.y = 0; this.active = false;
        return;
      }
      this.active = true;
      this.sourceNode = sourceElements[Math.floor(Math.random() * sourceElements.length)];
      this.sinkNode = sinkElements[Math.floor(Math.random() * sinkElements.length)];

      const sPos = getNodeCenter(this.sourceNode);
      const cPos = getNodeCenter(coreElement);
      const tPos = getNodeCenter(this.sinkNode);

      if (!sPos || !cPos || !tPos) {
        this.active = false;
        return;
      }

      this.p0 = { x: sPos.right, y: sPos.y };
      this.p1 = { x: cPos.left, y: cPos.y + (Math.random() - 0.5) * 40 };
      this.p2 = { x: cPos.right, y: cPos.y + (Math.random() - 0.5) * 40 };
      this.p3 = { x: tPos.left, y: tPos.y };

      this.stage = 1; // 1: Source -> Core, 2: Inside Core, 3: Core -> Sink
      this.progress = Math.random() * 0.1;
      this.speed = (0.006 + Math.random() * 0.006) * this.speedMultiplier;
      this.radius = 2.5 + Math.random() * 2;
      
      const colors = ['#06b6d4', '#14b8a6', '#8b5cf6', '#38bdf8'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.coreWait = 0;
      this.maxCoreWait = 10 + Math.random() * 15;
    }

    update() {
      if (!this.active) return;
      if (this.stage === 1) {
        this.progress += this.speed;
        if (this.progress >= 1) {
          this.stage = 2;
          this.progress = 0;
        }
      } else if (this.stage === 2) {
        this.coreWait++;
        if (this.coreWait >= this.maxCoreWait) {
          this.stage = 3;
          this.progress = 0;
        }
      } else if (this.stage === 3) {
        this.progress += this.speed * 1.1;
        if (this.progress >= 1) {
          this.reset();
        }
      }
    }

    draw() {
      if (!this.active || !ctx) return;
      let currX, currY;

      if (this.stage === 1) {
        // Quadratic bezier from source to core
        const cpX = (this.p0.x + this.p1.x) / 2;
        const cpY = this.p0.y + (this.p1.y - this.p0.y) * 0.2;
        const t = this.progress;
        currX = (1 - t) * (1 - t) * this.p0.x + 2 * (1 - t) * t * cpX + t * t * this.p1.x;
        currY = (1 - t) * (1 - t) * this.p0.y + 2 * (1 - t) * t * cpY + t * t * this.p1.y;
      } else if (this.stage === 2) {
        // Inside core pulse
        const cPos = getNodeCenter(coreElement);
        if (!cPos) return;
        currX = cPos.x + (Math.random() - 0.5) * 20;
        currY = cPos.y + (Math.random() - 0.5) * 20;
      } else {
        // Quadratic bezier from core to sink
        const cpX = (this.p2.x + this.p3.x) / 2;
        const cpY = this.p2.y + (this.p3.y - this.p2.y) * 0.2;
        const t = this.progress;
        currX = (1 - t) * (1 - t) * this.p2.x + 2 * (1 - t) * t * cpX + t * t * this.p3.x;
        currY = (1 - t) * (1 - t) * this.p2.y + 2 * (1 - t) * t * cpY + t * t * this.p3.y;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(currX, currY, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    }
  }

  // Draw subtle connection guide curves
  function drawConnectionGuides() {
    if (!ctx || !coreElement || sourceElements.length === 0 || sinkElements.length === 0) return;
    const cPos = getNodeCenter(coreElement);
    if (!cPos) return;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';

    // Source to Core
    sourceElements.forEach(src => {
      const sPos = getNodeCenter(src);
      if (!sPos) return;
      ctx.beginPath();
      ctx.moveTo(sPos.right, sPos.y);
      const cpX = (sPos.right + cPos.left) / 2;
      ctx.quadraticCurveTo(cpX, sPos.y, cPos.left, cPos.y);
      ctx.stroke();
    });

    // Core to Sinks
    sinkElements.forEach(snk => {
      const tPos = getNodeCenter(snk);
      if (!tPos) return;
      ctx.beginPath();
      ctx.moveTo(cPos.right, cPos.y);
      const cpX = (cPos.right + tPos.left) / 2;
      ctx.quadraticCurveTo(cpX, tPos.y, tPos.left, tPos.y);
      ctx.stroke();
    });

    ctx.restore();
  }

  // Initialize 35 packets
  for (let i = 0; i < 35; i++) {
    packets.push(new DataPacket());
  }

  function animateCanvas() {
    if (ctx && board) {
      const boardRect = board.getBoundingClientRect();
      ctx.clearRect(0, 0, boardRect.width, boardRect.height);

      drawConnectionGuides();

      if (isFlowing) {
        packets.forEach(p => {
          p.update();
          p.draw();
        });
      }
    }
    animId = requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // Traffic Flow Toggle Controls
  const toggleFlowBtn = document.getElementById('toggleFlowBtn');
  const flowIcon = document.getElementById('flowIcon');
  const flowBtnText = document.getElementById('flowBtnText');

  if (toggleFlowBtn) {
    toggleFlowBtn.addEventListener('click', () => {
      isFlowing = !isFlowing;
      if (isFlowing) {
        flowIcon.className = 'fa-solid fa-pause text-cyan-400';
        flowBtnText.textContent = 'Pause Traffic Flow';
        showToast('Traffic stream resumed. Active packet dispatcher online.');
      } else {
        flowIcon.className = 'fa-solid fa-play text-amber-400';
        flowBtnText.textContent = 'Resume Traffic Flow';
        showToast('Traffic stream suspended. Ingress queues holding in Redis buffer.');
      }
    });
  }

  // Inject Burst Spikes
  const injectSpikeBtn = document.getElementById('injectSpikeBtn');
  if (injectSpikeBtn) {
    injectSpikeBtn.addEventListener('click', () => {
      for (let i = 0; i < 25; i++) {
        packets.push(new DataPacket(2.2));
      }
      // Prune after 4 seconds
      setTimeout(() => {
        packets = packets.slice(0, 40);
      }, 4000);

      const coreConsole = document.getElementById('coreConsole');
      if (coreConsole) {
        const div = document.createElement('div');
        div.className = 'text-amber-400 font-bold';
        div.textContent = `> [${new Date().toLocaleTimeString()}] INGESTION BURST: Dispatched +3,500 synthetic events into Redis BullMQ buffer!`;
        coreConsole.appendChild(div);
        coreConsole.scrollTop = coreConsole.scrollHeight;
      }
      showToast('Event Burst Dispatched: +3,500 synthetic payload events in flight.');
    });
  }


  // ==========================================
  // 3. Node Inspector Modal System
  // ==========================================
  const nodeMetadata = {
    pg: {
      title: 'PostgreSQL Primary Database',
      subtitle: 'PostgreSQL 16 &bull; Logical Decoding (test_decoding plugin)',
      icon: 'fa-solid fa-database',
      iconColor: 'bg-blue-500/20 text-blue-400',
      stats: [
        { label: 'INGRESS RATE', value: '1,420 evt/s' },
        { label: 'REPLICATION LAG', value: '0.8 ms' },
        { label: 'SLOT STATUS', value: 'ACTIVE_STREAM' }
      ],
      details: [
        '<b>WAL Slot:</b> omnisync_wal_stream (LSN 0/14B2D98)',
        '<b>Target Tables:</b> public.users, public.orders, public.transactions',
        '<b>TLS Security:</b> Verify-Full (TLS 1.3 &bull; AES-256-GCM)',
        '<b>Failover Protection:</b> 3 Replica Read Pool configured'
      ]
    },
    stripe: {
      title: 'Stripe Payment Ingress Gateway',
      subtitle: 'Stripe API 2024-06 &bull; Webhook Dispatcher',
      icon: 'fa-brands fa-stripe-s',
      iconColor: 'bg-violet-500/20 text-violet-400',
      stats: [
        { label: 'INGRESS RATE', value: '480 evt/s' },
        { label: 'SIGNATURE CHECK', value: 'HMAC_SHA256' },
        { label: 'SUCCESS RATE', value: '99.99%' }
      ],
      details: [
        '<b>Webhook Endpoint:</b> /v1/webhooks/stripe/charges',
        '<b>Subscribed Topics:</b> charge.succeeded, customer.subscription.updated',
        '<b>Idempotency Validation:</b> Key TTL 86,400s inside Redis cluster',
        '<b>Replay Defense:</b> Tolerance limit 300 seconds enforced'
      ]
    },
    github: {
      title: 'GitHub Enterprise Ingress Bridge',
      subtitle: 'GitHub REST & GraphQL API v4 &bull; Event Webhooks',
      icon: 'fa-brands fa-github',
      iconColor: 'bg-slate-700/50 text-slate-200',
      stats: [
        { label: 'INGRESS RATE', value: '210 evt/s' },
        { label: 'API QUOTA', value: '4,980 / 5,000' },
        { label: 'DELIVERY P99', value: '3.4 ms' }
      ],
      details: [
        '<b>Hook Scope:</b> issues, pull_request, workflow_run, push',
        '<b>Payload Parser:</b> Stream JSON deserializer with zero heap allocations',
        '<b>Secret Verification:</b> SHA-256 HMAC Header X-Hub-Signature-256',
        '<b>Auto-Retry Policy:</b> 3 attempts exponential backoff'
      ]
    },
    shopify: {
      title: 'Shopify Storefront Event Stream',
      subtitle: 'Shopify GraphQL Admin API &bull; Orders Webhook Ingress',
      icon: 'fa-brands fa-shopify',
      iconColor: 'bg-emerald-500/20 text-emerald-400',
      stats: [
        { label: 'INGRESS RATE', value: '860 evt/s' },
        { label: 'CURRENCY NORMALIZER', value: 'WASM ACTIVE' },
        { label: 'LATENCY', value: '2.9 ms' }
      ],
      details: [
        '<b>Subscribed Topics:</b> orders/create, orders/paid, inventory_levels/update',
        '<b>Store Domain:</b> flagship-store.myshopify.com',
        '<b>Transformer:</b> Dynamic currency cents to standard decimal float',
        '<b>GDPR Redaction:</b> Automatic PII hash masking applied at boundary'
      ]
    },
    core: {
      title: 'OmniSync Orchestration Core Runtime',
      subtitle: 'Rust Async epoll Engine &bull; Redis 7.2 Cluster &bull; BullMQ Workers',
      icon: 'fa-solid fa-arrows-split-up-and-left',
      iconColor: 'bg-cyan-500/20 text-cyan-400',
      stats: [
        { label: 'CONCURRENCY', value: '12 Rust Threads' },
        { label: 'BUFFER OCCUPANCY', value: '124 In-Flight' },
        { label: 'TOTAL THROUGHPUT', value: '2,970 evt/s' }
      ],
      details: [
        '<b>Conflict Resolution:</b> Deterministic CRDT Engine (LWW + Field Vector Clocks)',
        '<b>Payload Transformation:</b> WebAssembly JIT (Zero runtime GC overhead)',
        '<b>Queue Architecture:</b> BullMQ Distributed Streams on High-Availability Redis',
        '<b>Guaranteed Delivery:</b> At-Least-Once with Idempotent Consumer Keys'
      ]
    },
    supabase: {
      title: 'Supabase / Postgres Sink Cluster',
      subtitle: 'Managed PostgreSQL &bull; Realtime Replication Sink',
      icon: 'fa-solid fa-bolt',
      iconColor: 'bg-emerald-500/20 text-emerald-400',
      stats: [
        { label: 'WRITE THROUGHPUT', value: '410 rows/s' },
        { label: 'SYNC LATENCY', value: '2.1 ms' },
        { label: 'CONFLICT STRATEGY', value: 'UPSERT ON CONFLICT' }
      ],
      details: [
        '<b>Target Tables:</b> public.users, public.accounts, public.order_events',
        '<b>Connection Pooler:</b> PgBouncer (Transaction mode &bull; 60 active conns)',
        '<b>Realtime Broadcast:</b> Postgres CDC Publication omni_broadcast',
        '<b>Write Reliability:</b> Synchronous Commit = ON'
      ]
    },
    snowflake: {
      title: 'Snowflake Analytics Data Warehouse',
      subtitle: 'Snowflake Snowpipe Streaming &bull; Enterprise OLAP Warehouse',
      icon: 'fa-regular fa-snowflake',
      iconColor: 'bg-cyan-500/20 text-cyan-400',
      stats: [
        { label: 'BATCH WINDOW', value: '5,000 ms / 10MB' },
        { label: 'SYNC LATENCY', value: '4.8 ms' },
        { label: 'FORMAT', value: 'Parquet Snappy' }
      ],
      details: [
        '<b>Target Table:</b> ANALYTICS.PUBLIC.EVENTS_STREAM',
        '<b>Ingestion Pipeline:</b> Native Snowpipe Direct Ingestion Channel',
        '<b>Partition Key:</b> YYYY/MM/DD/HH partition clustering',
        '<b>Auto-Clustering:</b> High query optimization for sub-second BI aggregations'
      ]
    },
    elastic: {
      title: 'Elasticsearch Search Cluster',
      subtitle: 'Elasticsearch 8.13 &bull; Distributed Real-Time Indexer',
      icon: 'fa-solid fa-magnifying-glass',
      iconColor: 'bg-amber-500/20 text-amber-400',
      stats: [
        { label: 'DOCUMENT COUNT', value: '14,290,110' },
        { label: 'REFRESH INTERVAL', value: '1,000 ms' },
        { label: 'SYNC LATENCY', value: '3.0 ms' }
      ],
      details: [
        '<b>Target Index:</b> idx_omnisearch_v2 (6 Shards &bull; 2 Replicas)',
        '<b>Bulk Pipeline:</b> Ingest node with multi-lingual tokenizer',
        '<b>Vector Embeddings:</b> 768-dim semantic search index populated concurrently',
        '<b>Buffer Queue:</b> Circuit-breaker memory threshold protected'
      ]
    },
    slack: {
      title: 'Slack Real-Time Notifications Hub',
      subtitle: 'Slack Bolt SDK &bull; Incoming Webhook Real-Time Bot',
      icon: 'fa-brands fa-slack',
      iconColor: 'bg-pink-500/20 text-pink-400',
      stats: [
        { label: 'DELIVERY LATENCY', value: '1.2 ms' },
        { label: 'RATE LIMITER', value: '1 msg/s (burst 5)' },
        { label: 'ALERT STATUS', value: 'ONLINE' }
      ],
      details: [
        '<b>Destination Channel:</b> #realtime-audit-feed',
        '<b>Message Format:</b> Rich Interactive Slack BlockKit',
        '<b>Deduplication:</b> Fingerprint hashing prevents duplicate alerts',
        '<b>Severity Filter:</b> Warning, Critical, and Audit-level events forwarded'
      ]
    }
  };

  const nodeElements = document.querySelectorAll('.pipeline-node[data-node]');
  const inspectorModal = document.getElementById('nodeInspectorModal');
  const closeInspectorBtn = document.getElementById('closeInspectorBtn');
  const inspectorIcon = document.getElementById('inspectorIcon');
  const inspectorTitle = document.getElementById('inspectorTitle');
  const inspectorSubtitle = document.getElementById('inspectorSubtitle');
  const inspectorStatsGrid = document.getElementById('inspectorStatsGrid');
  const inspectorDetailsBox = document.getElementById('inspectorDetailsBox');
  const inspectorPingBtn = document.getElementById('inspectorPingBtn');
  const inspectorToggleStreamBtn = document.getElementById('inspectorToggleStreamBtn');

  let activeInspectedNodeKey = 'pg';

  nodeElements.forEach(node => {
    node.addEventListener('click', () => {
      const nodeKey = node.getAttribute('data-node');
      const data = nodeMetadata[nodeKey];
      if (!data || !inspectorModal) return;

      activeInspectedNodeKey = nodeKey;
      inspectorTitle.textContent = data.title;
      inspectorSubtitle.innerHTML = data.subtitle;
      inspectorIcon.className = `w-10 h-10 rounded-xl flex items-center justify-center text-lg ${data.iconColor}`;
      inspectorIcon.innerHTML = `<i class="${data.icon}"></i>`;

      if (inspectorStatsGrid) {
        inspectorStatsGrid.innerHTML = data.stats.map(s => `
          <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div class="text-[10px] text-slate-500 uppercase">${s.label}</div>
            <div class="text-sm font-bold text-cyan-400 mt-0.5">${s.value}</div>
          </div>
        `).join('');
      }

      if (inspectorDetailsBox) {
        inspectorDetailsBox.innerHTML = data.details.map(d => `
          <div class="flex items-start gap-2">
            <span class="text-cyan-400">&bull;</span>
            <span>${d}</span>
          </div>
        `).join('');
      }

      inspectorModal.classList.remove('hidden');
    });
  });

  if (closeInspectorBtn && inspectorModal) {
    closeInspectorBtn.addEventListener('click', () => inspectorModal.classList.add('hidden'));
    inspectorModal.addEventListener('click', (e) => {
      if (e.target === inspectorModal) inspectorModal.classList.add('hidden');
    });
  }

  if (inspectorPingBtn) {
    inspectorPingBtn.addEventListener('click', () => {
      const pingMs = (0.9 + Math.random() * 1.5).toFixed(2);
      showToast(`Ping ACK for [${nodeMetadata[activeInspectedNodeKey].title}]: Roundtrip verified in ${pingMs}ms.`);
    });
  }

  if (inspectorToggleStreamBtn) {
    inspectorToggleStreamBtn.addEventListener('click', () => {
      showToast(`Stream state toggled for [${nodeMetadata[activeInspectedNodeKey].title}]. Status verified.`);
      if (inspectorModal) inspectorModal.classList.add('hidden');
    });
  }


  // ==========================================
  // 4. Deterministic Conflict Resolution Engine
  // ==========================================
  const conflictScenarios = {
    devops: {
      sourceTitle: '<i class="fa-brands fa-github"></i> Source: GitHub Issue #108',
      sourceTimestamp: '16:29:40.102',
      sourceJson: {
        id: "ISS-108",
        title: "Fix Stripe checkout timeout",
        status: "in_progress",
        priority: "high",
        assignee: "aurangzeb",
        updated_at: 1793444980102
      },
      targetTitle: '<i class="fa-brands fa-jira"></i> Target: Jira Ticket #108',
      targetTimestamp: '16:29:40.145',
      targetJson: {
        id: "ISS-108",
        title: "Fix Stripe checkout timeout",
        status: "blocked",
        priority: "critical",
        assignee: "sarah_cto",
        updated_at: 1793444980145
      },
      rules: {
        lww: {
          badge: 'LWW Timestamp',
          explanation: 'Rule Applied: Jira update had the newer epoch timestamp (+43ms difference), preserving latest status "blocked" and assignee "sarah_cto".',
          json: {
            id: "ISS-108",
            title: "Fix Stripe checkout timeout",
            status: "blocked",
            priority: "critical",
            assignee: "sarah_cto",
            conflict_resolved_by: "last_write_wins",
            resolution_delta_ms: 43
          }
        },
        dest: {
          badge: 'Destination Lockdown',
          explanation: 'Rule Applied: Target database policy strictly locked Jira as single source of truth for priority & status fields.',
          json: {
            id: "ISS-108",
            title: "Fix Stripe checkout timeout",
            status: "blocked",
            priority: "critical",
            assignee: "sarah_cto",
            conflict_resolved_by: "destination_lockdown_policy"
          }
        },
        merge: {
          badge: 'Field-Level Deep Merge',
          explanation: 'Rule Applied: GitHub retained in_progress status while adopting Jira critical priority via deterministic schema merge.',
          json: {
            id: "ISS-108",
            title: "Fix Stripe checkout timeout",
            status: "in_progress",
            priority: "critical",
            assignee: "aurangzeb",
            collaborators: ["sarah_cto"],
            conflict_resolved_by: "field_level_crdt_merge"
          }
        },
        ai: {
          badge: 'AI Semantic Reconciliation',
          explanation: 'Rule Applied: LLM semantic evaluator synthesized status: "in_progress (blocked by review)" and co-assigned both engineers.',
          json: {
            id: "ISS-108",
            title: "Fix Stripe checkout timeout",
            status: "in_progress_blocked_by_dependency",
            priority: "critical",
            co_assignees: ["aurangzeb", "sarah_cto"],
            ai_confidence: 0.984,
            conflict_resolved_by: "semantic_ai_arbitration"
          }
        }
      }
    },

    fintech: {
      sourceTitle: '<i class="fa-brands fa-stripe"></i> Source: Stripe Charge #ch_8912',
      sourceTimestamp: '16:30:11.200',
      sourceJson: {
        charge_id: "ch_8912",
        amount_cents: 14900,
        currency: "usd",
        reconciled: false,
        tax_exempt: true,
        updated_at: 1793445011200
      },
      targetTitle: '<i class="fa-solid fa-file-invoice-dollar"></i> Target: ERP Billing Invoice #inv_8912',
      targetTimestamp: '16:30:11.260',
      targetJson: {
        charge_id: "ch_8912",
        amount_cents: 14900,
        currency: "usd",
        reconciled: true,
        tax_exempt: false,
        updated_at: 1793445011260
      },
      rules: {
        lww: {
          badge: 'LWW Timestamp',
          explanation: 'Rule Applied: ERP Invoice update had newer epoch (+60ms), locking reconciled status = true and tax_exempt = false.',
          json: {
            charge_id: "ch_8912",
            amount_cents: 14900,
            currency: "usd",
            reconciled: true,
            tax_exempt: false,
            conflict_resolved_by: "last_write_wins",
            resolution_delta_ms: 60
          }
        },
        dest: {
          badge: 'Destination Lockdown',
          explanation: 'Rule Applied: ERP Ledger is configured as immutable system of record for accounting reconciliation flags.',
          json: {
            charge_id: "ch_8912",
            amount_cents: 14900,
            currency: "usd",
            reconciled: true,
            tax_exempt: false,
            conflict_resolved_by: "destination_lockdown_ledger"
          }
        },
        merge: {
          badge: 'Field-Level Deep Merge',
          explanation: 'Rule Applied: Preserved Stripe tax_exempt status while adopting ERP reconciled state without losing billing precision.',
          json: {
            charge_id: "ch_8912",
            amount_cents: 14900,
            currency: "usd",
            reconciled: true,
            tax_exempt: true,
            conflict_resolved_by: "field_level_crdt_merge"
          }
        },
        ai: {
          badge: 'AI Semantic Reconciliation',
          explanation: 'Rule Applied: Evaluated VAT regulations: Verified business tax exemption certificate and reconciled ledger record.',
          json: {
            charge_id: "ch_8912",
            amount_cents: 14900,
            currency: "usd",
            reconciled: true,
            tax_exempt: true,
            audit_note: "Verified automated B2B exemption",
            conflict_resolved_by: "semantic_ai_arbitration"
          }
        }
      }
    },

    ecommerce: {
      sourceTitle: '<i class="fa-brands fa-shopify"></i> Source: Shopify Inventory SKU-88',
      sourceTimestamp: '16:31:02.410',
      sourceJson: {
        sku: "SKU-88-WIRELESS-PODS",
        available_stock: 42,
        reserved_stock: 3,
        warehouse_zone: "US-EAST-A1",
        updated_at: 1793445062410
      },
      targetTitle: '<i class="fa-solid fa-warehouse"></i> Target: WMS Inventory System',
      targetTimestamp: '16:31:02.430',
      targetJson: {
        sku: "SKU-88-WIRELESS-PODS",
        available_stock: 40,
        reserved_stock: 5,
        warehouse_zone: "US-EAST-A2",
        updated_at: 1793445062430
      },
      rules: {
        lww: {
          badge: 'LWW Timestamp',
          explanation: 'Rule Applied: WMS warehouse scanner had newer timestamp (+20ms), preserving physical bin count of 40 units.',
          json: {
            sku: "SKU-88-WIRELESS-PODS",
            available_stock: 40,
            reserved_stock: 5,
            warehouse_zone: "US-EAST-A2",
            conflict_resolved_by: "last_write_wins",
            resolution_delta_ms: 20
          }
        },
        dest: {
          badge: 'Destination Lockdown',
          explanation: 'Rule Applied: Physical Warehouse Management System (WMS) strictly overrides storefront estimation.',
          json: {
            sku: "SKU-88-WIRELESS-PODS",
            available_stock: 40,
            reserved_stock: 5,
            warehouse_zone: "US-EAST-A2",
            conflict_resolved_by: "destination_lockdown_wms"
          }
        },
        merge: {
          badge: 'Field-Level Deep Merge',
          explanation: 'Rule Applied: CRDT Counter addition merged reservations (total 5 reserved, 40 free, zone US-EAST-A2).',
          json: {
            sku: "SKU-88-WIRELESS-PODS",
            available_stock: 40,
            reserved_stock: 5,
            warehouse_zone: "US-EAST-A2",
            conflict_resolved_by: "field_level_crdt_merge"
          }
        },
        ai: {
          badge: 'AI Semantic Reconciliation',
          explanation: 'Rule Applied: Predicted 2 pending checkouts from Shopify cart sessions, synchronizing buffer to prevent overselling.',
          json: {
            sku: "SKU-88-WIRELESS-PODS",
            available_stock: 40,
            reserved_stock: 5,
            safe_to_sell: 38,
            conflict_resolved_by: "semantic_ai_arbitration"
          }
        }
      }
    },

    identity: {
      sourceTitle: '<i class="fa-solid fa-database"></i> Source: PostgreSQL Users CDC',
      sourceTimestamp: '16:32:15.110',
      sourceJson: {
        user_id: "usr_9921",
        email: "aurangzeb@omnisync.dev",
        role: "admin",
        mfa_enabled: true,
        updated_at: 1793445135110
      },
      targetTitle: '<i class="fa-solid fa-user-shield"></i> Target: Auth0 Directory',
      targetTimestamp: '16:32:15.170',
      targetJson: {
        user_id: "usr_9921",
        email: "aurangzeb@omnisync.dev",
        role: "security_engineer",
        mfa_enabled: true,
        updated_at: 1793445135170
      },
      rules: {
        lww: {
          badge: 'LWW Timestamp',
          explanation: 'Rule Applied: Auth0 update had newer epoch (+60ms), adopting role "security_engineer".',
          json: {
            user_id: "usr_9921",
            email: "aurangzeb@omnisync.dev",
            role: "security_engineer",
            mfa_enabled: true,
            conflict_resolved_by: "last_write_wins",
            resolution_delta_ms: 60
          }
        },
        dest: {
          badge: 'Destination Lockdown',
          explanation: 'Rule Applied: Auth0 IAM service strictly enforces organizational RBAC authorization.',
          json: {
            user_id: "usr_9921",
            email: "aurangzeb@omnisync.dev",
            role: "security_engineer",
            mfa_enabled: true,
            conflict_resolved_by: "destination_lockdown_iam"
          }
        },
        merge: {
          badge: 'Field-Level Deep Merge',
          explanation: 'Rule Applied: Deterministic role union combined permissions into composite role: ["admin", "security_engineer"].',
          json: {
            user_id: "usr_9921",
            email: "aurangzeb@omnisync.dev",
            roles: ["admin", "security_engineer"],
            mfa_enabled: true,
            conflict_resolved_by: "field_level_crdt_merge"
          }
        },
        ai: {
          badge: 'AI Semantic Reconciliation',
          explanation: 'Rule Applied: Security analyzer confirmed administrative access required for platform infrastructure deployment.',
          json: {
            user_id: "usr_9921",
            email: "aurangzeb@omnisync.dev",
            role: "super_admin_security_lead",
            mfa_enforced: true,
            conflict_resolved_by: "semantic_ai_arbitration"
          }
        }
      }
    }
  };

  let activeScenarioKey = 'devops';
  let activeRuleKey = 'lww';

  const sourceCardTitle = document.getElementById('sourceCardTitle');
  const sourceTimestamp = document.getElementById('sourceTimestamp');
  const jsonSource = document.getElementById('jsonSource');
  const targetCardTitle = document.getElementById('targetCardTitle');
  const targetTimestamp = document.getElementById('targetTimestamp');
  const jsonTarget = document.getElementById('jsonTarget');
  const activeRuleBadge = document.getElementById('activeRuleBadge');
  const jsonResolved = document.getElementById('jsonResolved');
  const conflictExplanation = document.getElementById('conflictExplanation');
  const scenarioBtns = document.querySelectorAll('#conflictScenarioBtns button');
  const ruleBtns = document.querySelectorAll('#conflictRuleBtns button');
  const simulateCollisionBtn = document.getElementById('simulateCollisionBtn');

  function updateConflictView() {
    const scenario = conflictScenarios[activeScenarioKey];
    if (!scenario) return;

    if (sourceCardTitle) sourceCardTitle.innerHTML = scenario.sourceTitle;
    if (sourceTimestamp) sourceTimestamp.textContent = scenario.sourceTimestamp;
    if (jsonSource) jsonSource.textContent = JSON.stringify(scenario.sourceJson, null, 2);

    if (targetCardTitle) targetCardTitle.innerHTML = scenario.targetTitle;
    if (targetTimestamp) targetTimestamp.textContent = scenario.targetTimestamp;
    if (jsonTarget) jsonTarget.textContent = JSON.stringify(scenario.targetJson, null, 2);

    const ruleData = scenario.rules[activeRuleKey];
    if (ruleData) {
      if (activeRuleBadge) activeRuleBadge.textContent = ruleData.badge;
      if (jsonResolved) jsonResolved.textContent = JSON.stringify(ruleData.json, null, 2);
      if (conflictExplanation) conflictExplanation.textContent = ruleData.explanation;
    }
  }
  updateConflictView();

  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => {
        b.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40', 'active-scenario');
        b.classList.add('bg-slate-800', 'text-slate-400', 'border-slate-700');
      });
      btn.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40', 'active-scenario');
      btn.classList.remove('bg-slate-800', 'text-slate-400', 'border-slate-700');

      activeScenarioKey = btn.getAttribute('data-scenario');
      updateConflictView();
      showToast(`Switched scenario: ${btn.textContent.trim()}`);
    });
  });

  ruleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ruleBtns.forEach(b => b.classList.remove('active-rule'));
      btn.classList.add('active-rule');

      activeRuleKey = btn.getAttribute('data-rule');
      updateConflictView();
      const ruleData = conflictScenarios[activeScenarioKey].rules[activeRuleKey];
      showToast(`Conflict arbitration: ${ruleData.badge} activated.`);
    });
  });

  if (simulateCollisionBtn) {
    simulateCollisionBtn.addEventListener('click', () => {
      const scenarioKeys = Object.keys(conflictScenarios);
      const ruleKeys = ['lww', 'dest', 'merge', 'ai'];

      activeScenarioKey = scenarioKeys[Math.floor(Math.random() * scenarioKeys.length)];
      activeRuleKey = ruleKeys[Math.floor(Math.random() * ruleKeys.length)];

      scenarioBtns.forEach(b => {
        if (b.getAttribute('data-scenario') === activeScenarioKey) {
          b.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40', 'active-scenario');
          b.classList.remove('bg-slate-800', 'text-slate-400', 'border-slate-700');
        } else {
          b.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40', 'active-scenario');
          b.classList.add('bg-slate-800', 'text-slate-400', 'border-slate-700');
        }
      });

      ruleBtns.forEach(b => {
        if (b.getAttribute('data-rule') === activeRuleKey) {
          b.classList.add('active-rule');
        } else {
          b.classList.remove('active-rule');
        }
      });

      updateConflictView();
      const badge = conflictScenarios[activeScenarioKey].rules[activeRuleKey].badge;
      showToast(`Simulated random collision: ${badge} applied.`);
    });
  }


  // ==========================================
  // 5. Visual Schema Mapper & Real Dry-Run Engine
  // ==========================================
  const addMappingBtn = document.getElementById('addMappingBtn');
  const addRuleModal = document.getElementById('addRuleModal');
  const closeAddRuleBtn = document.getElementById('closeAddRuleBtn');
  const cancelAddRuleBtn = document.getElementById('cancelAddRuleBtn');
  const addRuleForm = document.getElementById('addRuleForm');
  const schemaTable = document.getElementById('schemaMappingTable');
  const activeRulesCountBadge = document.getElementById('activeRulesCountBadge');
  const dryRunTransformBtn = document.getElementById('dryRunTransformBtn');
  const dryRunModal = document.getElementById('dryRunModal');
  const closeDryRunBtn = document.getElementById('closeDryRunBtn');
  const dryRunInput = document.getElementById('dryRunInput');
  const dryRunOutput = document.getElementById('dryRunOutput');
  const dryRunExecutionTime = document.getElementById('dryRunExecutionTime');
  const reRunDryTestBtn = document.getElementById('reRunDryTestBtn');

  function updateRulesCount() {
    if (!schemaTable || !activeRulesCountBadge) return;
    const count = schemaTable.querySelectorAll('tr').length;
    activeRulesCountBadge.textContent = `${count} active transform ${count === 1 ? 'rule' : 'rules'}`;
  }

  function attachDeleteEvents() {
    document.querySelectorAll('.delete-rule-btn').forEach(btn => {
      btn.onclick = function() {
        const row = this.closest('tr');
        if (row) {
          row.remove();
          updateRulesCount();
          showToast('Rule removed from in-memory transform pipeline.');
        }
      };
    });
  }
  attachDeleteEvents();

  if (addMappingBtn && addRuleModal) {
    addMappingBtn.addEventListener('click', () => {
      addRuleModal.classList.remove('hidden');
    });
  }

  function closeRuleModal() {
    if (addRuleModal) addRuleModal.classList.add('hidden');
  }

  if (closeAddRuleBtn) closeAddRuleBtn.addEventListener('click', closeRuleModal);
  if (cancelAddRuleBtn) cancelAddRuleBtn.addEventListener('click', closeRuleModal);
  if (addRuleModal) {
    addRuleModal.addEventListener('click', (e) => {
      if (e.target === addRuleModal) closeRuleModal();
    });
  }

  const operatorLabels = {
    divide_100: 'Divide by 100 &bull; Float(2)',
    iso_date: 'To ISO-8601 UTC Date',
    sha256: 'SHA256 Hash Mask',
    e164: 'E.164 Phone Normalizer',
    sanitize_trim: 'Trim + XSS HTML Sanitize',
    uppercase: 'Uppercase String',
    multiply_tax: 'Multiply by Tax / Factor (1.13x)',
    json_flatten: 'JSON Flatten / Extract Root'
  };

  if (addRuleForm && schemaTable) {
    addRuleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sourceField = document.getElementById('ruleSourceField').value.trim();
      const operator = document.getElementById('ruleOperator').value;
      const targetField = document.getElementById('ruleTargetField').value.trim();

      if (!sourceField || !targetField) return;

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-800/30 transition-colors';
      tr.setAttribute('data-source', sourceField);
      tr.setAttribute('data-operator', operator);
      tr.setAttribute('data-target', targetField);

      tr.innerHTML = `
        <td class="py-4 text-cyan-400 font-bold">${sourceField}</td>
        <td class="text-center text-slate-600">&rarr;</td>
        <td>
          <span class="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            ${operatorLabels[operator] || operator}
          </span>
        </td>
        <td class="text-center text-slate-600">&rarr;</td>
        <td class="text-emerald-400 font-bold">${targetField}</td>
        <td class="text-right">
          <button class="text-slate-500 hover:text-rose-400 transition-colors delete-rule-btn cursor-pointer" title="Delete rule"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;

      schemaTable.appendChild(tr);
      attachDeleteEvents();
      updateRulesCount();
      closeRuleModal();
      addRuleForm.reset();
      showToast(`Rule inserted: ${sourceField} -> ${targetField}`);
    });
  }

  // Real in-memory transformation evaluator for Dry-Run
  function executeTransformationPipeline(inputData) {
    const rows = Array.from(schemaTable.querySelectorAll('tr'));
    const result = { ...inputData };

    rows.forEach(row => {
      const src = row.getAttribute('data-source');
      const op = row.getAttribute('data-operator');
      const tgt = row.getAttribute('data-target');

      if (!src || !tgt) return;
      const val = inputData[src];

      if (val !== undefined) {
        if (op === 'divide_100') {
          result[tgt] = Number((parseFloat(val) / 100).toFixed(2));
        } else if (op === 'iso_date') {
          const d = new Date(val);
          result[tgt] = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
        } else if (op === 'sha256') {
          // Deterministic synthetic hash representation
          result[tgt] = 'sha256_' + btoa(encodeURIComponent(String(val))).replace(/=/g, '').toLowerCase().slice(0, 24);
        } else if (op === 'e164') {
          const cleaned = String(val).replace(/[^\d+]/g, '');
          result[tgt] = cleaned.startsWith('+') ? cleaned : '+1' + cleaned;
        } else if (op === 'sanitize_trim') {
          result[tgt] = String(val).trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
        } else if (op === 'uppercase') {
          result[tgt] = String(val).toUpperCase();
        } else if (op === 'multiply_tax') {
          result[tgt] = Number((parseFloat(val) * 1.13).toFixed(2));
        } else if (op === 'json_flatten') {
          result[tgt] = typeof val === 'object' ? JSON.stringify(val) : String(val);
        } else {
          result[tgt] = val;
        }
      }
    });

    return result;
  }

  const sampleDryRunRecord = {
    raw_amount_cents: 14950,
    created_epoch_ms: 1793444980000,
    customer_email: "aurangzeb@enterprise.com",
    phone_raw: "+1 (555) 019-2834",
    user_status: "active_subscriber",
    metadata_notes: "Special enterprise SLA customer"
  };

  function runDryRun() {
    if (!dryRunInput || !dryRunOutput) return;
    let inputObj;
    try {
      inputObj = JSON.parse(dryRunInput.value);
    } catch {
      inputObj = sampleDryRunRecord;
      dryRunInput.value = JSON.stringify(sampleDryRunRecord, null, 2);
    }

    const t0 = performance.now();
    const outputObj = executeTransformationPipeline(inputObj);
    const t1 = performance.now();
    const duration = Math.max(0.12, (t1 - t0) + 0.1).toFixed(2);

    dryRunOutput.textContent = JSON.stringify(outputObj, null, 2);
    if (dryRunExecutionTime) {
      dryRunExecutionTime.textContent = `${duration} ms`;
    }
  }

  if (dryRunTransformBtn && dryRunModal) {
    dryRunTransformBtn.addEventListener('click', () => {
      if (dryRunInput && !dryRunInput.value.trim()) {
        dryRunInput.value = JSON.stringify(sampleDryRunRecord, null, 2);
      }
      runDryRun();
      dryRunModal.classList.remove('hidden');
    });
  }

  if (closeDryRunBtn && dryRunModal) {
    closeDryRunBtn.addEventListener('click', () => dryRunModal.classList.add('hidden'));
    dryRunModal.addEventListener('click', (e) => {
      if (e.target === dryRunModal) dryRunModal.classList.add('hidden');
    });
  }

  if (reRunDryTestBtn) {
    reRunDryTestBtn.addEventListener('click', () => {
      runDryRun();
      showToast('Transformation pipeline re-evaluated successfully.');
    });
  }


  // ==========================================
  // 6. Live Telemetry & Ingress Stream Feed
  // ==========================================
  const telemetryStream = document.getElementById('telemetryStream');
  const clearStreamBtn = document.getElementById('clearStreamBtn');
  const liveTps = document.getElementById('liveTps');
  const liveTpsBar = document.getElementById('liveTpsBar');
  const liveBuffer = document.getElementById('liveBuffer');
  const liveBufferBar = document.getElementById('liveBufferBar');
  const liveP99 = document.getElementById('liveP99');
  const statSyncs = document.getElementById('statSyncs');
  const heroMedianLatency = document.getElementById('heroMedianLatency');
  const coreBuffer = document.getElementById('coreBuffer');
  const coreBufferBar = document.getElementById('coreBufferBar');
  const coreThroughput = document.getElementById('coreThroughput');

  const eventCatalog = [
    { name: 'stripe.charge.succeeded', color: 'text-violet-400', latency: '2.1ms' },
    { name: 'postgres.users.updated', color: 'text-blue-400', latency: '1.8ms' },
    { name: 'github.issue.merged', color: 'text-slate-300', latency: '3.4ms' },
    { name: 'shopify.order.created', color: 'text-emerald-400', latency: '2.9ms' },
    { name: 'supabase.cdc.synced', color: 'text-teal-400', latency: '1.9ms' },
    { name: 'snowflake.warehouse.commit', color: 'text-cyan-400', latency: '4.8ms' }
  ];

  function createStreamItem(evt = null) {
    const item = evt || eventCatalog[Math.floor(Math.random() * eventCatalog.length)];
    const time = new Date().toLocaleTimeString();
    const id = Math.random().toString(36).substring(2, 8);

    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800/60 hover:border-slate-700 transition-colors';
    div.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-slate-500">${time}</span>
        <span class="font-bold ${item.color}">${item.name}</span>
        <span class="text-slate-500 text-[10px]">#evt_${id}</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-slate-400">ACK in <span class="text-emerald-400">${item.latency}</span></span>
        <span class="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Synced</span>
      </div>
    `;
    return div;
  }

  if (telemetryStream) {
    for (let i = 0; i < 7; i++) {
      telemetryStream.appendChild(createStreamItem());
    }

    // Auto append every 1.8s
    setInterval(() => {
      if (!isFlowing) return;
      const el = createStreamItem();
      telemetryStream.prepend(el);
      if (telemetryStream.children.length > 25) {
        telemetryStream.removeChild(telemetryStream.lastChild);
      }
    }, 1800);
  }

  if (clearStreamBtn && telemetryStream) {
    clearStreamBtn.addEventListener('click', () => {
      telemetryStream.innerHTML = '';
      showToast('Telemetry event stream cleared.');
    });
  }

  // Realistic telemetry fluctuations
  let syncsCount = 42891240;
  setInterval(() => {
    // 1. Hero syncs count
    syncsCount += Math.floor(15 + Math.random() * 25);
    if (statSyncs) statSyncs.textContent = syncsCount.toLocaleString();

    // 2. Median latency fluctuation
    if (heroMedianLatency && Math.random() > 0.6) {
      heroMedianLatency.textContent = (3.2 + Math.random() * 0.4).toFixed(1) + ' ms';
    }

    // 3. Live Ingestion Rate (TPS)
    if (liveTps && liveTpsBar) {
      const tps = Math.floor(2700 + Math.random() * 400);
      liveTps.textContent = `${tps.toLocaleString()} req/s`;
      liveTpsBar.style.width = `${Math.min(95, Math.floor((tps / 3500) * 100))}%`;
    }

    // 4. Redis Buffer Occupancy
    if (liveBuffer && liveBufferBar) {
      const pct = Math.floor(12 + Math.random() * 6);
      const items = (pct * 100) + Math.floor(Math.random() * 90);
      liveBuffer.textContent = `${pct}% (${items.toLocaleString()} / 10,000)`;
      liveBufferBar.style.width = `${pct}%`;
    }

    // 5. P99 latency
    if (liveP99) {
      liveP99.textContent = (3.9 + Math.random() * 0.5).toFixed(2) + ' ms';
    }

    // 6. Core Buffer and Throughput
    if (coreBuffer && coreBufferBar) {
      const count = Math.floor(100 + Math.random() * 45);
      coreBuffer.textContent = `${count} items`;
      coreBufferBar.style.width = `${Math.floor((count / 250) * 100)}%`;
    }
    if (coreThroughput) {
      const t = Math.floor(2900 + Math.random() * 200);
      coreThroughput.textContent = `${t.toLocaleString()}/sec`;
    }
  }, 2000);

  // Background Daemon Console Logging
  const coreConsole = document.getElementById('coreConsole');
  const consoleMessages = [
    { text: (t) => `> [${t}] Commit WAL offset 8940 -> Supabase public.users (batch: 48)`, color: 'text-emerald-400' },
    { text: (t) => `> [${t}] Wasm edge compiled transform: sanitized 34 customer records`, color: 'text-cyan-400' },
    { text: (t) => `> [${t}] Conflict detected stripe#ch_882: resolved via CRDT timestamp`, color: 'text-violet-400' },
    { text: (t) => `> [${t}] Flushed 128 Snowpipe streaming micro-batches to Snowflake`, color: 'text-teal-400' },
    { text: (t) => `> [${t}] Redis cluster heartbeat OK: 12/12 worker threads active`, color: 'text-slate-400' }
  ];

  setInterval(() => {
    if (!isFlowing || !coreConsole) return;
    const msg = consoleMessages[Math.floor(Math.random() * consoleMessages.length)];
    const time = new Date().toLocaleTimeString();
    const div = document.createElement('div');
    div.className = msg.color;
    div.textContent = msg.text(time);
    coreConsole.appendChild(div);
    if (coreConsole.children.length > 30) {
      coreConsole.removeChild(coreConsole.children[1]); // preserve header
    }
    coreConsole.scrollTop = coreConsole.scrollHeight;
  }, 3400);


  // ==========================================
  // 7. Developer SDK & Syntax Highlighter
  // ==========================================
  const rawCodeSnippets = {
    ts: `import { OmniSync } from '@omnisync/core';

// 1. Initialize OmniSync client with edge secret
const omni = new OmniSync({
  apiKey: process.env.OMNISYNC_KEY,
  clusterRegion: 'us-east-1'
});

// 2. Declare a 2-way sync bridge with schema transforms
const syncBridge = omni.createBridge({
  source: 'postgres.production.customers',
  destination: 'supabase.public.customers',
  conflictStrategy: 'LAST_WRITE_WINS',
  transforms: [
    (record) => ({
      ...record,
      amount_usd: record.raw_amount_cents / 100,
      synced_at: new Date().toISOString()
    })
  ]
});

// 3. Start streaming with automatic health listeners
syncBridge.on('ack', (event) => {
  console.log(\`Synced event \${event.id} in \${event.latencyMs}ms\`);
});`,

    py: `from omnisync import OmniSync, ConflictStrategy
import os

# 1. Initialize Python client with edge secret
omni = OmniSync(
    api_key=os.getenv("OMNISYNC_KEY"),
    region="us-east-1"
)

# 2. Configure bidirectional schema pipeline
bridge = omni.create_bridge(
    source="postgres.production.customers",
    destination="supabase.public.customers",
    strategy=ConflictStrategy.LAST_WRITE_WINS
)

@bridge.transform
def format_payload(record):
    record["amount_usd"] = record.get("raw_amount_cents", 0) / 100
    return record

# 3. Listen for asynchronous delivery ACKs
bridge.start_listener(lambda ack: print(f"Synced {ack.id} in {ack.latency}ms"))`,

    go: `package main

import (
    "context"
    "fmt"
    "github.com/omnisync/omnisync-go"
)

func main() {
    client := omnisync.NewClient(omnisync.Config{
        ApiKey: "omni_live_99214a",
        Region: "us-east-1",
    })

    bridge, err := client.CreateBridge(context.Background(), omnisync.BridgeParams{
        Source:           "postgres.production.customers",
        Destination:      "snowflake.warehouse.events",
        ConflictStrategy: omnisync.LastWriteWins,
    })
    if err != nil {
        panic(err)
    }

    fmt.Printf("OmniSync Bridge connected: %s\\n", bridge.ID)
}`,

    curl: `# Push synthetic event into OmniSync ingestion gateway
curl -X POST https://api.omnisync.dev/v1/ingest \\
  -H "Authorization: Bearer omni_live_secret_key" \\
  -H "Content-Type: application/json" \\
  -H "X-Idempotency-Key: req_981a_b2c4" \\
  -d '{
    "source": "stripe.webhook",
    "event": "charge.succeeded",
    "payload": {
      "customer_id": "cus_99412",
      "amount_cents": 14900,
      "currency": "usd"
    }
  }'`
  };

  const highlightedSnippets = {
    ts: `<span class="tok-kw">import</span> { <span class="tok-type">OmniSync</span> } <span class="tok-kw">from</span> <span class="tok-str">'@omnisync/core'</span>;

<span class="tok-cmt">// 1. Initialize OmniSync client with edge secret</span>
<span class="tok-kw">const</span> omni = <span class="tok-kw">new</span> <span class="tok-type">OmniSync</span>({
  <span class="tok-prop">apiKey</span>: process.env.<span class="tok-num">OMNISYNC_KEY</span>,
  <span class="tok-prop">clusterRegion</span>: <span class="tok-str">'us-east-1'</span>
});

<span class="tok-cmt">// 2. Declare a 2-way sync bridge with schema transforms</span>
<span class="tok-kw">const</span> syncBridge = omni.<span class="tok-fn">createBridge</span>({
  <span class="tok-prop">source</span>: <span class="tok-str">'postgres.production.customers'</span>,
  <span class="tok-prop">destination</span>: <span class="tok-str">'supabase.public.customers'</span>,
  <span class="tok-prop">conflictStrategy</span>: <span class="tok-str">'LAST_WRITE_WINS'</span>,
  <span class="tok-prop">transforms</span>: [
    (record) =&gt; ({
      ...record,
      <span class="tok-prop">amount_usd</span>: record.raw_amount_cents / <span class="tok-num">100</span>,
      <span class="tok-prop">synced_at</span>: <span class="tok-kw">new</span> <span class="tok-type">Date</span>().<span class="tok-fn">toISOString</span>()
    })
  ]
});

<span class="tok-cmt">// 3. Start streaming with automatic health listeners</span>
syncBridge.<span class="tok-fn">on</span>(<span class="tok-str">'ack'</span>, (event) =&gt; {
  console.<span class="tok-fn">log</span>(<span class="tok-str">\`Synced event \${event.id} in \${event.latencyMs}ms\`</span>);
});`,

    py: `<span class="tok-kw">from</span> omnisync <span class="tok-kw">import</span> <span class="tok-type">OmniSync</span>, <span class="tok-type">ConflictStrategy</span>
<span class="tok-kw">import</span> os

<span class="tok-cmt"># 1. Initialize Python client with edge secret</span>
omni = <span class="tok-type">OmniSync</span>(
    api_key=os.<span class="tok-fn">getenv</span>(<span class="tok-str">"OMNISYNC_KEY"</span>),
    region=<span class="tok-str">"us-east-1"</span>
)

<span class="tok-cmt"># 2. Configure bidirectional schema pipeline</span>
bridge = omni.<span class="tok-fn">create_bridge</span>(
    source=<span class="tok-str">"postgres.production.customers"</span>,
    destination=<span class="tok-str">"supabase.public.customers"</span>,
    strategy=<span class="tok-type">ConflictStrategy</span>.LAST_WRITE_WINS
)

<span class="tok-fn">@bridge.transform</span>
<span class="tok-kw">def</span> <span class="tok-fn">format_payload</span>(record):
    record[<span class="tok-str">"amount_usd"</span>] = record.<span class="tok-fn">get</span>(<span class="tok-str">"raw_amount_cents"</span>, <span class="tok-num">0</span>) / <span class="tok-num">100</span>
    <span class="tok-kw">return</span> record

<span class="tok-cmt"># 3. Listen for asynchronous delivery ACKs</span>
bridge.<span class="tok-fn">start_listener</span>(<span class="tok-kw">lambda</span> ack: <span class="tok-fn">print</span>(<span class="tok-str">f"Synced {ack.id} in {ack.latency}ms"</span>))`,

    go: `<span class="tok-kw">package</span> main

<span class="tok-kw">import</span> (
    <span class="tok-str">"context"</span>
    <span class="tok-str">"fmt"</span>
    <span class="tok-str">"github.com/omnisync/omnisync-go"</span>
)

<span class="tok-kw">func</span> <span class="tok-fn">main</span>() {
    client := omnisync.<span class="tok-fn">NewClient</span>(omnisync.<span class="tok-type">Config</span>{
        <span class="tok-prop">ApiKey</span>: <span class="tok-str">"omni_live_99214a"</span>,
        <span class="tok-prop">Region</span>: <span class="tok-str">"us-east-1"</span>,
    })

    bridge, err := client.<span class="tok-fn">CreateBridge</span>(context.<span class="tok-fn">Background</span>(), omnisync.<span class="tok-type">BridgeParams</span>{
        <span class="tok-prop">Source</span>:           <span class="tok-str">"postgres.production.customers"</span>,
        <span class="tok-prop">Destination</span>:      <span class="tok-str">"snowflake.warehouse.events"</span>,
        <span class="tok-prop">ConflictStrategy</span>: omnisync.LastWriteWins,
    })
    <span class="tok-kw">if</span> err != <span class="tok-kw">nil</span> {
        <span class="tok-fn">panic</span>(err)
    }

    fmt.<span class="tok-fn">Printf</span>(<span class="tok-str">"OmniSync Bridge connected: %s\\n"</span>, bridge.ID)
}`,

    curl: `<span class="tok-cmt"># Push synthetic event into OmniSync ingestion gateway</span>
curl -X POST https://api.omnisync.dev/v1/ingest \\
  -H <span class="tok-str">"Authorization: Bearer omni_live_secret_key"</span> \\
  -H <span class="tok-str">"Content-Type: application/json"</span> \\
  -H <span class="tok-str">"X-Idempotency-Key: req_981a_b2c4"</span> \\
  -d <span class="tok-str">'{
    "source": "stripe.webhook",
    "event": "charge.succeeded",
    "payload": {
      "customer_id": "cus_99412",
      "amount_cents": 14900,
      "currency": "usd"
    }
  }'</span>`
  };

  const sdkTabs = document.querySelectorAll('.sdk-tab');
  const sdkCodeDisplayPre = document.querySelector('#sdkCodeDisplay pre');
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  const copyCodeText = document.getElementById('copyCodeText');

  let activeSdkLang = 'ts';

  if (sdkCodeDisplayPre) {
    sdkCodeDisplayPre.innerHTML = highlightedSnippets['ts'];
  }

  sdkTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sdkTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeSdkLang = tab.getAttribute('data-lang');

      if (sdkCodeDisplayPre && highlightedSnippets[activeSdkLang]) {
        sdkCodeDisplayPre.innerHTML = highlightedSnippets[activeSdkLang];
      }
    });
  });

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const code = rawCodeSnippets[activeSdkLang];
      navigator.clipboard.writeText(code).then(() => {
        if (copyCodeText) copyCodeText.textContent = 'Copied!';
        showToast('Code snippet copied to clipboard.');
        setTimeout(() => {
          if (copyCodeText) copyCodeText.textContent = 'Copy';
        }, 2000);
      });
    });
  }


  // ==========================================
  // 8. Synthetic Webhook Dispatcher
  // ==========================================
  const dispatchTestBtn = document.getElementById('dispatchTestBtn');
  const testDispatchResult = document.getElementById('testDispatchResult');
  const testLatencyAck = document.getElementById('testLatencyAck');
  const testTraceId = document.getElementById('testTraceId');
  const webhookPresetSelect = document.getElementById('webhookPresetSelect');

  const presetPayloads = {
    stripe: { name: 'stripe.charge.succeeded', color: 'text-violet-400' },
    github: { name: 'github.pull_request.merged', color: 'text-slate-300' },
    postgres: { name: 'postgres.users.updated', color: 'text-blue-400' },
    shopify: { name: 'shopify.order.created', color: 'text-emerald-400' }
  };

  if (dispatchTestBtn) {
    dispatchTestBtn.addEventListener('click', () => {
      dispatchTestBtn.disabled = true;
      dispatchTestBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Dispatching...`;

      const latencyMs = (1.8 + Math.random() * 1.5).toFixed(1);
      const trace = 'omni-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6);
      const queueId = 'q_' + Math.random().toString(36).substring(2, 6);

      setTimeout(() => {
        dispatchTestBtn.disabled = false;
        dispatchTestBtn.innerHTML = 'POST Test';

        if (testDispatchResult) {
          testDispatchResult.classList.remove('hidden');
        }
        if (testLatencyAck) {
          testLatencyAck.textContent = `${latencyMs} ms`;
        }
        if (testTraceId) {
          testTraceId.textContent = `Trace ID: #${trace} • Redis Queue ID: #${queueId}`;
        }

        // Spawn a burst packet on canvas
        for (let i = 0; i < 6; i++) {
          packets.push(new DataPacket(2.5));
        }

        // Append to Telemetry stream
        const presetKey = webhookPresetSelect ? webhookPresetSelect.value : 'stripe';
        const preset = presetPayloads[presetKey] || presetPayloads.stripe;
        if (telemetryStream) {
          const testItem = createStreamItem({
            name: `${preset.name} (TEST)`,
            color: preset.color,
            latency: `${latencyMs}ms`
          });
          telemetryStream.prepend(testItem);
        }

        // Append to Core Console
        if (coreConsole) {
          const div = document.createElement('div');
          div.className = 'text-cyan-400 font-bold';
          div.textContent = `> [${new Date().toLocaleTimeString()}] INGRESS: Received synthetic webhook for ${preset.name} (ACK: ${latencyMs}ms, trace: #${trace})`;
          coreConsole.appendChild(div);
          coreConsole.scrollTop = coreConsole.scrollHeight;
        }

        showToast(`HTTP 200 OK: Ingested synthetic webhook in ${latencyMs}ms.`);
      }, 500);
    });
  }


  // ==========================================
  // 9. Toast Notification Helper
  // ==========================================
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toastMsg) toastMsg.textContent = msg;
    if (toast) {
      toast.classList.remove('hidden');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.add('hidden');
      }, 3500);
    }
  }

  // Keyboard shortcut: Escape closes all modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (inspectorModal) inspectorModal.classList.add('hidden');
      if (addRuleModal) addRuleModal.classList.add('hidden');
      if (dryRunModal) dryRunModal.classList.add('hidden');
    }
  });

});
