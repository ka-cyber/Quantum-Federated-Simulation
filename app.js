// Quantum-Enhanced Federated Edge Intelligence Simulation
class SimulationEngine {
    constructor() {
        this.isRunning = false;
        this.startTime = Date.now();
        this.currentTime = 0;
        this.frameRate = 60;
        this.lastFrameTime = 0;
        this.fps = 60;
        
        // Initialize all subsystems
        this.quantumLayer = new QuantumCommunicationLayer();
        this.federatedLearning = new FederatedLearningFramework();
        this.cyberPhysical = new CyberPhysicalSystems();
        this.networkSim = new NetworkSimulation();
        this.securitySystem = new AdversarialDefenseSystem();
        
        // Charts and visualizations
        this.charts = {};
        this.activePanel = 'overview';
        
        // Performance monitoring
        this.performance = {
            fps: 60,
            cpuUsage: 0,
            memUsage: 0
        };
        
        this.initializeUI();
        this.initializeCharts();
        this.setupEventListeners();
        this.start();
    }

    initializeUI() {
        // Navigation setup with explicit event handling
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const component = item.getAttribute('data-component');
                console.log('Switching to component:', component);
                this.switchPanel(component);
            });
        });

        // Control buttons
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const clearLogsBtn = document.getElementById('clearLogs');

        if (playBtn) playBtn.addEventListener('click', () => this.start());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
        if (clearLogsBtn) clearLogsBtn.addEventListener('click', () => this.clearLogs());

        // Parameter controls
        this.setupParameterControls();
    }

    setupParameterControls() {
        const attackSlider = document.getElementById('attackIntensity');
        const noiseSlider = document.getElementById('networkNoise');
        const participationSlider = document.getElementById('clientParticipation');

        if (attackSlider) {
            attackSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                const valueDisplay = document.getElementById('attackValue');
                if (valueDisplay) valueDisplay.textContent = value + '%';
                this.securitySystem.setAttackIntensity(value / 100);
            });
        }

        if (noiseSlider) {
            noiseSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                const valueDisplay = document.getElementById('noiseValue');
                if (valueDisplay) valueDisplay.textContent = value + '%';
                this.networkSim.setNoiseLevel(value / 100);
            });
        }

        if (participationSlider) {
            participationSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                const valueDisplay = document.getElementById('participationValue');
                if (valueDisplay) valueDisplay.textContent = value + '%';
                this.federatedLearning.setParticipationRate(value / 100);
            });
        }
    }

    initializeCharts() {
        // System Performance Chart
        const ctx1 = document.getElementById('systemPerformanceChart');
        if (ctx1) {
            this.charts.systemPerformance = new Chart(ctx1.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Quantum Fidelity',
                        data: [],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true
                    }, {
                        label: 'FL Accuracy',
                        data: [],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        fill: true
                    }, {
                        label: 'CPS Safety',
                        data: [],
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 1
                        }
                    }
                }
            });
        }

        // Quantum Chart
        const ctx2 = document.getElementById('quantumChart');
        if (ctx2) {
            this.charts.quantum = new Chart(ctx2.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Key Generation Rate',
                        data: [],
                        borderColor: '#5D878F',
                        yAxisID: 'y'
                    }, {
                        label: 'Error Rate (%)',
                        data: [],
                        borderColor: '#DB4545',
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: {
                                drawOnChartArea: false,
                            }
                        }
                    }
                }
            });
        }

        // FL Convergence Chart
        const ctx3 = document.getElementById('convergenceChart');
        if (ctx3) {
            this.charts.convergence = new Chart(ctx3.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Training Loss',
                        data: [],
                        borderColor: '#D2BA4C',
                        yAxisID: 'y'
                    }, {
                        label: 'Accuracy',
                        data: [],
                        borderColor: '#1FB8CD',
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            position: 'left'
                        },
                        y1: {
                            beginAtZero: true,
                            max: 1,
                            position: 'right'
                        }
                    }
                }
            });
        }

        // Control Chart
        const ctx4 = document.getElementById('controlChart');
        if (ctx4) {
            this.charts.control = new Chart(ctx4.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Control Signal',
                        data: [],
                        borderColor: '#964325'
                    }, {
                        label: 'Safety Constraint',
                        data: [],
                        borderColor: '#944454'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Network Chart
        const ctx5 = document.getElementById('networkChart');
        if (ctx5) {
            this.charts.network = new Chart(ctx5.getContext('2d'), {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Latency (ms)',
                        data: [],
                        borderColor: '#13343B'
                    }, {
                        label: 'Throughput (Mbps)',
                        data: [],
                        borderColor: '#1FB8CD'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Threat Chart
        const ctx6 = document.getElementById('threatChart');
        if (ctx6) {
            this.charts.threat = new Chart(ctx6.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Low', 'Medium', 'High', 'Critical'],
                    datasets: [{
                        data: [12, 8, 3, 0],
                        backgroundColor: ['#ECEBD5', '#FFC185', '#B4413C', '#DB4545']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    setupEventListeners() {
        // Resize handler for charts
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                if (chart) chart.resize();
            });
        });
    }

    switchPanel(component) {
        console.log('switchPanel called with component:', component);
        
        // Update navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-component="${component}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Update panels
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = document.getElementById(`${component}-panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
            console.log('Switched to panel:', `${component}-panel`);
        } else {
            console.error('Panel not found:', `${component}-panel`);
        }

        this.activePanel = component;
        
        // Force chart resize after panel switch
        setTimeout(() => {
            Object.values(this.charts).forEach(chart => {
                if (chart) chart.resize();
            });
        }, 100);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.currentTime;
            this.updateStatus('running', 'System Running');
            this.animate();
            this.log('info', 'Simulation started');
        }
    }

    pause() {
        this.isRunning = false;
        this.updateStatus('paused', 'System Paused');
        this.log('warning', 'Simulation paused');
    }

    reset() {
        console.log('Reset button clicked');
        this.isRunning = false;
        this.currentTime = 0;
        this.startTime = Date.now();
        
        // Reset all subsystems
        this.quantumLayer.reset();
        this.federatedLearning.reset();
        this.cyberPhysical.reset();
        this.networkSim.reset();
        this.securitySystem.reset();

        // Clear charts
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.data) {
                chart.data.labels = [];
                chart.data.datasets.forEach(dataset => {
                    dataset.data = [];
                });
                chart.update();
            }
        });

        // Reset UI elements
        this.updateTimeDisplay();
        this.updateOverviewMetrics();
        
        this.clearLogs();
        this.updateStatus('paused', 'System Reset');
        this.log('info', 'Simulation reset to initial conditions');
        
        // Restart simulation
        setTimeout(() => {
            this.start();
        }, 500);
    }

    updateStatus(status, text) {
        const statusElement = document.getElementById('systemStatus');
        if (statusElement) {
            const dot = statusElement.querySelector('.status-dot');
            const span = statusElement.querySelector('span');
            
            if (dot) dot.className = `status-dot ${status}`;
            if (span) span.textContent = text;
        }
    }

    animate() {
        if (!this.isRunning) return;

        const now = Date.now();
        this.currentTime = now - this.startTime;
        
        // Calculate FPS
        if (now - this.lastFrameTime >= 1000) {
            this.fps = Math.round(1000 / (now - this.lastFrameTime) * 60);
            this.lastFrameTime = now;
        }

        // Update all subsystems
        this.quantumLayer.update(this.currentTime);
        this.federatedLearning.update(this.currentTime);
        this.cyberPhysical.update(this.currentTime);
        this.networkSim.update(this.currentTime);
        this.securitySystem.update(this.currentTime);

        // Update UI
        this.updateUI();
        this.updatePerformanceMetrics();

        requestAnimationFrame(() => this.animate());
    }

    updateUI() {
        this.updateTimeDisplay();
        this.updateOverviewMetrics();

        // Update component-specific UI based on active panel
        switch(this.activePanel) {
            case 'quantum':
                this.updateQuantumUI();
                break;
            case 'federated':
                this.updateFederatedUI();
                break;
            case 'cps':
                this.updateCPSUI();
                break;
            case 'network':
                this.updateNetworkUI();
                break;
            case 'security':
                this.updateSecurityUI();
                break;
        }

        this.updateCharts();
    }

    updateTimeDisplay() {
        const timeStr = this.formatTime(this.currentTime);
        const timeElement = document.getElementById('simulationTime');
        if (timeElement) {
            timeElement.textContent = timeStr;
        }
    }

    updateOverviewMetrics() {
        // Update overview metrics
        const quantumFidelityEl = document.getElementById('quantumFidelity');
        const flAccuracyEl = document.getElementById('flAccuracy');
        const cpsSafetyEl = document.getElementById('cpsSafety');
        const networkReliabilityEl = document.getElementById('networkReliability');

        if (quantumFidelityEl) {
            quantumFidelityEl.textContent = this.quantumLayer.getCurrentFidelity().toFixed(3);
        }
        if (flAccuracyEl) {
            flAccuracyEl.textContent = this.federatedLearning.getCurrentAccuracy().toFixed(3);
        }
        if (cpsSafetyEl) {
            cpsSafetyEl.textContent = (this.cyberPhysical.getSafetyRate() * 100).toFixed(1) + '%';
        }
        if (networkReliabilityEl) {
            networkReliabilityEl.textContent = (this.networkSim.getReliability() * 100).toFixed(1) + '%';
        }
    }

    updateQuantumUI() {
        // Draw fidelity gauge
        this.drawFidelityGauge();
        
        // Update quantum stats
        const keysGenEl = document.getElementById('keysGenerated');
        const keyRateEl = document.getElementById('keyRate');
        const errorRateEl = document.getElementById('errorRate');

        if (keysGenEl) {
            keysGenEl.textContent = this.quantumLayer.getTotalKeysGenerated().toLocaleString();
        }
        if (keyRateEl) {
            keyRateEl.textContent = this.quantumLayer.getCurrentKeyRate().toLocaleString();
        }
        if (errorRateEl) {
            errorRateEl.textContent = (this.quantumLayer.getCurrentErrorRate() * 100).toFixed(2) + '%';
        }
    }

    drawFidelityGauge() {
        const canvas = document.getElementById('fidelityCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 70;
        const fidelity = this.quantumLayer.getCurrentFidelity();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 0.25 * Math.PI);
        ctx.lineWidth = 10;
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border') || '#ccc';
        ctx.stroke();

        // Fidelity arc
        const endAngle = 0.75 * Math.PI + (fidelity - 0.9) / 0.1 * 1.5 * Math.PI;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, endAngle);
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary') || '#1FB8CD';
        ctx.stroke();

        // Text
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text') || '#000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((fidelity * 100).toFixed(1) + '%', centerX, centerY);
    }

    updateFederatedUI() {
        // Draw FL network visualization
        this.drawFLNetwork();
        
        // Update FL stats
        const currentRoundEl = document.getElementById('currentRound');
        const activeClientsEl = document.getElementById('activeClients');
        const byzantineDetectedEl = document.getElementById('byzantineDetected');
        const avgTrustScoreEl = document.getElementById('avgTrustScore');

        if (currentRoundEl) {
            currentRoundEl.textContent = this.federatedLearning.getCurrentRound();
        }
        if (activeClientsEl) {
            activeClientsEl.textContent = `${this.federatedLearning.getActiveClients()}/50`;
        }
        if (byzantineDetectedEl) {
            byzantineDetectedEl.textContent = this.federatedLearning.getByzantineDetected();
        }
        if (avgTrustScoreEl) {
            avgTrustScoreEl.textContent = this.federatedLearning.getAverageTrustScore().toFixed(2);
        }
    }

    drawFLNetwork() {
        const canvas = document.getElementById('flNetworkCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw clients in a circular layout
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 120;
        const numClients = 50;
        
        // Draw server at center
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary') || '#1FB8CD';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw clients
        for (let i = 0; i < numClients; i++) {
            const angle = (i / numClients) * 2 * Math.PI;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            const client = this.federatedLearning.getClient(i);
            if (client && client.isActive) {
                if (client.isByzantine) {
                    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-error') || '#DB4545';
                } else {
                    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-success') || '#1FB8CD';
                }
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw connection line
                ctx.strokeStyle = client.isByzantine ? 
                    (getComputedStyle(document.documentElement).getPropertyValue('--color-error') || '#DB4545') :
                    (getComputedStyle(document.documentElement).getPropertyValue('--color-border') || '#ccc');
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    }

    updateCPSUI() {
        // Update 3D drone visualization
        this.updateDroneVisualization();
        
        // Update CPS metrics
        const lyapunovValueEl = document.getElementById('lyapunovValue');
        const safetyMarginEl = document.getElementById('safetyMargin');
        const controlFreqEl = document.getElementById('controlFreq');

        if (lyapunovValueEl) {
            lyapunovValueEl.textContent = this.cyberPhysical.getLyapunovValue().toFixed(3);
        }
        if (safetyMarginEl) {
            safetyMarginEl.textContent = (this.cyberPhysical.getSafetyMargin() * 100).toFixed(1) + '%';
        }
        if (controlFreqEl) {
            controlFreqEl.textContent = '100 Hz';
        }
    }

    updateDroneVisualization() {
        // Simplified 2D representation
        const container = document.getElementById('droneVisualization');
        if (!container) return;
        
        if (!container.querySelector('canvas')) {
            const canvas = document.createElement('canvas');
            canvas.width = container.clientWidth || 400;
            canvas.height = container.clientHeight || 300;
            container.appendChild(canvas);
        }
        
        const canvas = container.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw drone positions
        const drones = this.cyberPhysical.getDronePositions();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 10;
        
        drones.forEach((pos, i) => {
            const x = centerX + pos[0] * scale;
            const y = centerY + pos[1] * scale;
            
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary') || '#1FB8CD';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw drone ID
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text') || '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`D${i+1}`, x, y + 20);
        });
    }

    updateNetworkUI() {
        // Draw network topology
        this.drawNetworkTopology();
        
        // Update network metrics
        const avgLatencyEl = document.getElementById('avgLatency');
        const throughputEl = document.getElementById('throughput');
        const packetLossEl = document.getElementById('packetLoss');
        const rlncEfficiencyEl = document.getElementById('rlncEfficiency');

        if (avgLatencyEl) {
            avgLatencyEl.textContent = this.networkSim.getAverageLatency().toFixed(1) + 'ms';
        }
        if (throughputEl) {
            throughputEl.textContent = Math.round(this.networkSim.getThroughput() / 1000000) + ' Mbps';
        }
        if (packetLossEl) {
            packetLossEl.textContent = (this.networkSim.getPacketLoss() * 100).toFixed(2) + '%';
        }
        if (rlncEfficiencyEl) {
            rlncEfficiencyEl.textContent = (this.networkSim.getRLNCEfficiency() * 100).toFixed(1) + '%';
        }
    }

    drawNetworkTopology() {
        const canvas = document.getElementById('networkCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw network nodes in a grid pattern
        const numNodes = 50;
        const cols = 10;
        const rows = 5;
        const nodeSpacingX = width / (cols + 1);
        const nodeSpacingY = height / (rows + 1);
        
        for (let i = 0; i < numNodes; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = (col + 1) * nodeSpacingX;
            const y = (row + 1) * nodeSpacingY;
            
            const node = this.networkSim.getNode(i);
            if (!node) continue;
            
            // Node color based on status
            let color = getComputedStyle(document.documentElement).getPropertyValue('--color-success') || '#1FB8CD';
            if (node.latency > 50) color = getComputedStyle(document.documentElement).getPropertyValue('--color-warning') || '#FFC185';
            if (node.packetLoss > 0.02) color = getComputedStyle(document.documentElement).getPropertyValue('--color-error') || '#DB4545';
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw connections to nearby nodes
            if (col < cols - 1) {
                const nextX = (col + 2) * nodeSpacingX;
                ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border') || '#ccc';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nextX, y);
                ctx.stroke();
            }
            
            if (row < rows - 1) {
                const nextY = (row + 2) * nodeSpacingY;
                ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border') || '#ccc';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, nextY);
                ctx.stroke();
            }
        }
    }

    updateSecurityUI() {
        // Update threat timeline
        this.updateThreatTimeline();
        
        // Update security stats
        const threatsDetectedEl = document.getElementById('threatsDetected');
        const falsePositivesEl = document.getElementById('falsePositives');
        const mitigationRateEl = document.getElementById('mitigationRate');

        if (threatsDetectedEl) {
            threatsDetectedEl.textContent = this.securitySystem.getTotalThreats();
        }
        if (falsePositivesEl) {
            falsePositivesEl.textContent = this.securitySystem.getFalsePositives();
        }
        if (mitigationRateEl) {
            mitigationRateEl.textContent = (this.securitySystem.getMitigationRate() * 100).toFixed(1) + '%';
        }
    }

    updateThreatTimeline() {
        const timeline = document.getElementById('threatTimeline');
        if (!timeline) return;
        
        const threats = this.securitySystem.getRecentThreats();
        
        timeline.innerHTML = '';
        
        threats.forEach(threat => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            const time = document.createElement('div');
            time.className = 'timeline-time';
            time.textContent = this.formatTime(threat.timestamp);
            
            const event = document.createElement('div');
            event.className = 'timeline-event';
            event.textContent = threat.description;
            
            item.appendChild(time);
            item.appendChild(event);
            timeline.appendChild(item);
        });
    }

    updateCharts() {
        const timeLabel = this.formatTime(this.currentTime);
        const maxPoints = 50;
        
        // System Performance Chart
        if (this.charts.systemPerformance) {
            const sysChart = this.charts.systemPerformance;
            sysChart.data.labels.push(timeLabel);
            sysChart.data.datasets[0].data.push(this.quantumLayer.getCurrentFidelity());
            sysChart.data.datasets[1].data.push(this.federatedLearning.getCurrentAccuracy());
            sysChart.data.datasets[2].data.push(this.cyberPhysical.getSafetyRate());
            
            if (sysChart.data.labels.length > maxPoints) {
                sysChart.data.labels.shift();
                sysChart.data.datasets.forEach(dataset => dataset.data.shift());
            }
            sysChart.update('none');
        }

        // Update other charts similarly
        this.updateQuantumChart(timeLabel, maxPoints);
        this.updateConvergenceChart(timeLabel, maxPoints);
        this.updateControlChart(timeLabel, maxPoints);
        this.updateNetworkChart(timeLabel, maxPoints);
        this.updateThreatChart();
    }

    updateQuantumChart(timeLabel, maxPoints) {
        const chart = this.charts.quantum;
        if (!chart) return;
        
        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(this.quantumLayer.getCurrentKeyRate());
        chart.data.datasets[1].data.push(this.quantumLayer.getCurrentErrorRate() * 100);
        
        if (chart.data.labels.length > maxPoints) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(dataset => dataset.data.shift());
        }
        chart.update('none');
    }

    updateConvergenceChart(timeLabel, maxPoints) {
        const chart = this.charts.convergence;
        if (!chart) return;
        
        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(this.federatedLearning.getCurrentLoss());
        chart.data.datasets[1].data.push(this.federatedLearning.getCurrentAccuracy());
        
        if (chart.data.labels.length > maxPoints) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(dataset => dataset.data.shift());
        }
        chart.update('none');
    }

    updateControlChart(timeLabel, maxPoints) {
        const chart = this.charts.control;
        if (!chart) return;
        
        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(this.cyberPhysical.getControlSignal());
        chart.data.datasets[1].data.push(this.cyberPhysical.getSafetyConstraint());
        
        if (chart.data.labels.length > maxPoints) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(dataset => dataset.data.shift());
        }
        chart.update('none');
    }

    updateNetworkChart(timeLabel, maxPoints) {
        const chart = this.charts.network;
        if (!chart) return;
        
        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(this.networkSim.getAverageLatency());
        chart.data.datasets[1].data.push(this.networkSim.getThroughput() / 1000000);
        
        if (chart.data.labels.length > maxPoints) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(dataset => dataset.data.shift());
        }
        chart.update('none');
    }

    updateThreatChart() {
        const chart = this.charts.threat;
        if (!chart) return;
        
        const threats = this.securitySystem.getThreatDistribution();
        chart.data.datasets[0].data = threats;
        chart.update('none');
    }

    updatePerformanceMetrics() {
        // Simulate performance metrics
        this.performance.fps = Math.max(30, this.fps + Math.random() * 10 - 5);
        this.performance.cpuUsage = Math.max(10, Math.min(90, this.performance.cpuUsage + Math.random() * 10 - 5));
        this.performance.memUsage = Math.max(50, Math.min(500, this.performance.memUsage + Math.random() * 20 - 10));
        
        const fpsEl = document.getElementById('fps');
        const cpuEl = document.getElementById('cpuUsage');
        const memEl = document.getElementById('memUsage');

        if (fpsEl) fpsEl.textContent = Math.round(this.performance.fps);
        if (cpuEl) cpuEl.textContent = Math.round(this.performance.cpuUsage) + '%';
        if (memEl) memEl.textContent = Math.round(this.performance.memUsage) + 'MB';
    }

    log(level, message) {
        const logContent = document.getElementById('logContent');
        if (!logContent) return;
        
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const timestamp = document.createElement('span');
        timestamp.className = 'log-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        
        const logLevel = document.createElement('span');
        logLevel.className = `log-level ${level}`;
        logLevel.textContent = `[${level.toUpperCase()}]`;
        
        const logMessage = document.createElement('span');
        logMessage.className = 'log-message';
        logMessage.textContent = message;
        
        entry.appendChild(timestamp);
        entry.appendChild(logLevel);
        entry.appendChild(logMessage);
        
        logContent.appendChild(entry);
        logContent.scrollTop = logContent.scrollHeight;
        
        // Keep only last 100 entries
        while (logContent.children.length > 100) {
            logContent.removeChild(logContent.firstChild);
        }
    }

    clearLogs() {
        const logContent = document.getElementById('logContent');
        if (logContent) {
            logContent.innerHTML = '';
        }
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }

    addAlert(type, message) {
        const container = document.getElementById('alertsContainer');
        if (!container) return;
        
        const alert = document.createElement('div');
        alert.className = `alert-item ${type}`;
        alert.textContent = message;
        
        container.insertBefore(alert, container.firstChild);
        
        // Remove after 10 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 10000);
        
        // Keep only last 10 alerts
        while (container.children.length > 10) {
            container.removeChild(container.lastChild);
        }
    }
}

// Quantum Communication Layer
class QuantumCommunicationLayer {
    constructor() {
        this.reset();
    }

    reset() {
        this.fidelity = 0.95 + Math.random() * 0.04;
        this.keyGenerationRate = 1000 + Math.random() * 9000;
        this.errorRate = 0.01 + Math.random() * 0.04;
        this.totalKeysGenerated = 0;
        this.decoherenceTime = 0.5;
    }

    update(currentTime) {
        // Simulate quantum decoherence effects
        const decoherence = Math.sin(currentTime / 10000) * 0.01;
        this.fidelity = Math.max(0.9, Math.min(0.99, 0.95 + decoherence + (Math.random() - 0.5) * 0.02));
        
        // Key generation rate varies with fidelity
        this.keyGenerationRate = (1000 + Math.random() * 9000) * this.fidelity;
        
        // Error rate inversely related to fidelity
        this.errorRate = Math.max(0.001, (1 - this.fidelity) * 0.1);
        
        // Accumulate generated keys
        this.totalKeysGenerated += this.keyGenerationRate / 60; // per frame at 60fps
    }

    getCurrentFidelity() { return this.fidelity; }
    getCurrentKeyRate() { return Math.round(this.keyGenerationRate); }
    getCurrentErrorRate() { return this.errorRate; }
    getTotalKeysGenerated() { return Math.round(this.totalKeysGenerated); }
}

// Federated Learning Framework
class FederatedLearningFramework {
    constructor() {
        this.numClients = 50;
        this.clients = [];
        this.currentRound = 0;
        this.currentAccuracy = 0.65;
        this.currentLoss = 2.5;
        this.byzantineRatio = 0.3;
        this.participationRate = 0.74;
        this.initializeClients();
    }

    initializeClients() {
        this.clients = [];
        for (let i = 0; i < this.numClients; i++) {
            this.clients.push({
                id: i,
                isActive: Math.random() < this.participationRate,
                isByzantine: Math.random() < this.byzantineRatio,
                trustScore: Math.random() * 0.5 + 0.5,
                localAccuracy: Math.random() * 0.3 + 0.7
            });
        }
    }

    reset() {
        this.currentRound = 0;
        this.currentAccuracy = 0.65;
        this.currentLoss = 2.5;
        this.initializeClients();
    }

    update(currentTime) {
        // Update round every 5 seconds
        if (Math.floor(currentTime / 5000) > this.currentRound) {
            this.currentRound++;
            this.runFederatedRound();
        }

        // Update client participation
        this.clients.forEach(client => {
            client.isActive = Math.random() < this.participationRate;
            if (client.isByzantine && client.isActive) {
                client.trustScore = Math.max(0, client.trustScore - 0.01);
            } else if (client.isActive) {
                client.trustScore = Math.min(1, client.trustScore + 0.005);
            }
        });
    }

    runFederatedRound() {
        // Simulate model convergence
        const activeNonByzantine = this.clients.filter(c => c.isActive && !c.isByzantine).length;
        const convergenceRate = activeNonByzantine / this.numClients;
        
        this.currentAccuracy = Math.min(0.95, this.currentAccuracy + convergenceRate * 0.01);
        this.currentLoss = Math.max(0.1, this.currentLoss - convergenceRate * 0.05);
    }

    setParticipationRate(rate) {
        this.participationRate = rate;
    }

    getCurrentRound() { return this.currentRound; }
    getCurrentAccuracy() { return this.currentAccuracy; }
    getCurrentLoss() { return this.currentLoss; }
    getActiveClients() { return this.clients.filter(c => c.isActive).length; }
    getByzantineDetected() { return this.clients.filter(c => c.isByzantine && c.trustScore < 0.3).length; }
    getAverageTrustScore() { 
        const scores = this.clients.map(c => c.trustScore);
        return scores.reduce((a, b) => a + b, 0) / scores.length;
    }
    getClient(index) { return this.clients[index]; }
}

// Cyber-Physical Systems
class CyberPhysicalSystems {
    constructor() {
        this.numDrones = 5;
        this.drones = [];
        this.safetyRate = 0.998;
        this.lyapunovValue = 0.023;
        this.controlSignal = 0;
        this.safetyConstraint = 0.95;
        this.initializeDrones();
    }

    initializeDrones() {
        const initialPositions = [[0,0,5], [10,0,5], [0,10,5], [-10,0,5], [0,-10,5]];
        this.drones = initialPositions.map((pos, i) => ({
            id: i,
            position: [...pos],
            velocity: [0, 0, 0],
            target: [Math.random() * 20 - 10, Math.random() * 20 - 10, 5],
            isSafe: true
        }));
    }

    reset() {
        this.initializeDrones();
        this.safetyRate = 0.998;
        this.lyapunovValue = 0.023;
    }

    update(currentTime) {
        // Update drone positions using simple physics
        this.drones.forEach(drone => {
            // Move towards target
            for (let i = 0; i < 3; i++) {
                const error = drone.target[i] - drone.position[i];
                drone.velocity[i] = error * 0.1 + (Math.random() - 0.5) * 0.1; // Add noise
                drone.position[i] += drone.velocity[i] * 0.016; // ~60fps
            }
            
            // Check safety constraints
            const speed = Math.sqrt(drone.velocity.reduce((sum, v) => sum + v*v, 0));
            drone.isSafe = speed < 10; // Max velocity constraint
            
            // Update target occasionally
            if (Math.random() < 0.001) {
                drone.target = [Math.random() * 20 - 10, Math.random() * 20 - 10, 5];
            }
        });

        // Update safety metrics
        const safeDrones = this.drones.filter(d => d.isSafe).length;
        this.safetyRate = safeDrones / this.numDrones;
        
        // Lyapunov function (energy-like function for stability)
        this.lyapunovValue = this.drones.reduce((sum, drone) => {
            const energy = drone.velocity.reduce((sum, v) => sum + v*v, 0);
            return sum + energy;
        }, 0) / this.numDrones / 100;

        // Control signal (MPC-like)
        this.controlSignal = Math.sin(currentTime / 1000) * 0.5 + 0.5;
        this.safetyConstraint = 0.95 + Math.sin(currentTime / 2000) * 0.04;
    }

    getSafetyRate() { return this.safetyRate; }
    getSafetyMargin() { return Math.min(this.safetyRate / this.safetyConstraint, 1); }
    getLyapunovValue() { return this.lyapunovValue; }
    getControlSignal() { return this.controlSignal; }
    getSafetyConstraint() { return this.safetyConstraint; }
    getDronePositions() { return this.drones.map(d => d.position); }
}

// Network Simulation
class NetworkSimulation {
    constructor() {
        this.numNodes = 50;
        this.nodes = [];
        this.averageLatency = 12.4;
        this.throughput = 847000000; // bits per second
        this.packetLoss = 0.0012;
        this.rlncEfficiency = 0.948;
        this.noiseLevel = 0.15;
        this.initializeNodes();
    }

    initializeNodes() {
        this.nodes = [];
        for (let i = 0; i < this.numNodes; i++) {
            this.nodes.push({
                id: i,
                latency: 1 + Math.random() * 99,
                bandwidth: 1e6 + Math.random() * 999e6,
                packetLoss: Math.random() * 0.049 + 0.001,
                isActive: true
            });
        }
    }

    reset() {
        this.initializeNodes();
        this.averageLatency = 12.4;
        this.throughput = 847000000;
        this.packetLoss = 0.0012;
        this.rlncEfficiency = 0.948;
    }

    update(currentTime) {
        // Update network conditions
        this.nodes.forEach(node => {
            // Add temporal variation and noise
            const variation = Math.sin(currentTime / 10000 + node.id) * this.noiseLevel;
            node.latency = Math.max(0.1, 12 + variation * 50 + (Math.random() - 0.5) * 5);
            node.packetLoss = Math.max(0.001, Math.min(0.05, 0.01 + variation * 0.02));
        });

        // Calculate aggregate metrics
        this.averageLatency = this.nodes.reduce((sum, node) => sum + node.latency, 0) / this.numNodes;
        this.packetLoss = this.nodes.reduce((sum, node) => sum + node.packetLoss, 0) / this.numNodes;
        this.throughput = Math.max(100e6, 900e6 - this.packetLoss * 1e9);
        this.rlncEfficiency = Math.max(0.8, 0.95 - this.packetLoss * 5);
    }

    setNoiseLevel(level) {
        this.noiseLevel = level;
    }

    getAverageLatency() { return this.averageLatency; }
    getThroughput() { return this.throughput; }
    getPacketLoss() { return this.packetLoss; }
    getRLNCEfficiency() { return this.rlncEfficiency; }
    getReliability() { return 1 - this.packetLoss; }
    getNode(index) { return this.nodes[index] || null; }
}

// Adversarial Defense System
class AdversarialDefenseSystem {
    constructor() {
        this.attackIntensity = 0.3;
        this.totalThreats = 23;
        this.falsePositives = 2;
        this.mitigationRate = 0.87;
        this.threats = [];
        this.threatDistribution = [12, 8, 3, 0]; // Low, Medium, High, Critical
    }

    reset() {
        this.totalThreats = 0;
        this.falsePositives = 0;
        this.threats = [];
        this.threatDistribution = [0, 0, 0, 0];
    }

    update(currentTime) {
        // Generate threats based on attack intensity
        if (Math.random() < this.attackIntensity * 0.001) {
            this.generateThreat(currentTime);
        }

        // Age existing threats
        this.threats = this.threats.filter(threat => 
            currentTime - threat.timestamp < 300000 // Keep for 5 minutes
        );

        // Update threat distribution
        const recentThreats = this.threats.filter(threat => 
            currentTime - threat.timestamp < 60000 // Last minute
        );
        
        this.threatDistribution = [0, 0, 0, 0];
        recentThreats.forEach(threat => {
            this.threatDistribution[threat.severity]++;
        });
    }

    generateThreat(currentTime) {
        const threatTypes = [
            'Byzantine client detected',
            'Network intrusion attempt',
            'Quantum channel interference',
            'DDoS attack detected',
            'Malicious gradient injection',
            'Unauthorized access attempt'
        ];

        const severity = Math.random() < 0.7 ? 0 : Math.random() < 0.8 ? 1 : Math.random() < 0.95 ? 2 : 3;
        const threat = {
            timestamp: currentTime,
            type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
            description: threatTypes[Math.floor(Math.random() * threatTypes.length)],
            severity: severity
        };

        this.threats.push(threat);
        this.totalThreats++;

        // Simulate false positives
        if (Math.random() < 0.05) {
            this.falsePositives++;
        }
    }

    setAttackIntensity(intensity) {
        this.attackIntensity = intensity;
    }

    getTotalThreats() { return this.totalThreats; }
    getFalsePositives() { return this.falsePositives; }
    getMitigationRate() { return this.mitigationRate; }
    getRecentThreats() { return this.threats.slice(-10); } // Last 10 threats
    getThreatDistribution() { return this.threatDistribution; }
}

// Initialize the simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing simulation...');
    window.simulation = new SimulationEngine();
});