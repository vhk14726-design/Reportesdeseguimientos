
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Ene', inversion: 4000, utilidad: 2400 },
  { name: 'Feb', inversion: 3000, utilidad: 1398 },
  { name: 'Mar', inversion: 2000, utilidad: 9800 },
  { name: 'Abr', inversion: 2780, utilidad: 3908 },
  { name: 'May', inversion: 1890, utilidad: 4800 },
  { name: 'Jun', inversion: 2390, utilidad: 3800 },
];

interface DashboardProps {
  title: string;
}

const Dashboard: React.FC<DashboardProps> = ({ title }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500">Métricas clave y análisis del periodo actual.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Inversión', val: 'Gs. 24.5M', delta: '+12%', color: 'emerald' },
          { label: 'Utilidad Neta', val: 'Gs. 8.2M', delta: '+5.4%', color: 'blue' },
          { label: 'Solicitudes Activas', val: '142', delta: '-2%', color: 'amber' },
          { label: 'ROI Promedio', val: '18.4%', delta: '+0.8%', color: 'purple' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold text-slate-900">{stat.val}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.delta.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {stat.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Evolución de Inversiones</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="inversion" stroke="#10b981" fillOpacity={1} fill="url(#colorInv)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Comparativa de Utilidad</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="utilidad" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
