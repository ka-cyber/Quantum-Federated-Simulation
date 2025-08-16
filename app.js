class QFEISimulation {
    constructor() {
        this.isRunning = false;
        this.simulationTime = 135; // seconds since start (00:02:15)
        this.charts = {};
        this.canvasElements = {};
        this.data = {
            quantum: {
                fidelity: 0.95,
                keysGenerated: 1247,
                keyRate: 5240,
                errorRate: 0.02
            },
            fl: {
                accuracy: 0.87,
                activeClients: 37,
                byzantineDetected: 14,
                trustScore: 0.84,
                currentRound: 23
            },
            cps: {
                safety: 0.998,
                lyapunovValue: 0.023,
                safetyMargin: 0.987,
                controlFreq: 100
            },
            network: {
                reliability: 0.942,
                avgLatency: 12.4,
                throughput: 847,
                packetLoss: 0.12,
                rlncEfficiency: 94.8
            },
            security: {
                totalThreats: 23,
                falsePositives: 2,
                mitigationRate: 87.0
            }
        };
        
        this.clients = this.generateClients();
        this.drones = this.generateDrones();
        this.networkNodes = this.generateNetworkNodes();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCharts();
        this.setupCanvasElements();
        this.startSimulation();
        this.updateDisplays();
    }

    setupEventListeners() {
        // Navigation - Fixed to properly handle all navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const panelName = e.currentTarget.dataset.panel;
                this.switchPanel(panelName);
            });
        });

        // Simulation controls
        document.getElementById('startBtn').addEventListener('click', () => this.startSimulation());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseSimulation());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetSimulation());

        // Parameter controls - Fixed to include all three sliders
        const sliders = ['attackIntensity', 'networkNoise', 'clientParticipation'];
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    e.target.nextElementSibling.textContent = `${value}%`;
                    this.updateParameter(sliderId, value);
                });
            }
        });

        // Clear logs
        document.getElementById('clearLogsBtn').addEventListener('click', () => {
            document.getElementById('logContent').innerHTML = '';
        });
    }

    switchPanel(panelName) {
        // Update navigation - Fixed to properly remove and add active class
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-panel="${panelName}"]`).classList.add('active');

        // Update panels - Fixed to properly hide all panels and show the correct one
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = document.getElementById(`${panelName}-panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        // Refresh canvas elements if needed - Fixed timing and panel-specific rendering
        setTimeout(() => {
            if (panelName === 'quantum') this.drawFidelityGauge();
            if (panelName === 'federated') this.drawFLNetwork();
            if (panelName === 'cps') this.drawDroneViz();
            if (panelName === 'network') this.drawNetworkTopology();
        }, 100);
    }

    setupCharts() {
        // System Timeline Chart
        const timelineCtx = document.getElementById('systemTimelineChart').getContext('2d');
        this.charts.timeline = new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(20),
                datasets: [{
                    label: 'Quantum Fidelity',
                    data: this.generateTimeSeriesData(0.95, 0.02, 20),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true
                }, {
                    label: 'FL Accuracy',
                    data: this.generateTimeSeriesData(0.87, 0.05, 20),
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    fill: true
                }, {
                    label: 'CPS Safety',
                    data: this.generateTimeSeriesData(0.998, 0.001, 20),
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0.8,
                        max: 1.0
                    }
                }
            }
        });

        // Quantum Chart
        const quantumCtx = document.getElementById('quantumChart').getContext('2d');
        this.charts.quantum = new Chart(quantumCtx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(15),
                datasets: [{
                    label: 'Key Rate (keys/sec)',
                    data: this.generateTimeSeriesData(5240, 500, 15),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    yAxisID: 'y',
                    fill: true
                }, {
                    label: 'Error Rate (%)',
                    data: this.generateTimeSeriesData(2.0, 0.5, 15),
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    yAxisID: 'y1',
                    fill: true
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
                        },
                    }
                }
            }
        });

        // Convergence Chart
        const convergenceCtx = document.getElementById('convergenceChart').getContext('2d');
        this.charts.convergence = new Chart(convergenceCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => i),
                datasets: [{
                    label: 'Training Loss',
                    data: this.generateConvergenceData(24),
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    yAxisID: 'y',
                    fill: true
                }, {
                    label: 'Accuracy',
                    data: this.generateAccuracyData(24),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    yAxisID: 'y1',
                    fill: true
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
                        title: {
                            display: true,
                            text: 'Loss'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Accuracy'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        min: 0,
                        max: 1
                    }
                }
            }
        });

        // Control Chart
        const controlCtx = document.getElementById('controlChart').getContext('2d');
        this.charts.control = new Chart(controlCtx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(20),
                datasets: [{
                    label: 'Control Signal',
                    data: this.generateTimeSeriesData(0.5, 0.3, 20),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true
                }, {
                    label: 'Safety Constraint',
                    data: Array(20).fill(0.95),
                    borderColor: '#B4413C',
                    borderDash: [5, 5],
                    fill: false
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

        // Network Chart
        const networkCtx = document.getElementById('networkChart').getContext('2d');
        this.charts.network = new Chart(networkCtx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(15),
                datasets: [{
                    label: 'Latency (ms)',
                    data: this.generateTimeSeriesData(12.4, 5, 15),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    yAxisID: 'y',
                    fill: true
                }, {
                    label: 'Throughput (Mbps)',
                    data: this.generateTimeSeriesData(847, 100, 15),
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    yAxisID: 'y1',
                    fill: true
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
                        title: {
                            display: true,
                            text: 'Latency (ms)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Throughput (Mbps)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        }
                    }
                }
            }
        });

        // Threat Chart
        const threatCtx = document.getElementById('threatChart').getContext('2d');
        this.charts.threat = new Chart(threatCtx, {
            type: 'doughnut',
            data: {
                labels: ['Low', 'Medium', 'High', 'Critical'],
                datasets: [{
                    data: [12, 8, 3, 0],
                    backgroundColor: ['#5D878F', '#D2BA4C', '#B4413C', '#DB4545'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    setupCanvasElements() {
        this.canvasElements = {
            fidelityGauge: document.getElementById('fidelityGauge'),
            flNetwork: document.getElementById('flNetworkViz'),
            droneViz: document.getElementById('droneViz'),
            networkTopology: document.getElementById('networkTopology')
        };

        // Initial canvas draws
        this.drawFidelityGauge();
        this.drawFLNetwork();
        this.drawDroneViz();
        this.drawNetworkTopology();
    }

    drawFidelityGauge() {
        const canvas = this.canvasElements.fidelityGauge;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Fidelity arc
        const fidelity = this.data.quantum.fidelity;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (2 * Math.PI * ((fidelity - 0.9) / 0.1));

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = '#1FB8CD';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Center text
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(fidelity.toFixed(3), centerX, centerY + 5);
    }

    drawFLNetwork() {
        const canvas = this.canvasElements.flNetwork;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw server
        ctx.fillStyle = '#1FB8CD';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        ctx.fill();

        // Draw server label
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Server', centerX, centerY - 25);

        // Draw clients
        const clientRadius = 120;
        this.clients.forEach((client, index) => {
            const angle = (index / this.clients.length) * 2 * Math.PI;
            const x = centerX + Math.cos(angle) * clientRadius;
            const y = centerY + Math.sin(angle) * clientRadius;

            // Connection line
            if (client.active) {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = client.byzantine ? '#B4413C' : '#e5e5e5';
                ctx.lineWidth = client.byzantine ? 2 : 1;
                ctx.stroke();
            }

            // Client node
            ctx.fillStyle = client.byzantine ? '#B4413C' : 
                           client.active ? '#5D878F' : '#e5e5e5';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    drawDroneViz() {
        const canvas = this.canvasElements.droneViz;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * canvas.width;
            const y = (i / 10) * canvas.height;
            
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw drones
        this.drones.forEach((drone, index) => {
            ctx.fillStyle = `hsl(${index * 60}, 70%, 50%)`;
            ctx.beginPath();
            ctx.arc(drone.x, drone.y, 8, 0, 2 * Math.PI);
            ctx.fill();

            // Drone ID
            ctx.fillStyle = '#1a1a1a';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`D${index + 1}`, drone.x, drone.y - 15);
        });
    }

    drawNetworkTopology() {
        const canvas = this.canvasElements.networkTopology;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cols = 10;
        const rows = 5;
        const nodeSpacingX = canvas.width / (cols + 1);
        const nodeSpacingY = canvas.height / (rows + 1);

        this.networkNodes.forEach((node, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = (col + 1) * nodeSpacingX;
            const y = (row + 1) * nodeSpacingY;

            // Draw connections to adjacent nodes
            ctx.strokeStyle = '#e5e5e5';
            ctx.lineWidth = 1;

            // Right connection
            if (col < cols - 1) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + nodeSpacingX, y);
                ctx.stroke();
            }

            // Bottom connection
            if (row < rows - 1) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + nodeSpacingY);
                ctx.stroke();
            }

            // Draw node
            ctx.fillStyle = node.status === 'good' ? '#5D878F' :
                           node.status === 'warning' ? '#D2BA4C' : '#B4413C';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    generateClients() {
        return Array.from({length: 50}, (_, i) => ({
            id: i,
            active: Math.random() > 0.25,
            byzantine: Math.random() < 0.3,
            trustScore: Math.random()
        }));
    }

    generateDrones() {
        return Array.from({length: 5}, (_, i) => ({
            id: i,
            x: Math.random() * 350 + 25,
            y: Math.random() * 250 + 25,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        }));
    }

    generateNetworkNodes() {
        return Array.from({length: 50}, (_, i) => ({
            id: i,
            status: Math.random() > 0.8 ? 'error' : 
                   Math.random() > 0.6 ? 'warning' : 'good',
            latency: Math.random() * 45 + 5,
            packetLoss: Math.random() * 0.05
        }));
    }

    generateTimeLabels(count) {
        const labels = [];
        const baseTime = this.simulationTime - (count - 1) * 5;
        for (let i = 0; i < count; i++) {
            const time = baseTime + i * 5;
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            labels.push(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
        return labels;
    }

    generateTimeSeriesData(base, variance, count) {
        const data = [];
        let current = base;
        for (let i = 0; i < count; i++) {
            current += (Math.random() - 0.5) * variance * 0.2;
            current = Math.max(0, Math.min(current, base + variance));
            data.push(parseFloat(current.toFixed(3)));
        }
        return data;
    }

    generateConvergenceData(rounds) {
        const data = [];
        let loss = 2.5;
        for (let i = 0; i < rounds; i++) {
            loss *= (0.95 + Math.random() * 0.1);
            data.push(parseFloat(loss.toFixed(3)));
        }
        return data;
    }

    generateAccuracyData(rounds) {
        const data = [];
        let accuracy = 0.1;
        for (let i = 0; i < rounds; i++) {
            accuracy += (0.9 - accuracy) * (0.05 + Math.random() * 0.05);
            data.push(parseFloat(accuracy.toFixed(3)));
        }
        return data;
    }

    startSimulation() {
        this.isRunning = true;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        this.simulationLoop = setInterval(() => {
            this.updateSimulation();
        }, 1000);
        
        this.addLogEntry('info', 'Simulation started');
    }

    pauseSimulation() {
        this.isRunning = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        
        if (this.simulationLoop) {
            clearInterval(this.simulationLoop);
        }
        
        this.addLogEntry('info', 'Simulation paused');
    }

    resetSimulation() {
        this.pauseSimulation();
        this.simulationTime = 0;
        this.data = {
            quantum: { fidelity: 0.95, keysGenerated: 0, keyRate: 5000, errorRate: 0.02 },
            fl: { accuracy: 0.5, activeClients: 50, byzantineDetected: 0, trustScore: 1.0, currentRound: 1 },
            cps: { safety: 1.0, lyapunovValue: 0.001, safetyMargin: 1.0, controlFreq: 100 },
            network: { reliability: 1.0, avgLatency: 5.0, throughput: 1000, packetLoss: 0.001, rlncEfficiency: 100 },
            security: { totalThreats: 0, falsePositives: 0, mitigationRate: 100 }
        };
        this.updateDisplays();
        this.addLogEntry('info', 'Simulation reset');
    }

    updateSimulation() {
        this.simulationTime += 1;
        
        // Update quantum metrics
        this.data.quantum.fidelity += (Math.random() - 0.5) * 0.002;
        this.data.quantum.fidelity = Math.max(0.90, Math.min(0.99, this.data.quantum.fidelity));
        this.data.quantum.keyRate += (Math.random() - 0.5) * 200;
        this.data.quantum.keyRate = Math.max(1000, Math.min(10000, this.data.quantum.keyRate));
        this.data.quantum.keysGenerated += Math.floor(this.data.quantum.keyRate / 60);
        
        // Update FL metrics
        if (this.simulationTime % 10 === 0) {
            this.data.fl.currentRound += 1;
            this.data.fl.accuracy += (Math.random() - 0.3) * 0.02;
            this.data.fl.accuracy = Math.max(0.5, Math.min(0.95, this.data.fl.accuracy));
        }
        
        // Update CPS metrics
        this.data.cps.lyapunovValue += (Math.random() - 0.5) * 0.001;
        this.data.cps.lyapunovValue = Math.max(0.001, Math.min(0.1, this.data.cps.lyapunovValue));
        this.data.cps.safetyMargin = 1 - this.data.cps.lyapunovValue * 10;
        this.data.cps.safety = this.data.cps.safetyMargin;
        
        // Update network metrics
        this.data.network.avgLatency += (Math.random() - 0.5) * 2;
        this.data.network.avgLatency = Math.max(5, Math.min(50, this.data.network.avgLatency));
        this.data.network.packetLoss += (Math.random() - 0.5) * 0.01;
        this.data.network.packetLoss = Math.max(0.001, Math.min(0.05, this.data.network.packetLoss));
        this.data.network.reliability = 1 - this.data.network.packetLoss;
        
        // Update drones
        this.drones.forEach(drone => {
            drone.x += drone.vx;
            drone.y += drone.vy;
            
            if (drone.x <= 25 || drone.x >= 375) drone.vx *= -1;
            if (drone.y <= 25 || drone.y >= 275) drone.vy *= -1;
        });
        
        // Random events
        if (Math.random() < 0.1) {
            this.generateRandomEvent();
        }
        
        this.updateDisplays();
        this.updateCharts();
        this.updateCanvasElements();
    }

    generateRandomEvent() {
        const events = [
            { type: 'info', message: 'Quantum key generation rate increased' },
            { type: 'warning', message: 'Byzantine client detected in FL network' },
            { type: 'error', message: 'Network packet loss spike detected' },
            { type: 'info', message: 'CPS drone reached waypoint' },
            { type: 'warning', message: 'Security threat mitigated' }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.addLogEntry(event.type, event.message);
        this.addAlert(event.type, event.message);
    }

    updateDisplays() {
        // Update time
        const minutes = Math.floor(this.simulationTime / 60);
        const seconds = this.simulationTime % 60;
        document.getElementById('simTime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update metric cards
        document.getElementById('quantumFidelityValue').textContent = this.data.quantum.fidelity.toFixed(3);
        document.getElementById('flAccuracyValue').textContent = this.data.fl.accuracy.toFixed(2);
        document.getElementById('cpsSafetyValue').textContent = this.data.cps.safety.toFixed(3);
        document.getElementById('networkReliabilityValue').textContent = this.data.network.reliability.toFixed(3);
        
        // Update quantum panel
        document.getElementById('keysGenerated').textContent = this.data.quantum.keysGenerated.toLocaleString();
        document.getElementById('keyRate').textContent = `${Math.floor(this.data.quantum.keyRate).toLocaleString()} keys/sec`;
        document.getElementById('errorRate').textContent = `${(this.data.quantum.errorRate * 100).toFixed(1)}%`;
        
        // Update FL panel
        document.getElementById('activeClients').textContent = this.data.fl.activeClients;
        document.getElementById('byzantineDetected').textContent = this.data.fl.byzantineDetected;
        document.getElementById('trustScore').textContent = `${Math.floor(this.data.fl.trustScore * 100)}%`;
        document.getElementById('currentRound').textContent = this.data.fl.currentRound;
        
        // Update CPS panel
        document.getElementById('lyapunovValue').textContent = this.data.cps.lyapunovValue.toFixed(3);
        document.getElementById('safetyMargin').textContent = `${(this.data.cps.safetyMargin * 100).toFixed(1)}%`;
        document.getElementById('controlFreq').textContent = `${this.data.cps.controlFreq} Hz`;
        
        // Update network panel
        document.getElementById('avgLatency').textContent = `${this.data.network.avgLatency.toFixed(1)}ms`;
        document.getElementById('throughput').textContent = `${Math.floor(this.data.network.throughput)} Mbps`;
        document.getElementById('packetLoss').textContent = `${(this.data.network.packetLoss * 100).toFixed(2)}%`;
        document.getElementById('rlncEfficiency').textContent = `${this.data.network.rlncEfficiency.toFixed(1)}%`;
        
        // Update security panel
        document.getElementById('totalThreats').textContent = this.data.security.totalThreats;
        document.getElementById('falsePositives').textContent = this.data.security.falsePositives;
        document.getElementById('mitigationRate').textContent = `${this.data.security.mitigationRate.toFixed(1)}%`;
        
        // Update performance monitor
        document.getElementById('fpsValue').textContent = '60';
        document.getElementById('cpuValue').textContent = `${Math.floor(Math.random() * 30 + 20)}%`;
        document.getElementById('memoryValue').textContent = `${(Math.random() * 0.5 + 1.0).toFixed(1)}GB`;
    }

    updateCharts() {
        // Update timeline chart
        if (this.charts.timeline) {
            const chart = this.charts.timeline;
            chart.data.labels = this.generateTimeLabels(20);
            chart.data.datasets[0].data = this.generateTimeSeriesData(this.data.quantum.fidelity, 0.02, 20);
            chart.data.datasets[1].data = this.generateTimeSeriesData(this.data.fl.accuracy, 0.05, 20);
            chart.data.datasets[2].data = this.generateTimeSeriesData(this.data.cps.safety, 0.001, 20);
            chart.update('none');
        }
    }

    updateCanvasElements() {
        this.drawFidelityGauge();
        if (document.getElementById('federated-panel').classList.contains('active')) {
            this.drawFLNetwork();
        }
        if (document.getElementById('cps-panel').classList.contains('active')) {
            this.drawDroneViz();
        }
        if (document.getElementById('network-panel').classList.contains('active')) {
            this.drawNetworkTopology();
        }
    }

    updateParameter(param, value) {
        const intensity = value / 100;
        
        switch(param) {
            case 'attackIntensity':
                this.data.fl.byzantineDetected = Math.floor(50 * intensity * 0.3);
                this.data.security.totalThreats = Math.floor(intensity * 50);
                this.addLogEntry('info', `Attack intensity set to ${value}%`);
                break;
            case 'networkNoise':
                this.data.network.packetLoss = intensity * 0.05;
                this.data.network.avgLatency = 5 + intensity * 45;
                this.addLogEntry('info', `Network noise set to ${value}%`);
                break;
            case 'clientParticipation':
                this.data.fl.activeClients = Math.floor(50 * intensity);
                this.addLogEntry('info', `Client participation set to ${value}%`);
                break;
        }
    }

    addLogEntry(level, message) {
        const logContent = document.getElementById('logContent');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        
        const minutes = Math.floor(this.simulationTime / 60);
        const seconds = this.simulationTime % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        entry.innerHTML = `
            <span class="log-time">[${timeStr}]</span>
            <span class="log-level ${level}">${level.toUpperCase()}</span>
            <span class="log-message">${message}</span>
        `;
        
        logContent.insertBefore(entry, logContent.firstChild);
        
        // Limit log entries
        if (logContent.children.length > 50) {
            logContent.removeChild(logContent.lastChild);
        }
    }

    addAlert(type, message) {
        const alertsList = document.getElementById('alertsList');
        const alert = document.createElement('div');
        alert.className = `alert alert--${type}`;
        
        const minutes = Math.floor(this.simulationTime / 60);
        const seconds = this.simulationTime % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        alert.innerHTML = `
            <span class="alert-time">${timeStr}</span>
            <span class="alert-message">${message}</span>
        `;
        
        alertsList.insertBefore(alert, alertsList.firstChild);
        
        // Limit alerts
        if (alertsList.children.length > 10) {
            alertsList.removeChild(alertsList.lastChild);
        }
    }
}

// Initialize the simulation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QFEISimulation();
});