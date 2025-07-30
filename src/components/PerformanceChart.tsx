import React, { useEffect, useRef } from 'react';
import { TrendingUp, Clock, Zap } from 'lucide-react';

interface PerformanceChartProps {
  metrics: {
    accuracy: number;
    throughput: number;
    latency: number;
    gpuUtilization: number;
  };
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ metrics }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataPointsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Add new data point
    dataPointsRef.current.push(metrics.accuracy);
    if (dataPointsRef.current.length > 50) {
      dataPointsRef.current.shift();
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
      const y = padding + (chartHeight / 10) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw accuracy line
    if (dataPointsRef.current.length > 1) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();

      dataPointsRef.current.forEach((point, index) => {
        const x = padding + (chartWidth / (dataPointsRef.current.length - 1)) * index;
        const y = height - padding - ((point - 90) / 10) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw gradient fill
      ctx.lineTo(width - padding, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw data points
      ctx.fillStyle = '#10b981';
      dataPointsRef.current.forEach((point, index) => {
        const x = padding + (chartWidth / (dataPointsRef.current.length - 1)) * index;
        const y = height - padding - ((point - 90) / 10) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 10; i++) {
      const value = 100 - i;
      const y = padding + (chartHeight / 10) * i;
      ctx.fillText(`${value}%`, padding - 5, y + 4);
    }

  }, [metrics.accuracy]);

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          <h2 className="text-lg font-semibold text-white">Model Performance</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Current Accuracy</p>
          <p className="text-xl font-mono text-emerald-400">{metrics.accuracy.toFixed(2)}%</p>
        </div>
      </div>

      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          className="w-full h-48 rounded-lg"
          style={{ width: '100%', height: '192px' }}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <Zap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-slate-400">Throughput</p>
          <p className="text-sm font-mono text-blue-400">{metrics.throughput.toLocaleString()}</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className="text-xs text-slate-400">Latency</p>
          <p className="text-sm font-mono text-amber-400">{metrics.latency.toFixed(1)}ms</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-lg">
          <TrendingUp className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-xs text-slate-400">GPU Usage</p>
          <p className="text-sm font-mono text-purple-400">{metrics.gpuUtilization.toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
};