/* ==========================================
   T. Kutti Durai Portfolio Interactivity Script
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    initTypewriter();
    initThemeToggle();
    initMobileNav();
    initCloudVisualizer();
    initSkillsFilter();
    initContactForm();
    initLightbox();
});

/* --- Typewriter Effect --- */
function initTypewriter() {
    const typewriterEl = document.getElementById("typewriter");
    if (!typewriterEl) return;

    const titles = [
        "AWS DevOps Specialist",
        "Kubernetes Administrator",
        "DevSecOps Pipeline Engineer",
        "Mobile DevOps Automation Expert",
        "Cloud Migration Architect"
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 150;

    function tick() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typewriterEl.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            delay = 50; // Faster deletion
        } else {
            typewriterEl.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            delay = 120; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            delay = 2000; // Pause at the end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            delay = 500; // Pause before typing next word
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, delay);
}

/* --- Dark / Light Theme Toggle --- */
function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const body = document.body;
    if (!toggleBtn) return;

    // Check localStorage first
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    if (savedTheme === "light") {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
        toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    toggleBtn.addEventListener("click", () => {
        if (body.classList.contains("dark-theme")) {
            body.classList.replace("dark-theme", "light-theme");
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem("portfolio-theme", "light");
        } else {
            body.classList.replace("light-theme", "dark-theme");
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem("portfolio-theme", "dark");
        }
    });
}

/* --- Mobile Navigation Overlay --- */
function initMobileNav() {
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const closeMenu = document.getElementById("close-mobile-menu");
    const mobileNav = document.getElementById("mobile-nav");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (!menuToggle || !mobileNav) return;

    function openMobileMenu() {
        mobileNav.classList.add("open");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    function closeMobileMenuFunc() {
        mobileNav.classList.remove("open");
        document.body.style.overflow = "auto";
    }

    menuToggle.addEventListener("click", openMobileMenu);
    if (closeMenu) closeMenu.addEventListener("click", closeMobileMenuFunc);

    mobileLinks.forEach(link => {
        link.addEventListener("click", closeMobileMenuFunc);
    });
}

/* --- Multi-Cloud & On-Prem Architecture Visualizer --- */
// Detailed mapping database for visualizer components
const architectureData = {
    aws: {
        dns: {
            value: "Route 53",
            category: "Edge & DNS",
            active: "AWS Route 53 Hosted Zones",
            desc: "Highly available and scalable domain name system mapping user traffic to CloudFront distributions and Application Load Balancers.",
            achievements: [
                "Configured Active-Passive DNS Failover for payments API endpoints.",
                "Utilized latency-based routing policies to route international client requests."
            ]
        },
        cdn: {
            value: "CloudFront",
            category: "Edge & CDN",
            active: "AWS CloudFront CDN",
            desc: "Fast content delivery network caching static assets (HTML/JS/CSS) at Edge locations with custom HTTPS certificates (ACM) and origin access control.",
            achievements: [
                "Reduced static asset delivery latency by 45%.",
                "Implemented secure Origin Access Control (OAC) to enforce S3 bucket access restrictions."
            ]
        },
        waf: {
            value: "AWS WAF / Shield",
            category: "Edge Security",
            active: "WAF Core Rule Sets & Shield Advanced",
            desc: "Web application firewall and DDoS protection shield blocking OWASP Top 10 exploits, SQL injections, and DDoS layer 7 network attacks.",
            achievements: [
                "Enforced Geo-IP blocking rules restricting connections to authorized banking regions.",
                "Built automated AWS WAF IP rate-limiting rules to prevent API brute forcing."
            ]
        },
        ingress: {
            value: "ALB",
            category: "Load Balancer",
            active: "Application Load Balancer (ALB)",
            desc: "Layer-7 load balancer routing HTTP/HTTPS requests from clients directly to the Kong API Gateway or Istio Ingress Gateway inside EKS.",
            achievements: [
                "Managed AWS ALB Controller inside Kubernetes to automatically provision ALBs from ingress YAML manifests.",
                "Enforced SSL termination with cipher security policies (TLS 1.3)."
            ]
        },
        gateway: {
            value: "Kong API Gateway",
            category: "API Gateway",
            active: "Kong Enterprise / Gateway Operator",
            desc: "Centrally manages API routing, authentication (JWT/OAuth2), client rate limiting, and request/response logging for frontend next.js requests.",
            achievements: [
                "Configured OAuth2 validation checks at the edge, reducing backend processing workload.",
                "Implemented IP whitelisting policies to secure communication with third-party payment providers."
            ]
        },
        mesh: {
            value: "Istio Ambient Mesh",
            category: "Service Mesh",
            active: "Istio Ambient Mode (zTunnel & Waypoints)",
            desc: "Manages east-west container communication, enforcing mTLS, traffic permissions, and circuit-breaking without injecting heavy sidecars.",
            achievements: [
                "Enforced strict zero-trust mTLS encryption across NestJS and .NET microservices.",
                "Configured L4/L7 authorization policies inside namespaces to prevent unauthorized service talk."
            ]
        },
        k8s: {
            value: "Amazon EKS",
            category: "Container Orchestration",
            active: "AWS EKS Engine v1.28+",
            desc: "Managed Kubernetes service hosting 30+ payment microservices, utilizing AWS Pod Identities and AWS VPC CNI for native IP routing.",
            achievements: [
                "Successfully migrated monolithic workloads onto EKS with 99.99% operational availability.",
                "Implemented Kubernetes RBAC integrated directly with AWS IAM Role mapping."
            ]
        },
        scaling: {
            value: "Karpenter / HPA / KEDA",
            category: "Autoscaling",
            active: "Karpenter + Prometheus Metrics Autoscalers",
            desc: "Combines Horizontal Pod Autoscalers (HPA) for application pods, KEDA for queue-driven scaling, and Karpenter for immediate EC2 node provisioning.",
            achievements: [
                "Achieved 30-40% AWS cost optimization via Karpenter right-sizing node templates.",
                "Provisioned new EC2 nodes dynamically in under 45 seconds during load surges."
            ]
        },
        secrets: {
            value: "AWS Secrets Manager",
            category: "Secrets Management",
            active: "Secrets Manager + External Secrets Operator",
            desc: "Securely stores database passwords, private keys, and API tokens. Integrated into Kubernetes pods using Kubernetes External Secrets Operator (ESO).",
            achievements: [
                "Configured KMS-encrypted envelope encryption for all database connection secrets.",
                "Automated 30-day password rotation rules for database connections."
            ]
        },
        db: {
            value: "RDS PostgreSQL",
            category: "Databases",
            active: "Multi-AZ RDS + RDS Proxy",
            desc: "Highly available relational database hosting payment histories, leveraging RDS Proxy for connection pooling to accommodate serverless microservices.",
            achievements: [
                "Configured Multi-AZ deployments with zero-loss synchronous replication.",
                "Integrated RDS Proxy, preventing connection exhausts during morning traffic peaks."
            ]
        },
        cache: {
            value: "ElastiCache Redis",
            category: "Distributed Caching",
            active: "ElastiCache Redis Cluster Mode",
            desc: "In-memory database for ultra-fast session cache, API response cache, and transactional lock management.",
            achievements: [
                "Achieved sub-millisecond query caching latencies for user profile states.",
                "Configured cluster sharding ensuring zero caching write delays."
            ]
        },
        queue: {
            value: "Amazon MSK / Kafka",
            category: "Messaging & Queues",
            active: "AWS Managed Streaming for Kafka (MSK)",
            desc: "Managed event streaming bus supporting event-driven ledger transactions across backend .NET microservices.",
            achievements: [
                "Configured 3-Zone replication partitions preventing message drop risks.",
                "Monitored consumer lag triggers in Prometheus for auto-scaling consumers."
            ]
        },
        cicd: {
            value: "GitHub Actions / Argo CD",
            category: "CI/CD & GitOps",
            active: "ArgoCD GitOps Git Sync",
            desc: "Combines GitHub Actions composite workflows for linting, testing, and building, with Argo CD for declarative GitOps deployment mapping.",
            achievements: [
                "Configured Blue-Green and Canary releases via Argo Rollouts, achieving zero-downtime.",
                "Standardized developer workflow pipelines, reducing build release durations by 50%."
            ]
        },
        metrics: {
            value: "Prometheus / Loki / Alloy",
            category: "Metrics & Logs",
            active: "Grafana Alloy Collector + Prometheus Operator",
            desc: "Aggregates cluster infrastructure metrics, logs, and pod telemetry. Alloy ships metrics to central Prometheus and logs to Loki databases.",
            achievements: [
                "Configured Grafana Alertmanager metrics raising Slack alerts for error rates > 2%.",
                "Optimized index fields in Loki, reducing logs lookup times by 65%."
            ]
        },
        tracing: {
            value: "Tempo / Jaeger / Beyla",
            category: "Distributed Tracing",
            active: "OpenTelemetry + eBPF Beyla",
            desc: "Tracks end-to-end user transactions across microservices, leveraging Grafana Beyla eBPF autoinstrumentation for zero-code tracing metrics.",
            achievements: [
                "Traced payment request lifecycles, identifying and resolving a database query bottleneck.",
                "Correlated logs, metrics, and traces (exemplars) inside Grafana dashboards."
            ]
        }
    },
    azure: {
        dns: {
            value: "Azure DNS",
            category: "Edge & DNS",
            active: "Azure Private/Public DNS Zones",
            desc: "High-performance global DNS service mapping public web domains to Azure Front Door edge points.",
            achievements: [
                "Automated DNS records provisioning using Azure Terraform modules.",
                "Configured custom domains mapping with automatic SSL certificate rotations."
            ]
        },
        cdn: {
            value: "Azure Front Door",
            category: "Edge & CDN",
            active: "Azure Front Door Standard/Premium",
            desc: "Combines global CDN edge caching with intelligent routing and secure SSL offloading at close-to-user locations.",
            achievements: [
                "Optimized routing profiles, reducing API endpoint connection handshake delays.",
                "Enforced TLS policies requiring modern client connections."
            ]
        },
        waf: {
            value: "Azure WAF",
            category: "Edge Security",
            active: "Azure Web Application Firewall",
            desc: "Protects application interfaces against OWASP top vulnerabilities, bad bots, and cross-site scripting attacks.",
            achievements: [
                "Integrated Azure WAF policy groups protecting Azure Application Gateway entries.",
                "Built custom WAF rules to detect and block automated vulnerability crawlers."
            ]
        },
        ingress: {
            value: "App Gateway",
            category: "Load Balancer",
            active: "Azure Application Gateway v2",
            desc: "Layer 7 application load balancer providing cookie-based affinity, URL-path routing, and backend pool distribution for AKS APIs.",
            achievements: [
                "Managed Application Gateway Ingress Controller (AGIC) syncing AKS services with App Gateway backends.",
                "Enforced secure HTTPS connections from clients to backend ingress."
            ]
        },
        gateway: {
            value: "Kong API Gateway",
            category: "API Gateway",
            active: "Kong Enterprise on AKS",
            desc: "Kong API Gateway deployed inside AKS cluster mapping rate-limiting, CORS, and request validations.",
            achievements: [
                "Secured Pay10 payment APIs using JWT credential plugins.",
                "Unified multiple backend endpoints into a single public URL route."
            ]
        },
        mesh: {
            value: "Istio Ambient Mesh",
            category: "Service Mesh",
            active: "Istio Ambient on AKS",
            desc: "Secures service-to-service communication with mutual TLS and Layer 4 authorization policies inside Azure Kubernetes.",
            achievements: [
                "Enforced zero-trust microservice permissions, ensuring security compliance.",
                "Configured traffic mirroring policies, helping run tests against production clones."
            ]
        },
        k8s: {
            value: "Azure AKS",
            category: "Container Orchestration",
            active: "Azure Kubernetes Service Engine",
            desc: "Hosted cluster managing .NET and NestJS payment microservices, utilizing Azure Virtual Network CNI for advanced container networking.",
            achievements: [
                "Configured Azure Active Directory (Entra ID) authentication integration with AKS RBAC.",
                "Maintained AKS upgrades with zero-downtime node drain policies."
            ]
        },
        scaling: {
            value: "KEDA & Auto-Provisioning",
            category: "Autoscaling",
            active: "AKS Node Auto-Provisioning + KEDA",
            desc: "Dynamically scales AKS node pools based on CPU load and message queue counts (Azure Service Bus/Kafka) using KEDA triggers.",
            achievements: [
                "Scaled worker node counts based on Kafka lag metrics.",
                "Utilized Spot instance pool scaling for testing, slashing costs by 60%."
            ]
        },
        secrets: {
            value: "Azure Key Vault",
            category: "Secrets Management",
            active: "Key Vault + Workload Identities",
            desc: "Secure storage for database passwords, API keys, and certificate credentials. Integrates with AKS via Secrets Store CSI Driver.",
            achievements: [
                "Configured AKS Workload Identities, removing the need for static credentials inside pods.",
                "Enforced automatic certificates renewal via Azure Key Vault."
            ]
        },
        db: {
            value: "Azure PostgreSQL",
            category: "Databases",
            active: "Azure Database for PostgreSQL Flexible Server",
            desc: "Managed PostgreSQL server with HA failover, integrated with AKS clusters via Azure Private Links.",
            achievements: [
                "Designed PostgreSQL High Availability utilizing Patroni failover configurations.",
                "Established Azure Private Endpoints, blocking database access from the public internet."
            ]
        },
        cache: {
            value: "Azure Cache for Redis",
            category: "Distributed Caching",
            active: "Azure Cache for Redis Premium Cluster",
            desc: "Fully managed Redis cache serving rapid session stores and caching payment request duplicate validations.",
            achievements: [
                "Optimized caching architecture, handling 15,000+ API requests per minute.",
                "Set up zone-redundancy caches, securing against regional datacenter outages."
            ]
        },
        queue: {
            value: "Kafka (Strimzi) / Service Bus",
            category: "Messaging & Queues",
            active: "Strimzi Apache Kafka on Kubernetes",
            desc: "Apache Kafka deployed inside AKS via Strimzi Operator alongside Azure Service Bus for transactional message routing.",
            achievements: [
                "Implemented Strimzi Kafka cluster with zone-aware topic partition settings.",
                "Established MirrorMaker 2, syncing Kafka messages to backup disaster recovery regions."
            ]
        },
        cicd: {
            value: "GitHub Actions / Argo CD",
            category: "CI/CD & GitOps",
            active: "ArgoCD on AKS + Terraform GitOps",
            desc: "Maintains AKS infrastructure states via Terraform pipelines in GitHub Actions, and deploys Kubernetes objects using ArgoCD GitOps sync.",
            achievements: [
                "Automated complete AKS environments rebuilds via Terraform pipelines.",
                "Enforced pull-request approvals before ArgoCD deploys to production."
            ]
        },
        metrics: {
            value: "Prometheus / Loki / Alloy",
            category: "Metrics & Logs",
            active: "Grafana Alloy + Azure Monitor",
            desc: "Monitors AKS container telemetry, streaming logs to Grafana Loki databases and metrics to Prometheus databases.",
            achievements: [
                "Correlated AKS infrastructure health metrics with Azure Monitor alert rules.",
                "Created centralized Grafana dashboards, unifying Azure infrastructure stats with app logs."
            ]
        },
        tracing: {
            value: "Tempo / Jaeger / Beyla",
            category: "Distributed Tracing",
            active: "OpenTelemetry Tracing Agent",
            desc: "Tracks distributed payment API requests across AKS clusters, rendering call graphs on Grafana Tempo dashboard panels.",
            achievements: [
                "Integrated OpenTelemetry SDK into NestJS backend frameworks.",
                "Reduced transactional trace errors debugging durations from hours to minutes."
            ]
        }
    },
    "on-prem": {
        dns: {
            value: "CoreDNS / BIND",
            category: "Edge & DNS",
            active: "On-Premises BIND9/CoreDNS",
            desc: "Provides internal domain name resolution mapping on-premises servers to router VIP and gateway points.",
            achievements: [
                "Configured split-horizon DNS server settings protecting internal networks details.",
                "Integrated CoreDNS with Kubernetes upstream resolving servers."
            ]
        },
        cdn: {
            value: "Nginx / Varnish",
            category: "Edge & CDN",
            active: "Local Nginx Cache Clusters",
            desc: "On-premises caching proxy servers serving static UI packages and offloading SSL handshakes for localized networks.",
            achievements: [
                "Configured Varnish cache servers, reducing backend load during traffic spikes.",
                "Optimized Nginx buffer sizes, ensuring stable HTTP file transfers."
            ]
        },
        waf: {
            value: "ModSecurity WAF",
            category: "Edge Security",
            active: "ModSecurity WAF on Nginx",
            desc: "Open-source web application firewall analyzing incoming payload patterns to block malicious network requests.",
            achievements: [
                "Configured OWASP Core Rule Sets, blocking SQLi and XSS scripts at edge load balancers.",
                "Implemented rate-limit protections on API endpoints."
            ]
        },
        ingress: {
            value: "MetalLB / KubeVIP",
            category: "Load Balancer",
            active: "MetalLB Layer-2 Mode + KubeVIP",
            desc: "Provides external virtual IP load balancing for bare-metal Kubernetes clusters, routing traffic to Ingress controllers.",
            achievements: [
                "Configured Kube-VIP providing high availability for control plane Kubernetes API servers.",
                "Configured MetalLB IP address pools mapping external VIPs to ingress gateways."
            ]
        },
        gateway: {
            value: "KGateway",
            category: "API Gateway",
            active: "KGateway (formerly Gloo Edge)",
            desc: "Envoy-based API gateway managing traffic control, route mappings, rate limits, and request filtering on-premises.",
            achievements: [
                "Integrated API routing with local LDAP/Active Directory systems.",
                "Configured request size limiters protecting backend APIs against overflow payloads."
            ]
        },
        mesh: {
            value: "Istio Ambient Mesh",
            category: "Service Mesh",
            active: "Istio on Bare-Metal",
            desc: "Zero-trust service mesh enforcing mTLS encryption and network policy permissions on bare-metal node clusters.",
            achievements: [
                "Enforced mTLS encryption between system namespaces, satisfying strict banking security standards.",
                "Created mesh access telemetry dashboards inside Grafana."
            ]
        },
        k8s: {
            value: "Kubernetes (Bare-Metal)",
            category: "Container Orchestration",
            active: "Rancher / kubeadm v1.28+",
            desc: "Self-managed bare-metal Kubernetes nodes orchestrating payment transactions, utilizing Calico for overlay network security.",
            achievements: [
                "Deployed and managed 3 control planes and 5 worker nodes clusters.",
                "Configured Calico Network Policies restricting pod-to-pod communications."
            ]
        },
        scaling: {
            value: "HPA / KEDA",
            category: "Autoscaling",
            active: "Kubernetes Metrics Server + KEDA",
            desc: "Scales on-prem pod counts based on CPU metrics and Kafka/ActiveMQ message queue counts.",
            achievements: [
                "Configured KEDA queues trigger, preventing messaging queues clog during processing peaks.",
                "Optimized pod resource requests limits, increasing server density by 25%."
            ]
        },
        secrets: {
            value: "HashiCorp Vault",
            category: "Secrets Management",
            active: "Vault Cluster + Vault Secrets Operator",
            desc: "Central secrets engine managing system certificates, database credentials, and API tokens. Integrated with pods via Vault Secrets Operator (VSO).",
            achievements: [
                "Configured Vault Secrets Operator dynamically syncing secret variables into Kubernetes secret resources.",
                "Established Vault transit encryption engine, helping encrypt banking logs."
            ]
        },
        db: {
            value: "CloudNativePG",
            category: "Databases",
            active: "PostgreSQL via CloudNativePG Operator",
            desc: "Declarative PostgreSQL databases deployed inside Kubernetes using CloudNativePG, featuring automated replication and local failover routing.",
            achievements: [
                "Configured PG database clusters with synchronous replication pools.",
                "Set up PG connection pooling with pgbouncer pods, preventing connection drops."
            ]
        },
        cache: {
            value: "Redis + Sentinel",
            category: "Distributed Caching",
            active: "On-Premises Redis Sentinel Setup",
            desc: "Highly available caching layer utilizing Redis Sentinel nodes to automatically detect master failures and route traffic to replicas.",
            achievements: [
                "Achieved automatic failover triggers in under 10 seconds during node failures.",
                "Configured disk logging policies ensuring caching states persistence."
            ]
        },
        queue: {
            value: "Apache Kafka / ActiveMQ",
            category: "Messaging & Queues",
            active: "Kafka Cluster + ActiveMQ",
            desc: "Self-managed Apache Kafka and ActiveMQ message brokers managing asynchronous communication flows.",
            achievements: [
                "Configured Kafka cluster with ZooKeeper coordination, hosting 20+ topic queues.",
                "Configured ActiveMQ failover nodes ensuring messaging delivery continuity."
            ]
        },
        cicd: {
            value: "Jenkins / Argo CD",
            category: "CI/CD & GitOps",
            active: "Jenkins Pipelines + ArgoCD GitOps",
            desc: "Orchestrates builds via Jenkins pipelines, generating Docker images pushing to Harbor, and syncing manifests via ArgoCD.",
            achievements: [
                "Designed multi-branch pipelines in Jenkins, automating testing phases.",
                "Integrated ArgoCD sync loops, checking configuration drifts on bare-metal clusters."
            ]
        },
        metrics: {
            value: "Prometheus / Loki / Alloy",
            category: "Metrics & Logs",
            active: "Prometheus Operator + Promtail / Alloy",
            desc: "Aggregates bare-metal system metrics, VM hardware metrics, Loki logs, and Grafana Alloy statistics.",
            achievements: [
                "Configured Prometheus Node Exporter alerting on physical hard drives wear stats.",
                "Centralized bare-metal system syslog streams inside Loki databases."
            ]
        },
        tracing: {
            value: "Tempo / Jaeger / Alloy",
            category: "Distributed Tracing",
            active: "Grafana Alloy Tracing Pipeline",
            desc: "Collects spans via OpenTelemetry pipelines, forwarding them to Grafana Tempo storage inside localized network storage servers.",
            achievements: [
                "Monitored on-premises API response paths, helping optimize query times.",
                "Integrated Jaeger dashboard visualization within Kiali service mesh consoles."
            ]
        }
    }
};

let activeProvider = "aws";
let selectedNodeId = null;

function initCloudVisualizer() {
    const tabs = document.querySelectorAll(".arch-tab");
    const nodeItems = document.querySelectorAll(".node-item");
    
    if (tabs.length === 0 || nodeItems.length === 0) return;

    // Handle tab switching
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const provider = tab.getAttribute("data-target");
            switchProvider(provider);
        });
    });

    // Handle node clicking
    nodeItems.forEach(node => {
        node.addEventListener("click", () => {
            nodeItems.forEach(n => n.classList.remove("selected"));
            node.classList.add("selected");
            
            const nodeId = node.getAttribute("data-node");
            selectedNodeId = nodeId;
            showNodeDetails(nodeId);
        });
    });
}

function switchProvider(provider) {
    activeProvider = provider;
    
    // Animate nodes swapping names
    const nodes = document.querySelectorAll(".node-item");
    nodes.forEach(node => {
        const nodeId = node.getAttribute("data-node");
        const valueEl = node.querySelector(".node-value");
        if (valueEl && architectureData[provider][nodeId]) {
            // Apply scale/fade animation
            valueEl.style.opacity = "0";
            valueEl.style.transform = "scale(0.8)";
            
            setTimeout(() => {
                valueEl.textContent = architectureData[provider][nodeId].value;
                valueEl.style.opacity = "1";
                valueEl.style.transform = "scale(1)";
            }, 200);
        }
    });

    // Update inspector details if a node is currently selected
    if (selectedNodeId) {
        showNodeDetails(selectedNodeId);
    }
}

function showNodeDetails(nodeId) {
    const initialPrompt = document.getElementById("inspector-initial");
    const dataPanel = document.getElementById("inspector-data");
    const categoryEl = document.getElementById("inspect-category");
    const nameEl = document.getElementById("inspect-name");
    const activeEl = document.getElementById("inspect-active");
    const descEl = document.getElementById("inspect-desc");
    const achievementsEl = document.getElementById("inspect-achievements");

    if (!dataPanel || !architectureData[activeProvider][nodeId]) return;

    const data = architectureData[activeProvider][nodeId];

    // Hide initial message, show inspector panel
    if (initialPrompt) initialPrompt.classList.add("hidden");
    dataPanel.classList.remove("hidden");

    // Populate data fields
    categoryEl.textContent = data.category;
    nameEl.textContent = data.value;
    activeEl.textContent = data.active;
    descEl.textContent = data.desc;

    // Render achievements bullets
    achievementsEl.innerHTML = "";
    data.achievements.forEach(ach => {
        const li = document.createElement("li");
        li.textContent = ach;
        achievementsEl.appendChild(li);
    });

    // Scroll details panel slightly into view on mobile
    if (window.innerWidth <= 1024) {
        dataPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

/* --- Skills Live Filtering & Search --- */
function initSkillsFilter() {
    const searchInput = document.getElementById("skill-search");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const skillItems = document.querySelectorAll(".skill-item");

    if (!skillItems.length) return;

    let activeFilter = "all";
    let searchQuery = "";

    function filterSkills() {
        skillItems.forEach(item => {
            const category = item.getAttribute("data-category");
            const skillName = item.querySelector(".skill-name").textContent.toLowerCase();
            const skillDesc = item.querySelector(".skill-description").textContent.toLowerCase();
            
            const matchesCategory = activeFilter === "all" || category === activeFilter;
            const matchesSearch = skillName.includes(searchQuery) || skillDesc.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        });
    }

    // Handle button clicks
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeFilter = btn.getAttribute("data-filter");
            filterSkills();
        });
    });

    // Handle text input search
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterSkills();
        });
    }
}

/* --- Contact Information Copy to Clipboard --- */
window.copyText = function(text, tooltipId) {
    navigator.clipboard.writeText(text).then(() => {
        const tooltip = document.getElementById(tooltipId);
        if (tooltip) {
            const originalText = tooltip.textContent;
            tooltip.textContent = "Copied!";
            tooltip.style.opacity = "1";
            
            setTimeout(() => {
                tooltip.textContent = originalText;
                tooltip.style.opacity = ""; // Reset inline style to allow CSS hover rules
            }, 2000);
        }
    }).catch(err => {
        console.error("Could not copy text: ", err);
    });
};

/* --- Secure Contact Form Mock --- */
function initContactForm() {
    const contactForm = document.getElementById("portfolio-contact-form");
    const successMsg = document.getElementById("form-success");

    if (!contactForm) return;

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Simulate form sending
        const submitBtn = contactForm.querySelector("button[type='submit']");
        const originalBtnHtml = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Encrypting & Sending...';

        setTimeout(() => {
            // Success callback
            contactForm.classList.add("hidden");
            if (successMsg) successMsg.classList.remove("hidden");
            
            // Log message parameters safely (since it's a static site demonstration)
            const formData = new FormData(contactForm);
            console.log("Mock Form Received successfully:", Object.fromEntries(formData.entries()));
        }, 1500);
    });
}

/* --- Case Studies Gallery & Modal Lightbox Engine --- */
const caseStudiesData = {
    "node-devsecops": {
        category: "Enterprise DevSecOps",
        title: "Enterprise Node.js DevSecOps Pipeline",
        image: "node_devsecops_pipeline.png",
        summary: "Designed and implemented a comprehensive end-to-end DevSecOps pipeline for enterprise Node.js microservices, incorporating shift-left security checks, container image scanning, vulnerability remediation lifecycle with SLAs, container signing, and runtime compliance monitoring.",
        tech: ["Jenkins CI", "Gitleaks", "Semgrep", "NJSSCAN", "Retire.js", "Trivy", "DefectDojo", "Cosign", "Harbor", "ArgoCD", "Kubernetes", "Kyverno", "Falco", "Wazuh SIEM"],
        details: [
            "<strong>CI & Build Stages:</strong> Triggered on Git push to run automated npm installations, dependency checks (npm audit), and Jest unit testing in Jenkins runners.",
            "<strong>Shift-Left Code Scanning:</strong> Integrates Gitleaks for hardcoded credentials, Semgrep and NJSSCAN for static code analysis, Retire.js for vulnerable libraries, and Dependency-Check to generate CycloneDX SBOMs.",
            "<strong>Image Security & SLA Tracking:</strong> Builds optimized Docker containers verified by Trivy, aggregating reports inside DefectDojo. Integrates a Jira loop enforcing strict SLAs (Critical: 7d, High: 15d, Medium: 30d, Low: 90d) for developer remediation.",
            "<strong>Secure GitOps & Runtime:</strong> Signs container images using Cosign and uploads them to Harbor. ArgoCD deploys to Kubernetes clusters secured by Kyverno rules, Calico network zoning, and active threat collectors (Falco kernel-watcher, Wazuh HIDS agents, and Wazuh SIEM dashboarding)."
        ]
    },
    "payment-aws": {
        category: "Enterprise Payment Platform",
        title: "Multi-Account Payment Architecture on AWS",
        image: "ChatGPT Image Aug 9, 2026, 10_19_30 AM.png",
        summary: "Designed and deployed a highly available, scalable, and secure payment processing network on Amazon Web Services (AWS) hosting Next.js and NestJS/.NET microservices.",
        tech: ["AWS EKS", "Istio Ambient Mesh", "Kong API Gateway", "Karpenter", "Terraform", "RDS PostgreSQL", "Amazon MSK (Kafka)", "AWS Secrets Manager"],
        details: [
            "<strong>High-Scale Orchestration:</strong> Orchestrated 7 NestJS and 40 .NET 6 microservices on Amazon EKS across 3 Availability Zones (AZ) for fault-tolerance.",
            "<strong>Autoscaling Optimization:</strong> Automated pod-level scaling via KEDA (queue-driven) and HPA, coupled with Karpenter right-sizing EC2 node provisioning, reducing AWS infrastructure costs by 30-40%.",
            "<strong>Zero-Trust Mesh:</strong> Configured Istio Ambient Mesh to enforce sidecarless mTLS, end-to-end encryption-in-transit, and granular namespace authorization rules.",
            "<strong>Edge Routing & Security:</strong> Integrated Route 53, CloudFront edge-cache, AWS WAF, and Kong API Gateway for JWT authentication, rate-limiting, and IP whitelisting."
        ]
    },
    "payment-onprem": {
        category: "Enterprise Payment Platform",
        title: "Highly Available Payment Platform On-Premises",
        image: "ChatGPT Image Aug 9, 2026, 10_42_28 AM.png",
        summary: "Engineered a resilient on-premises bare-metal Kubernetes cluster for payment processing complying with local banking regulatory data privacy standards.",
        tech: ["Kubernetes", "Calico CNI", "KGateway", "MetalLB / KubeVIP", "HashiCorp Vault", "Velero", "CloudNativePG", "Apache Kafka", "ActiveMQ"],
        details: [
            "<strong>Local Load Balancing:</strong> Deployed MetalLB in Layer-2 mode combined with Kube-VIP to provide external load balancing virtual IPs for bare-metal Kubernetes entry.",
            "<strong>Operator-Driven Databases:</strong> Deployed high-availability PostgreSQL clusters using the CloudNativePG Operator, incorporating synchronous streaming replication and automatic failover.",
            "<strong>Secrets Operations:</strong> Configured HashiCorp Vault Secrets Operator (VSO) to inject dynamic database credentials and cryptographic keys directly into Kubernetes namespaces.",
            "<strong>Messaging Middleware:</strong> Managed Apache Kafka in KRaft mode alongside ActiveMQ failover clusters for reliable transactional ledger message queuing."
        ]
    },
    "padospay-aws": {
        category: "Freelance / Fintech Project",
        title: "PadosPay: WhatsApp Payment Automation on AWS",
        image: "ChatGPT Image Aug 9, 2026, 10_07_43 AM.png",
        summary: "Developed the cloud infrastructure for PadosPay, a serverless WhatsApp chatbot payment platform utilizing AWS ECS container fleets for message-to-payment flows.",
        tech: ["AWS ECS Fargate", "Application Load Balancer", "Route 53", "Meta Graph API", "Amazon RDS PostgreSQL", "ElastiCache Redis", "GitHub Actions"],
        details: [
            "<strong>Serverless Containers:</strong> Designed and deployed Dockerized microservices (WhatsApp Webhook Service, Payment engine, Notification scheduler) on AWS ECS Fargate, scaling based on API loads.",
            "<strong>Webhook Routing:</strong> Scaled ECS Fargate webhooks to handle incoming WhatsApp messages from Meta APIs via Application Load Balancer with zero packet loss.",
            "<strong>Caching:</strong> Integrated ElastiCache Redis Cluster to cache user session chatbot states, reducing query latency below 2ms.",
            "<strong>CI/CD pipeline:</strong> Built GitHub Actions workflows to compile, test, build, push docker images to ECR, and execute ECS update-service tasks automatically."
        ]
    },
    "ragnarok-azure": {
        category: "Freelance / AIops Project",
        title: "Agentic PM & RAGNAROK AI Applications on Azure",
        image: "ChatGPT Image Aug 9, 2026, 10_15_08 AM.png",
        summary: "Designed a secure and scale-ready AI enterprise application on Microsoft Azure utilizing Azure OpenAI, Cognitive Search, and AKS for agentic workflow automations.",
        tech: ["Azure AKS", "Azure OpenAI Service", "Azure AI Search", "Microsoft Entra ID", "Private Endpoints", "Azure Service Bus", "Key Vault"],
        details: [
            "<strong>AI Microservices:</strong> Deployed Agent Service (LLM orchestrators), Prompt Orchestrator, and Document parsing systems on Azure Kubernetes Service (AKS).",
            "<strong>Private Network Access:</strong> Established Azure Private Endpoints for all backend PaaS connections (Azure OpenAI, AI Search, Blob Storage, Azure SQL), disabling public internet entry.",
            "<strong>Autoscaling:</strong> Integrated KEDA to scale prompt orchestrator pods dynamically based on queue lag in Azure Service Bus.",
            "<strong>Secrets & Identity:</strong> Configured AKS Workload Identities to map pods to Entra ID client permissions, managing keys inside Azure Key Vault."
        ]
    },
    "flutter-ios-devsecops": {
        category: "Mobile DevOps & Security",
        title: "Flutter iOS DevSecOps Pipeline (IPA)",
        image: "WhatsApp Image 2026-08-15 at 5.34.19 PM.jpeg",
        summary: "Built a fully automated secure Jenkins pipeline for building, scanning, and storing Flutter iOS applications (IPA packages) with shift-left security.",
        tech: ["Jenkins", "Gitleaks", "Semgrep SAST", "OSV-Scanner", "Fastlane", "MobSF Scanner", "Apple codesign", "SeaweedFS", "SonarQube"],
        details: [
            "<strong>Shift-Left Security:</strong> Integrated Gitleaks for pre-build secret scanning, Semgrep for Static Application Security Testing (SAST), and OSV-Scanner for dependency CVE checks.",
            "<strong>Fastlane Match Integration:</strong> Automated iOS code-signing by syncing provisioning profiles and certificates from git repository via Fastlane Match.",
            "<strong>Mobile Security Scanning:</strong> Automated MobSF dynamic/static scans and run Apple codesign signature verification gates.",
            "<strong>Binary Storage:</strong> Set up SeaweedFS storage targets to store compilation packages (IPAs) for QA and UAT distribution."
        ]
    },
    "flutter-android-devsecops": {
        category: "Mobile DevOps & Security",
        title: "Flutter Android DevSecOps Pipeline (APK)",
        image: "WhatsApp Image 2026-08-15 at 5.34.20 PM.jpeg",
        summary: "Implemented a DevSecOps release pipeline for Flutter Android apps, enforcing security scan gates before build distribution.",
        tech: ["Jenkins", "Gitleaks", "Semgrep", "OSV-Scanner", "Fastlane", "MobSF", "apksigner", "SeaweedFS", "SonarQube"],
        details: [
            "<strong>Security Gates:</strong> Designed quality gates checking Semgrep SAST logs, breaking Jenkins builds if critical vulnerabilities are found.",
            "<strong>Automated Keystore Signing:</strong> Configured Fastlane to compile Android bundles (AAB) and sign them using keystores fetched from secure vaults.",
            "<strong>Signature Checks:</strong> Integrated Android apksigner validation gates to confirm build signing integrity before upload.",
            "<strong>Dashboards:</strong> Consolidated vulnerabilities data feeds into a unified DefectDojo dashboard dashboard tracked in Grafana."
        ]
    },
    "flutter-ios-cicd": {
        category: "Mobile Release Pipelines",
        title: "Flutter iOS App Store Release Architecture",
        image: "ChatGPT Image Aug 15, 2026, 03_10_54 PM.png",
        summary: "Engineered automated app store submission pipelines for iOS payment applications using GitHub Actions and Fastlane integrations.",
        tech: ["GitHub Actions", "Fastlane (Match/Gym/Pilot)", "Xcode CLI", "TestFlight", "App Store Connect API", "Firebase Crashlytics"],
        details: [
            "<strong>Pipeline Automation:</strong> Configured GitHub Actions composite workflows to spin up macOS runners, cache CocoaPods, and setup Xcode build environments.",
            "<strong>Fastlane Match:</strong> Orchestrated automated certificates fetching and keychain unlocking inside ephemeral CI agents.",
            "<strong>Distribution Gates:</strong> Automated binary submissions to TestFlight (Beta) and compiled release notes; configured Firebase Crashlytics monitoring integrations.",
            "<strong>App Store Deploy:</strong> Configured Fastlane Deliver to automatically push verified IPA builds, metadata, and screenshots directly into App Store Connect."
        ]
    },
    "flutter-android-cicd": {
        category: "Mobile Release Pipelines",
        title: "Flutter Android Beta Release Architecture",
        image: "WhatsApp Image 2026-08-15 at 2.56.59 PM.jpeg",
        summary: "Designed and deployed a continuous deployment pipeline for Android applications compiling APK/AAB packages and distributing builds.",
        tech: ["GitHub Actions", "Fastlane", "Gradle Build Tools", "Android SDK", "Firebase App Distribution", "Keystore Secure Management"],
        details: [
            "<strong>Gradle Compilation:</strong> Automated build flavor packaging (Dev, Staging, Prod) inside GitHub Actions runners utilizing optimized caching setups.",
            "<strong>Keystore Security:</strong> Managed Base64 encoded keystore variables stored in GitHub Secrets, decrypted dynamically to sign APK/AAB outputs.",
            "<strong>Firebase App Distribution:</strong> Integrated automated triggers to upload signed build outputs to Firebase, alerting tester groups via Slack channels.",
            "<strong>Feedback Loop:</strong> Bound crash telemetry data points to GitHub Issues, creating an automated bug tracing system."
        ]
    },
    "monitoring-lgtm": {
        category: "Observability & Telemetry",
        title: "Enterprise Observability via LGTM & eBPF",
        image: "ChatGPT Image Aug 10, 2026, 05_15_13 AM.png",
        summary: "Implemented a modern, highly integrated observability mesh using Grafana LGTM stack and zero-code eBPF collection strategies.",
        tech: ["Prometheus", "Loki", "Tempo", "Grafana", "Grafana Alloy", "Grafana Beyla (eBPF)", "Kiali", "Alertmanager"],
        details: [
            "<strong>eBPF Instrumentation:</strong> Configured Grafana Beyla to automatically collect L4/L7 service metrics and traces at the kernel level, eliminating the need to alter application code.",
            "<strong>Log Aggregation:</strong> Streamed log pipelines using Grafana Alloy collector agents, organizing fields inside Loki log storage.",
            "<strong>Distributed Tracing:</strong> Configured OpenTelemetry spans forwarded to Tempo, linking log searches directly to individual transaction traces (exemplars).",
            "<strong>Alerting Policies:</strong> Configured Alertmanager rules raising PagerDuty and Slack alerts based on anomaly threshold detections."
        ]
    },
    "monitoring-elk": {
        category: "Observability & Telemetry",
        title: "Log Analytics & APM via ELK Stack",
        image: "ChatGPT Image Aug 10, 2026, 05_25_01 AM.png",
        summary: "Deploys enterprise-grade log monitoring and application performance management systems using Elasticsearch, Logstash, and Kibana.",
        tech: ["Elasticsearch Cluster", "Logstash Queues", "Beats (Filebeat/Metricbeat)", "Elastic APM Server", "Kibana Dashboards", "ElastAlert"],
        details: [
            "<strong>Beats Shippers:</strong> Deployed Filebeat, Metricbeat, and Auditbeat daemonsets inside Kubernetes nodes to stream log/metrics streams.",
            "<strong>Logstash Pipeline:</strong> Configured Logstash processing pipelines to parse, enrich, filter, and route JSON records into Elasticsearch indices.",
            "<strong>APM Tracking:</strong> Set up Elastic APM agents in Java and .NET frameworks to map distributed transaction latency metrics and trace spans.",
            "<strong>Visualization:</strong> Created comprehensive operational dashboards inside Kibana, configuring ElastAlert integrations to notify Slack channels."
        ]
    },
    "dotnet-devsecops": {
        category: "CI/CD & DevSecOps",
        title: ".NET Backend Release Pipeline Topology",
        image: "dotnet_devsecops_diagram_v2 1 (1).png",
        summary: "Detailed pipeline layout configured for .NET payment backend servers incorporating Jenkins pipelines and ArgoCD deployment systems.",
        tech: ["Jenkins", "ArgoCD", "SonarQube", "Trivy Scan", "Docker", "Amazon ECR", "Amazon EKS"],
        details: [
            "<strong>Code Scans:</strong> Integrated static code quality scans (SonarQube) and security vulnerability scans (Trivy) directly into Jenkins build pipelines.",
            "<strong>Container Security:</strong> Enforced image scanning gates breaking Jenkins stages if base images contain critical CVE exploits.",
            "<strong>GitOps Sync:</strong> Tied Jenkins builds to update configuration variables in deployment git repositories, triggering ArgoCD to sync EKS clusters.",
            "<strong>Operational Auditing:</strong> Established audit logging on Jenkins and ArgoCD actions, verifying change management compliance."
        ]
    }
};

function initLightbox() {
    const cards = document.querySelectorAll(".gallery-card");
    const modal = document.getElementById("lightbox-modal");
    const closeBtn = document.getElementById("lightbox-close");
    
    if (!modal) return;

    // Open Lightbox
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const studyId = card.getAttribute("data-study");
            const data = caseStudiesData[studyId];
            if (!data) return;

            // Populate Modal Content
            document.getElementById("modal-category").textContent = data.category;
            document.getElementById("modal-title").textContent = data.title;
            document.getElementById("modal-summary").textContent = data.summary;
            
            // Handle relative image path in workspace
            document.getElementById("modal-img").src = data.image;
            document.getElementById("modal-img").alt = data.title;

            // Render Tech Tags
            const tagsContainer = document.getElementById("modal-tech-tags");
            tagsContainer.innerHTML = "";
            data.tech.forEach(t => {
                const span = document.createElement("span");
                span.className = "tag";
                span.textContent = t;
                tagsContainer.appendChild(span);
            });

            // Render Details Bullets
            const detailsContainer = document.getElementById("modal-details-list");
            detailsContainer.innerHTML = "";
            data.details.forEach(det => {
                const li = document.createElement("li");
                li.innerHTML = det;
                detailsContainer.appendChild(li);
            });

            // Show Modal
            modal.classList.add("open");
            document.body.style.overflow = "hidden"; // Lock scroll
        });
    });

    // Close Lightbox function
    function closeModal() {
        modal.classList.remove("open");
        document.body.style.overflow = "auto"; // Restore scroll
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    
    // Close on clicking backdrop
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on pressing Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });
}
