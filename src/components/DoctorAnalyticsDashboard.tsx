'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    BarChart3, TrendingUp, Calendar, Activity, Users,
    ArrowUpRight, ArrowDownRight, Minus, RefreshCcw,
    ChevronDown, Stethoscope, Loader2, PieChart, Clock,
    DollarSign, Filter
} from 'lucide-react';
import clsx from 'clsx';

interface VolumePoint { label: string; value: number; }
interface DistributionItem { label: string; value: number; }
interface DiseaseTrendPoint { label: string; conditions: Record<string, number>; }

interface AnalyticsData {
    volumeData: VolumePoint[];
    statusDistribution: DistributionItem[];
    diseaseDistribution: DistributionItem[];
    typeDistribution: DistributionItem[];
    diseaseTrends: DiseaseTrendPoint[];
    summary: {
        totalAppointments: number;
        completedAppointments: number;
        cancelledAppointments: number;
        onlineAppointments: number;
        offlineAppointments: number;
        totalRevenue: number;
        avgDurationMinutes: number;
        periodDays: number;
    };
}

const CHART_COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#6366f1'
];

const STATUS_COLORS: Record<string, string> = {
    'BOOKED': '#3b82f6',
    'CONFIRMED': '#06b6d4',
    'IN_PROGRESS': '#f59e0b',
    'COMPLETED': '#10b981',
    'CANCELLED': '#ef4444',
    'RESCHEDULE_REQUESTED': '#8b5cf6',
    'NO_SHOW': '#f97316',
};

export default function DoctorAnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<'daily' | 'monthly'>('daily');
    const [period, setPeriod] = useState<number>(30);
    const [activeChart, setActiveChart] = useState<'volume' | 'disease'>('volume');

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/doctor/analytics?range=${range}&period=${period}`);
            if (res.ok) {
                const json = await res.json();
                setData(json.analytics);
            }
        } catch (e) {
            console.error('Failed to fetch analytics:', e);
        } finally {
            setLoading(false);
        }
    }, [range, period]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading && !data) {
        return (
            <div className="bg-card rounded-2xl border border-border p-8">
                <div className="flex items-center justify-center gap-3 py-12">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-muted-foreground font-medium">Loading analytics...</span>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const s = data.summary;

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BarChart3 className="text-primary" size={24} />
                        Practice Analytics
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Historical data visualization • Last {s.periodDays} days
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Time Range Toggle */}
                    <div className="flex items-center bg-secondary rounded-lg border border-border overflow-hidden">
                        <button
                            onClick={() => setRange('daily')}
                            className={clsx(
                                'px-3 py-2 text-xs font-bold transition-all',
                                range === 'daily'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setRange('monthly')}
                            className={clsx(
                                'px-3 py-2 text-xs font-bold transition-all',
                                range === 'monthly'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            Monthly
                        </button>
                    </div>

                    {/* Period Selector */}
                    <div className="relative">
                        <select
                            value={period}
                            onChange={e => setPeriod(parseInt(e.target.value))}
                            className="appearance-none bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-bold text-foreground pr-7 cursor-pointer"
                        >
                            <option value={7}>7 days</option>
                            <option value={14}>14 days</option>
                            <option value={30}>30 days</option>
                            <option value={90}>3 months</option>
                            <option value={180}>6 months</option>
                            <option value={365}>1 year</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>

                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className="p-2 bg-secondary hover:bg-accent border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                    icon={<Users size={18} />}
                    label="Total Patients"
                    value={s.totalAppointments.toString()}
                    iconColor="text-blue-500"
                    iconBg="bg-blue-50"
                />
                <SummaryCard
                    icon={<Activity size={18} />}
                    label="Completed"
                    value={s.completedAppointments.toString()}
                    iconColor="text-emerald-500"
                    iconBg="bg-emerald-50"
                    sub={s.totalAppointments > 0 ? `${Math.round((s.completedAppointments / s.totalAppointments) * 100)}% rate` : undefined}
                />
                <SummaryCard
                    icon={<Clock size={18} />}
                    label="Avg Duration"
                    value={s.avgDurationMinutes > 0 ? `${s.avgDurationMinutes}m` : 'N/A'}
                    iconColor="text-amber-500"
                    iconBg="bg-amber-50"
                />
                <SummaryCard
                    icon={<DollarSign size={18} />}
                    label="Revenue"
                    value={s.totalRevenue > 0 ? `$${s.totalRevenue.toLocaleString()}` : '$0'}
                    iconColor="text-violet-500"
                    iconBg="bg-violet-50"
                />
            </div>

            {/* Main Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Patient Volume Line Graph */}
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <TrendingUp size={16} className="text-blue-500" />
                                Patient Volume
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {range === 'daily' ? 'Daily' : 'Monthly'} appointment count
                            </p>
                        </div>
                    </div>
                    <LineChart data={data.volumeData} color="#3b82f6" height={220} range={range} />
                </div>

                {/* Status Distribution Histogram */}
                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <BarChart3 size={16} className="text-emerald-500" />
                                Status Distribution
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Appointment outcomes breakdown
                            </p>
                        </div>
                    </div>
                    <BarChartComponent data={data.statusDistribution} colorMap={STATUS_COLORS} height={220} />
                </div>
            </div>

            {/* Disease Distribution Section */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Disease Donut Chart */}
                <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
                    <div className="mb-6">
                        <h3 className="font-bold text-foreground flex items-center gap-2">
                            <Stethoscope size={16} className="text-violet-500" />
                            Clinical Distribution
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Conditions diagnosed
                        </p>
                    </div>
                    <DonutChart data={data.diseaseDistribution} size={200} />
                </div>

                {/* Disease Trends Over Time */}
                <div className="lg:col-span-3 bg-card rounded-2xl border border-border p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <Activity size={16} className="text-amber-500" />
                                Disease Trends
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {range === 'daily' ? 'Daily' : 'Monthly'} condition distribution changes
                            </p>
                        </div>
                    </div>
                    <StackedBarChart data={data.diseaseTrends} height={220} range={range} />
                </div>
            </div>

            {/* Appointment Type Chart */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                        <PieChart size={16} className="text-cyan-500" />
                        Consultation Mode
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Online vs In-Person appointments
                    </p>
                </div>
                <div className="flex items-center justify-center gap-12 flex-wrap">
                    <DonutChart data={data.typeDistribution} size={160} />
                    <div className="space-y-4">
                        {data.typeDistribution.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                                <div>
                                    <p className="font-bold text-foreground">{item.label}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {item.value} appointments ({s.totalAppointments > 0 ? Math.round((item.value / s.totalAppointments) * 100) : 0}%)
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========== Sub-Components ========== */

function SummaryCard({ icon, label, value, iconColor, iconBg, sub }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    iconColor: string;
    iconBg: string;
    sub?: string;
}) {
    return (
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <div className={clsx('p-2 rounded-lg', iconBg, iconColor)}>
                    {icon}
                </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">{label}</p>
            {sub && <p className="text-xs text-emerald-600 font-semibold mt-1">{sub}</p>}
        </div>
    );
}

/* ========== SVG Line Chart ========== */

function LineChart({ data, color, height, range }: {
    data: VolumePoint[];
    color: string;
    height: number;
    range: string;
}) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (data.length === 0) {
        return <EmptyChart height={height} message="No data for this period" />;
    }

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const padding = { top: 20, right: 20, bottom: 40, left: 45 };
    const chartWidth = 100; // percentage-based
    const svgWidth = 600;
    const svgHeight = height;
    const plotWidth = svgWidth - padding.left - padding.right;
    const plotHeight = svgHeight - padding.top - padding.bottom;

    const points = data.map((d, i) => ({
        x: padding.left + (i / (data.length - 1 || 1)) * plotWidth,
        y: padding.top + plotHeight - (d.value / maxVal) * plotHeight,
        ...d
    }));

    // Build smooth path
    const linePath = points.map((p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = points[i - 1];
        const cpx = (prev.x + p.x) / 2;
        return `C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
    }).join(' ');

    // Area fill path
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${padding.top + plotHeight} Z`;

    // Y-axis labels
    const yTicks = 5;
    const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((maxVal / yTicks) * i));

    // Format label
    const formatLabel = (label: string) => {
        if (range === 'daily') {
            const d = new Date(label + 'T00:00:00');
            return `${d.getDate()}/${d.getMonth() + 1}`;
        }
        const parts = label.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[parseInt(parts[1]) - 1] || label;
    };

    // Show max ~8 x-axis labels
    const xLabelInterval = Math.max(1, Math.floor(data.length / 8));

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ height }}>
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {/* Grid lines */}
                {yLabels.map((_, i) => {
                    const y = padding.top + plotHeight - (i / yTicks) * plotHeight;
                    return (
                        <line key={i} x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y}
                            stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                    );
                })}

                {/* Y-axis labels */}
                {yLabels.map((val, i) => {
                    const y = padding.top + plotHeight - (i / yTicks) * plotHeight;
                    return (
                        <text key={i} x={padding.left - 8} y={y + 4} textAnchor="end"
                            className="fill-current text-muted-foreground" fontSize="10" fontWeight="500">
                            {val}
                        </text>
                    );
                })}

                {/* Area */}
                <path d={areaPath} fill="url(#areaGradient)" />

                {/* Line */}
                <path d={linePath} fill="none" stroke={color} strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" />

                {/* Data points */}
                {points.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r={hoveredIndex === i ? 5 : 3}
                            fill={color} stroke="white" strokeWidth="2"
                            className="transition-all duration-150 cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        />
                        {/* Invisible larger click target */}
                        <circle cx={p.x} cy={p.y} r={15} fill="transparent"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        />
                    </g>
                ))}

                {/* X-axis labels */}
                {points.map((p, i) => (
                    i % xLabelInterval === 0 || i === points.length - 1 ? (
                        <text key={`x-${i}`} x={p.x} y={svgHeight - 8} textAnchor="middle"
                            className="fill-current text-muted-foreground" fontSize="9" fontWeight="500">
                            {formatLabel(p.label)}
                        </text>
                    ) : null
                ))}

                {/* Tooltip */}
                {hoveredIndex !== null && (
                    <g>
                        <line x1={points[hoveredIndex].x} y1={padding.top}
                            x2={points[hoveredIndex].x} y2={padding.top + plotHeight}
                            stroke={color} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3" />
                        <rect x={points[hoveredIndex].x - 40} y={points[hoveredIndex].y - 32}
                            width="80" height="24" rx="6" fill="var(--card)" stroke="var(--border)" />
                        <text x={points[hoveredIndex].x} y={points[hoveredIndex].y - 16}
                            textAnchor="middle" fontSize="11" fontWeight="700"
                            className="fill-current text-foreground">
                            {points[hoveredIndex].value} patients
                        </text>
                    </g>
                )}
            </svg>
        </div>
    );
}

/* ========== SVG Bar Chart (Histogram) ========== */

function BarChartComponent({ data, colorMap, height }: {
    data: DistributionItem[];
    colorMap?: Record<string, string>;
    height: number;
}) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (data.length === 0) {
        return <EmptyChart height={height} message="No data available" />;
    }

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const padding = { top: 20, right: 20, bottom: 50, left: 45 };
    const svgWidth = 600;
    const svgHeight = height;
    const plotWidth = svgWidth - padding.left - padding.right;
    const plotHeight = svgHeight - padding.top - padding.bottom;
    const barWidth = Math.min(50, (plotWidth / data.length) * 0.6);
    const gap = (plotWidth - barWidth * data.length) / (data.length + 1);

    const yTicks = 5;
    const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((maxVal / yTicks) * i));

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ height }}>
                {/* Grid lines */}
                {yLabels.map((_, i) => {
                    const y = padding.top + plotHeight - (i / yTicks) * plotHeight;
                    return (
                        <line key={i} x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y}
                            stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                    );
                })}

                {/* Y-axis labels */}
                {yLabels.map((val, i) => {
                    const y = padding.top + plotHeight - (i / yTicks) * plotHeight;
                    return (
                        <text key={i} x={padding.left - 8} y={y + 4} textAnchor="end"
                            className="fill-current text-muted-foreground" fontSize="10" fontWeight="500">
                            {val}
                        </text>
                    );
                })}

                {/* Bars */}
                {data.map((d, i) => {
                    const barHeight = (d.value / maxVal) * plotHeight;
                    const x = padding.left + gap + i * (barWidth + gap);
                    const y = padding.top + plotHeight - barHeight;
                    const fillColor = colorMap?.[d.label] || CHART_COLORS[i % CHART_COLORS.length];

                    return (
                        <g key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="cursor-pointer"
                        >
                            <rect x={x} y={y} width={barWidth} height={barHeight}
                                rx={4} fill={fillColor}
                                opacity={hoveredIndex === null || hoveredIndex === i ? 1 : 0.4}
                                className="transition-all duration-150"
                            />
                            {/* Value label */}
                            {(hoveredIndex === i || data.length <= 5) && (
                                <text x={x + barWidth / 2} y={y - 6} textAnchor="middle"
                                    fontSize="10" fontWeight="700" className="fill-current text-foreground">
                                    {d.value}
                                </text>
                            )}
                            {/* X-axis label */}
                            <text x={x + barWidth / 2} y={svgHeight - 10} textAnchor="middle"
                                fontSize="9" fontWeight="500" className="fill-current text-muted-foreground"
                                transform={data.length > 4 ? `rotate(-25, ${x + barWidth / 2}, ${svgHeight - 10})` : undefined}
                            >
                                {d.label.length > 12 ? d.label.slice(0, 10) + '…' : d.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

/* ========== SVG Donut Chart ========== */

function DonutChart({ data, size }: { data: DistributionItem[]; size: number }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const total = data.reduce((s, d) => s + d.value, 0);

    if (total === 0) {
        return (
            <div className="flex items-center justify-center" style={{ width: size, height: size }}>
                <p className="text-xs text-muted-foreground">No data</p>
            </div>
        );
    }

    const center = size / 2;
    const radius = size * 0.38;
    const innerRadius = radius * 0.6;
    let currentAngle = -Math.PI / 2; // Start from top

    const arcs = data.map((d, i) => {
        const angle = (d.value / total) * 2 * Math.PI;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;

        const largeArc = angle > Math.PI ? 1 : 0;

        const x1 = center + radius * Math.cos(startAngle);
        const y1 = center + radius * Math.sin(startAngle);
        const x2 = center + radius * Math.cos(endAngle);
        const y2 = center + radius * Math.sin(endAngle);

        const ix1 = center + innerRadius * Math.cos(startAngle);
        const iy1 = center + innerRadius * Math.sin(startAngle);
        const ix2 = center + innerRadius * Math.cos(endAngle);
        const iy2 = center + innerRadius * Math.sin(endAngle);

        const path = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${ix2} ${iy2}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
            'Z'
        ].join(' ');

        return { path, color: CHART_COLORS[i % CHART_COLORS.length], ...d, percentage: Math.round((d.value / total) * 100) };
    });

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
                    {arcs.map((arc, i) => (
                        <path
                            key={i}
                            d={arc.path}
                            fill={arc.color}
                            stroke="var(--card)"
                            strokeWidth="2"
                            opacity={hoveredIndex === null || hoveredIndex === i ? 1 : 0.35}
                            className="transition-all duration-200 cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        />
                    ))}
                    {/* Center text */}
                    <text x={center} y={center - 6} textAnchor="middle" fontSize="18" fontWeight="800" className="fill-current text-foreground">
                        {hoveredIndex !== null ? arcs[hoveredIndex].value : total}
                    </text>
                    <text x={center} y={center + 12} textAnchor="middle" fontSize="9" fontWeight="500" className="fill-current text-muted-foreground">
                        {hoveredIndex !== null ? arcs[hoveredIndex].label : 'Total'}
                    </text>
                </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
                {arcs.map((arc, i) => (
                    <div key={i}
                        className={clsx('flex items-center gap-1.5 cursor-pointer transition-opacity', hoveredIndex !== null && hoveredIndex !== i && 'opacity-40')}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: arc.color }} />
                        <span className="text-[10px] font-semibold text-foreground whitespace-nowrap">
                            {arc.label} ({arc.percentage}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ========== SVG Stacked Bar Chart (Disease Trends) ========== */

function StackedBarChart({ data, height, range }: {
    data: DiseaseTrendPoint[];
    height: number;
    range: string;
}) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Extract all unique conditions
    const allConditions = new Set<string>();
    data.forEach(d => Object.keys(d.conditions).forEach(c => allConditions.add(c)));
    const conditions = Array.from(allConditions);

    if (data.length === 0 || conditions.length === 0) {
        return <EmptyChart height={height} message="No disease trend data available" />;
    }

    // Max stacked value
    const maxVal = Math.max(...data.map(d => Object.values(d.conditions).reduce((s, v) => s + v, 0)), 1);

    const padding = { top: 20, right: 20, bottom: 40, left: 45 };
    const svgWidth = 600;
    const svgHeight = height;
    const plotWidth = svgWidth - padding.left - padding.right;
    const plotHeight = svgHeight - padding.top - padding.bottom;
    const barWidth = Math.min(40, (plotWidth / data.length) * 0.65);
    const gap = (plotWidth - barWidth * data.length) / (data.length + 1);

    const yTicks = 5;
    const yLabels = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((maxVal / yTicks) * i));

    const formatLabel = (label: string) => {
        if (range === 'daily') {
            const d = new Date(label + 'T00:00:00');
            return `${d.getDate()}/${d.getMonth() + 1}`;
        }
        const parts = label.split('-');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[parseInt(parts[1]) - 1] || label;
    };

    return (
        <div>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ height }}>
                {/* Grid lines */}
                {yLabels.map((_, i) => {
                    const y = padding.top + plotHeight - (i / yTicks) * plotHeight;
                    return (
                        <line key={i} x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y}
                            stroke="currentColor" strokeOpacity="0.08" strokeDasharray="4 4" />
                    );
                })}

                {/* Y-axis labels */}
                {yLabels.map((val, i) => {
                    const y = padding.top + plotHeight - (i / yTicks) * plotHeight;
                    return (
                        <text key={i} x={padding.left - 8} y={y + 4} textAnchor="end"
                            className="fill-current text-muted-foreground" fontSize="10" fontWeight="500">
                            {val}
                        </text>
                    );
                })}

                {/* Stacked bars */}
                {data.map((d, di) => {
                    const x = padding.left + gap + di * (barWidth + gap);
                    let yOffset = 0;

                    return (
                        <g key={di}
                            onMouseEnter={() => setHoveredIndex(di)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="cursor-pointer"
                        >
                            {conditions.map((cond, ci) => {
                                const val = d.conditions[cond] || 0;
                                if (val === 0) return null;
                                const barH = (val / maxVal) * plotHeight;
                                const y = padding.top + plotHeight - yOffset - barH;
                                yOffset += barH;

                                return (
                                    <rect key={ci} x={x} y={y} width={barWidth} height={barH}
                                        fill={CHART_COLORS[ci % CHART_COLORS.length]}
                                        opacity={hoveredIndex === null || hoveredIndex === di ? 1 : 0.4}
                                        rx={ci === conditions.length - 1 ? 3 : 0}
                                        className="transition-all duration-150"
                                    />
                                );
                            })}
                            {/* X-axis label */}
                            <text x={x + barWidth / 2} y={svgHeight - 10} textAnchor="middle"
                                fontSize="9" fontWeight="500" className="fill-current text-muted-foreground">
                                {formatLabel(d.label)}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center px-4">
                {conditions.slice(0, 8).map((cond, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="text-[9px] font-semibold text-muted-foreground">{cond}</span>
                    </div>
                ))}
                {conditions.length > 8 && (
                    <span className="text-[9px] text-muted-foreground font-medium">+{conditions.length - 8} more</span>
                )}
            </div>
        </div>
    );
}

/* ========== Empty Chart Placeholder ========== */

function EmptyChart({ height, message }: { height: number; message: string }) {
    return (
        <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-secondary/30"
            style={{ height }}
        >
            <BarChart3 size={28} className="text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">{message}</p>
        </div>
    );
}
