import { useState } from 'react'

const ST = { ok: 'En línea', warn: 'Degradado', bad: 'Caído' }
const ASSETS = [
  ['SRV-WEB-01', 'Servidor', '192.168.1.10', 'CPD Norte · Rack A3', 'ok', 'Hace 24 s'],
  ['SW-CORE-01', 'Switch', '192.168.1.2', 'CPD Norte · Rack A1', 'warn', 'Hace 38 s'],
  ['RTR-BORDE-01', 'Router', '10.0.0.1', 'CPD Norte · Rack A1', 'ok', 'Hace 31 s'],
  ['FW-PERIM-01', 'Firewall', '10.0.0.254', 'CPD Norte · Rack A2', 'ok', 'Hace 43 s'],
  ['SRV-DB-02', 'Servidor', '192.168.1.21', 'CPD Norte · Rack B4', 'bad', 'Hace 6 min'],
  ['SW-PLANTA-03', 'Switch', '172.16.3.2', 'Oficina Madrid · P3', 'ok', 'Hace 52 s'],
  ['SRV-BKP-01', 'Servidor', '192.168.1.30', 'CPD Sur · Rack C2', 'ok', 'Hace 1 min'],
]
const CHANGES = [
  ['29 sep · 10:42', 'SRV-WEB-01', 'Ana Martínez', 'DNS primario', '192.168.1.1', '10.10.0.53'],
  ['29 sep · 09:18', 'SW-CORE-01', 'Ana Martínez', 'VLAN nativa', '1', '120'],
  ['28 sep · 16:18', 'SRV-WEB-01', 'Carlos Ruiz', 'Responsable', 'Carlos Ruiz', 'Ana Martínez'],
  ['28 sep · 14:02', 'RTR-BORDE-01', 'Carlos Ruiz', 'Regla firewall', 'Permitir 443', 'Permitir 80, 443'],
  ['27 sep · 11:34', 'FW-PERIM-01', 'Lucía Gómez', 'Firmware', '7.2.4', '7.4.1'],
  ['26 sep · 09:05', 'SRV-WEB-01', 'Lucía Gómez', 'Sistema operativo', 'Ubuntu 22.04', 'Ubuntu 24.04 LTS'],
]
const ALERTS = [
  ['SRV-DB-02', 'Crítica', 'SSH sin respuesta', '29 sep · 10:36', '6 min', 'Abierta'],
  ['SW-CORE-01', 'Media', 'Latencia elevada', '29 sep · 10:24', '18 min', 'Investigando'],
  ['RTR-BORDE-01', 'Alta', 'Pérdida de paquetes', '29 sep · 09:58', '14 min', 'Resuelta'],
]
const CHECKS = [
  ['SRV-WEB-01', 'Ping', '192.168.1.10', 'ok', '8 ms', '99,99%'],
  ['SRV-WEB-01', 'HTTP', 'portal.empresa.com', 'ok', '112 ms', '99,98%'],
  ['SW-CORE-01', 'Ping', '192.168.1.2', 'warn', '184 ms', '98,72%'],
  ['SRV-DB-02', 'SSH', '192.168.1.21:22', 'bad', '—', '96,10%'],
]
const NAV = [['dash', 'Dashboard'], ['inv', 'Inventario'], ['mon', 'Monitoreo'], ['cam', 'Cambios'], ['ale', 'Alertas']]

const Badge = ({ s }) => <span className={'b ' + s}>{ST[s]}</span>
const AlertBadge = ({ v }) => <span className={'b ' + (v === 'Resuelta' ? 'ok' : v === 'Abierta' ? 'bad' : 'warn')}>{v}</span>
const Stat = ({ v, l, c }) => <div className="card stat"><b className={c}>{v}</b><span>{l}</span></div>
const Table = ({ head, rows }) => (
  <div className="card tw"><table>
    <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
  </table></div>
)
const Chart = ({ d }) => {
  const mx = Math.max(...d), mn = Math.min(...d)
  const pts = d.map((v, i) => `${(i * 100) / (d.length - 1)},${100 - ((v - mn) / (mx - mn || 1)) * 80 - 10}`).join(' ')
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="chart">
      <polyline points={pts} fill="none" stroke="var(--acc)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
const Head = ({ t, s, children }) => (
  <div className="head"><div><h1>{t}</h1><p>{s}</p></div><div className="row">{children}</div></div>
)

function Login({ go }) {
  return (
    <div className="login">
      <form className="card lf" onSubmit={(e) => { e.preventDefault(); go('dash') }}>
        <h2>Control total de tu red</h2>
        <p>Supervisa disponibilidad, cambios y alertas desde una consola operativa unificada.</p>
        <label>Correo electrónico<input type="email" defaultValue="ana.martinez@empresa.com" /></label>
        <label>Contraseña<input type="password" defaultValue="password123" /></label>
        <button className="btn">Iniciar sesión</button>
      </form>
      <div className="quote">
        <h2>La visibilidad que necesitas para actuar antes de que la red se detenga.</h2>
        <div className="row"><Stat v="247" l="activos" /><Stat v="12 ms" l="respuesta media" /><Stat v="31 d" l="sin incidentes" /></div>
      </div>
    </div>
  )
}

function Dashboard({ alerts }) {
  const open = alerts.filter((a) => a[5] !== 'Resuelta')
  return (<>
    <Head t="Dashboard" s="Resumen operativo de la infraestructura" />
    <div className="grid4">
      <Stat v="247" l="Total de activos" /><Stat v="238" l="Activos en línea" c="ok" />
      <Stat v={open.length} l="Alertas activas" c="bad" /><Stat v="99,97%" l="Disponibilidad global" />
    </div>
    <div className="grid2">
      <div className="card pad"><h3>Disponibilidad de la red · 7 días</h3><Chart d={[99.9, 99.95, 99.8, 99.99, 99.9, 99.97, 99.99]} /></div>
      <div className="card pad"><h3>Estado por ubicación</h3>
        {[['Centro de datos Norte', 99.99], ['Oficina Madrid', 99.92], ['Sede Barcelona', 98.74], ['Almacén Valencia', 96.1]].map(([n, v]) => (
          <div key={n} className="bar"><span>{n}</span><i><u style={{ width: v + '%' }} /></i><b>{v}%</b></div>))}
      </div>
    </div>
    <div className="grid2">
      <div className="card pad"><h3>Últimas alertas</h3>{alerts.map((a) => <p key={a[0]} className="li"><b>{a[0]}</b> {a[2]} <AlertBadge v={a[5]} /></p>)}</div>
      <div className="card pad"><h3>Cambios recientes</h3>{CHANGES.slice(0, 3).map((c) => <p key={c[0]} className="li"><b>{c[1]}</b> {c[3]} · {c[2]}</p>)}</div>
    </div>
  </>)
}

function Inventory({ list, go, pick }) {
  const [q, setQ] = useState('')
  const [t, setT] = useState('Todos')
  const rows = list.filter((a) => (t === 'Todos' || a[1] === t) && a.slice(0, 4).join(' ').toLowerCase().includes(q.toLowerCase()))
  return (<>
    <Head t="Inventario de activos" s={`${list.length} activos registrados`}>
      <button className="btn" onClick={() => go('form')}>Registrar activo</button>
    </Head>
    <div className="row">
      <input placeholder="Buscar por nombre, IP o ubicación…" value={q} onChange={(e) => setQ(e.target.value)} />
      <select value={t} onChange={(e) => setT(e.target.value)}>{['Todos', 'Servidor', 'Switch', 'Router', 'Firewall'].map((x) => <option key={x}>{x}</option>)}</select>
    </div>
    {rows.length ? (
      <div className="card tw"><table>
        <thead><tr>{['Nombre', 'Tipo', 'Dirección IP', 'Ubicación', 'Estado', 'Última revisión'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((a) => (
          <tr key={a[0]} className="click" onClick={() => { pick(a); go('det') }}>
            {a.slice(0, 4).map((c, i) => <td key={i}>{c}</td>)}<td><Badge s={a[4]} /></td><td>{a[5]}</td>
          </tr>))}</tbody>
      </table></div>
    ) : <div className="card pad empty"><h3>Sin resultados</h3><p>Ajusta los filtros o registra un nuevo activo.</p></div>}
  </>)
}

function Form({ go, add }) {
  const [f, setF] = useState({ n: '', t: 'Servidor', ip: '', mac: '', loc: '', resp: 'Ana Martínez', so: '', notas: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const ok = f.n && f.ip && f.loc
  return (<>
    <Head t="Registrar o editar activo" s="Completa la información técnica y asigna un responsable">
      <button className="btn ghost" onClick={() => go('inv')}>Volver al inventario</button>
    </Head>
    <div className="grid2">
      <div className="card pad fm">
        <label>Nombre del activo *<input value={f.n} onChange={set('n')} placeholder="SRV-WEB-01" /></label>
        <label>Tipo *<select value={f.t} onChange={set('t')}>{['Servidor', 'Switch', 'Router', 'Firewall'].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Dirección IP *<input value={f.ip} onChange={set('ip')} placeholder="192.168.1.10" /></label>
        <label>Dirección MAC<input value={f.mac} onChange={set('mac')} placeholder="00:1B:44:11:3A:B7" /></label>
        <label>Ubicación *<input value={f.loc} onChange={set('loc')} placeholder="CPD Norte · Rack A3" /></label>
        <label>Responsable<input value={f.resp} onChange={set('resp')} /></label>
        <label>Sistema operativo / firmware<input value={f.so} onChange={set('so')} /></label>
        <label>Notas<textarea value={f.notas} onChange={set('notas')} /></label>
      </div>
      <div className="card pad">
        <h3>Monitoreo inicial</h3>
        <p>Se crearán automáticamente: Ping ICMP cada 60 s, HTTP/HTTPS cada 2 min y SSH cada 5 min. Retención de métricas: 90 días.</p>
        <p className="mute">Consejo: usa nombres con el formato TIPO-UBICACIÓN-NÚMERO.</p>
      </div>
    </div>
    <div className="row end">
      <button className="btn ghost" onClick={() => go('inv')}>Cancelar</button>
      <button className="btn" disabled={!ok} onClick={() => { add([f.n, f.t, f.ip, f.loc, 'ok', 'Ahora']); go('inv') }}>Guardar activo</button>
    </div>
  </>)
}

function Detail({ a, go }) {
  const [n, t, ip, loc, s] = a
  return (<>
    <Head t={n} s={`${t} · ${ip}`}><button className="btn ghost" onClick={() => go('inv')}>Volver</button></Head>
    <div className="grid4">
      <div className="card stat"><Badge s={s} /><span>{loc}</span></div>
      <Stat v="12 ms" l="Respuesta" /><Stat v="31 días" l="Tiempo activo" /><Stat v="0,0%" l="Pérdida" />
    </div>
    <div className="grid2">
      <div className="card pad"><h3>Disponibilidad (SLO 99,9%)</h3><p>24 horas <b>100%</b> · 7 días <b>99,98%</b> · 30 días <b>99,91%</b></p><p className="mute">Presupuesto de error restante: 31 min 4 s</p></div>
      <div className="card pad"><h3>Tiempo de respuesta · 24 h</h3><Chart d={[14, 12, 13, 11, 12, 15, 12, 10, 12]} /></div>
    </div>
    <h3>Historial de cambios</h3>
    <Table head={['Fecha', 'Campo', 'Anterior', 'Nuevo']} rows={CHANGES.filter((c) => c[1] === n).map((c) => [c[0], c[3], c[4], c[5]])} />
  </>)
}

function Monitor() {
  return (<>
    <Head t="Monitoreo de disponibilidad" s="Comprobaciones en tiempo real de servicios críticos"><button className="btn">Ejecutar verificación ahora</button></Head>
    <div className="grid4"><Stat v="312" l="Servicios supervisados" /><Stat v="306" l="Operativos" c="ok" /><Stat v="4" l="Degradados" c="warn" /><Stat v="2" l="Caídos" c="bad" /></div>
    <div className="card tw"><table>
      <thead><tr>{['Activo', 'Servicio', 'Destino', 'Estado', 'Respuesta', 'Uptime 30 d'].map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{CHECKS.map((r, i) => <tr key={i}>{r.slice(0, 3).map((c, j) => <td key={j}>{c}</td>)}<td><Badge s={r[3]} /></td><td>{r[4]}</td><td>{r[5]}</td></tr>)}</tbody>
    </table></div>
  </>)
}

function Changes() {
  const csv = () => {
    const txt = ['Fecha,Activo,Usuario,Campo,Anterior,Nuevo', ...CHANGES.map((r) => r.join(','))].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/csv' }))
    a.download = 'cambios.csv'
    a.click()
  }
  return (<>
    <Head t="Historial de cambios" s="Auditoría global de modificaciones de configuración"><button className="btn" onClick={csv}>Exportar CSV</button></Head>
    <Table head={['Fecha', 'Activo', 'Usuario', 'Campo modificado', 'Valor anterior', 'Valor nuevo']} rows={CHANGES} />
  </>)
}

function Alerts({ alerts, setAlerts }) {
  const resolve = (n) => setAlerts(alerts.map((a) => (a[0] === n ? [...a.slice(0, 5), 'Resuelta'] : a)))
  const open = alerts.filter((a) => a[5] !== 'Resuelta').length
  return (<>
    <Head t="Alertas e incidentes" s="Prioriza, investiga y resuelve eventos operativos" />
    <div className="grid4"><Stat v={open} l="Alertas activas" c="bad" /><Stat v="12 min" l="Tiempo medio de resolución" /></div>
    {alerts.map((a) => (
      <div key={a[0]} className="card pad al">
        <div><b>{a[0]}</b> <span className="mute">{a[1]}</span><p>{a[2]} · Inicio {a[3]} · Duración {a[4]}</p></div>
        <div className="row"><AlertBadge v={a[5]} />{a[5] !== 'Resuelta' && <button className="btn ghost" onClick={() => resolve(a[0])}>Marcar como resuelta</button>}</div>
      </div>))}
    {open === 0 && <div className="card pad empty"><p>Sin alertas pendientes. Los incidentes resueltos siguen disponibles en el historial.</p></div>}
  </>)
}

export default function App() {
  const [page, go] = useState('login')
  const [list, setList] = useState(ASSETS)
  const [alerts, setAlerts] = useState(ALERTS)
  const [sel, pick] = useState(ASSETS[0])
  if (page === 'login') return <Login go={go} />
  const cur = page === 'form' || page === 'det' ? 'inv' : page
  return (
    <div className="shell">
      <aside>
        <div className="logo">NetGuard</div>
        <nav>{NAV.map(([k, l]) => (
          <button key={k} className={cur === k ? 'on' : ''} onClick={() => go(k)}>{l}{k === 'ale' && alerts.some((a) => a[5] !== 'Resuelta') ? ' ●' : ''}</button>))}</nav>
        <div className="user">Ana Martínez<br /><span>Administradora</span></div>
      </aside>
      <main>
        {page === 'dash' && <Dashboard alerts={alerts} />}
        {page === 'inv' && <Inventory list={list} go={go} pick={pick} />}
        {page === 'form' && <Form go={go} add={(a) => setList([a, ...list])} />}
        {page === 'det' && <Detail a={sel} go={go} />}
        {page === 'mon' && <Monitor />}
        {page === 'cam' && <Changes />}
        {page === 'ale' && <Alerts alerts={alerts} setAlerts={setAlerts} />}
      </main>
    </div>
  )
}
