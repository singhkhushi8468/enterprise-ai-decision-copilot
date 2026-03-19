import { useState, useEffect } from 'react'
import { EXPERTS } from '../assets/expertsData.js'
import ExpertCard from '../components/ExpertCard.jsx'
import styles from './Dashboard.module.css'

const ACTIVITIES_BASE = [
  { id:1, icon:'🤖', color:'#4f8ef7', text:'AI model confidence updated to 86%',          time:'just now', tag:'AI/ML'   },
  { id:2, icon:'📊', color:'#22d3a5', text:'New scenario run: Market Expansion Q3',       time:'2m ago',   tag:'Scenario'},
  { id:3, icon:'📋', color:'#7c5cfc', text:'Strategic Report generated — Q4 Plan',        time:'8m ago',   tag:'Report'  },
  { id:4, icon:'⚡', color:'#f7b84f', text:'Data pipeline quality: 94% confirmed',        time:'15m ago',  tag:'Data'    },
  { id:5, icon:'🌐', color:'#f75f5f', text:'Risk flag: EU regulatory review needed',      time:'23m ago',  tag:'Risk'    },
  { id:6, icon:'💡', color:'#22d3a5', text:'Cost optimisation: $2.4M savings identified', time:'34m ago', tag:'Finance' },
  { id:7, icon:'🔐', color:'#4f8ef7', text:'User signed in successfully',                 time:'1h ago',   tag:'Auth'    },
]
const NOTIFS = [
  { id:1, icon:'⚠️', text:'EU regulatory risk flagged in scenario', time:'5m ago',  unread:true  },
  { id:2, icon:'✅', text:'Q4 Strategic Report ready to export',    time:'12m ago', unread:true  },
  { id:3, icon:'📈', text:'Revenue model updated — +34% projected', time:'1h ago',  unread:true  },
  { id:4, icon:'🤖', text:'AI model retrained with new data',       time:'3h ago',  unread:false },
  { id:5, icon:'☁️', text:'Phase 2 Cloud planning kickoff set',     time:'1d ago',  unread:false },
]
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug']
const CDATA  = [22,38,31,55,48,70,63,85]
const CBASE  = [15,20,18,25,22,30,28,35]
const SITEMS = [
  { label:'AI Copilot Chat',         page:'chat',      icon:'💬' },
  { label:'Scenario Simulation',     page:'scenarios', icon:'📈' },
  { label:'Strategic Reports',       page:'reports',   icon:'📋' },
  { label:'Expert Roster',           page:'experts',   icon:'👥' },
  { label:'Market Expansion Report', page:'reports',   icon:'🌐' },
  { label:'Risk Assessment',         page:'reports',   icon:'🛡️' },
  { label:'Q4 Strategic Plan',       page:'reports',   icon:'📅' },
  { label:'AI/ML Expert',            page:'experts',   icon:'🤖' },
  { label:'Cloud Architect',         page:'experts',   icon:'☁️' },
  { label:'Data Engineer',           page:'experts',   icon:'📊' },
]

export default function Dashboard({ onNavigate, theme, onToggleTheme }) {
  const [acts,    setActs]    = useState(ACTIVITIES_BASE)
  const [notifs,  setNotifs]  = useState(NOTIFS)
  const [notifO,  setNotifO]  = useState(false)
  const [search,  setSearch]  = useState('')
  const [searchO, setSearchO] = useState(false)
  const [anim,    setAnim]    = useState(false)
  const [compare, setCompare] = useState(false)
  const [cnt,     setCnt]     = useState({ e:0, s:0, d:0 })
  const unread = notifs.filter(n=>n.unread).length
  const maxC   = Math.max(...CDATA)

  useEffect(()=>{
    const dur=1200, t0=performance.now(); let fr
    const tick=now=>{
      const p=Math.min((now-t0)/dur,1), e=1-Math.pow(1-p,3)
      setCnt({ e:Math.round(e*3), s:Math.round(e*128), d:Math.round(e*47) })
      if(p<1) fr=requestAnimationFrame(tick)
    }
    fr=requestAnimationFrame(tick)
    return ()=>cancelAnimationFrame(fr)
  },[])

  useEffect(()=>{ setTimeout(()=>setAnim(true),400) },[])

  useEffect(()=>{
    const ex=[
      {icon:'🔍',color:'#7c5cfc',text:'Scenario: Digital Transformation Q2 started',tag:'Scenario'},
      {icon:'📊',color:'#22d3a5',text:'Data pipeline ingested 1.2M records',tag:'Data'},
      {icon:'🤖',color:'#4f8ef7',text:'AI confidence spike: 89%',tag:'AI/ML'},
    ]
    let i=0
    const t=setInterval(()=>{
      const x=ex[i%ex.length]; i++
      setActs(p=>[{id:Date.now(),...x,time:'just now'},...p.slice(0,8)])
    },12000)
    return ()=>clearInterval(t)
  },[])

  const filtered = search.length>1 ? SITEMS.filter(x=>x.label.toLowerCase().includes(search.toLowerCase())) : []

  return (
    <div className={styles.page}>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10 10l3.5 3.5"/></svg>
            <input className={styles.searchInput} placeholder="Search features, reports, experts..."
              value={search} onChange={e=>{setSearch(e.target.value);setSearchO(true)}}
              onFocus={()=>setSearchO(true)} onBlur={()=>setTimeout(()=>setSearchO(false),150)}/>
            {search&&<span className={styles.clearSearch} onClick={()=>setSearch('')}>✕</span>}
          </div>
          {searchO&&filtered.length>0&&(
            <div className={styles.searchDropdown}>
              {filtered.map((x,i)=>(
                <div key={i} className={styles.searchItem} onClick={()=>{onNavigate(x.page);setSearch('')}}>
                  <span>{x.icon}</span><span>{x.label}</span><span className={styles.searchArrow}>↗</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.toolbarRight}>
          <button className={`${styles.toolBtn} ${compare?styles.toolBtnActive:''}`} onClick={()=>setCompare(c=>!c)}>⚖️ Compare</button>
          <button className={styles.themeBtn} onClick={onToggleTheme}>{theme==='dark'?'☀️':'🌙'}</button>
          <div className={styles.notifWrap}>
            <button className={styles.notifBtn} onClick={()=>setNotifO(o=>!o)}>
              🔔{unread>0&&<span className={styles.badge}>{unread}</span>}
            </button>
            {notifO&&(
              <div className={styles.notifPanel}>
                <div className={styles.notifHdr}>
                  <span>Notifications</span>
                  <span className={styles.markRead} onClick={()=>setNotifs(n=>n.map(x=>({...x,unread:false})))}>Mark all read</span>
                </div>
                {notifs.map(n=>(
                  <div key={n.id} className={`${styles.notifItem} ${n.unread?styles.notifUnread:''}`}>
                    <span className={styles.notifIcon}>{n.icon}</span>
                    <div className={styles.notifBody}>
                      <div className={styles.notifText}>{n.text}</div>
                      <div className={styles.notifTime}>{n.time}</div>
                    </div>
                    {n.unread&&<div className={styles.notifDot}/>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className={styles.metrics}>
        {[
          {icon:'👥',label:'Experts Active',     val:`${cnt.e} / 4`,  delta:'↑ Cloud in Phase 2', bar:75,  c1:'#4f8ef7',c2:'#7c5cfc'},
          {icon:'📈',label:'Scenarios Run',       val:cnt.s,           delta:'↑ 12 this week',     bar:85,  c1:'#22d3a5',c2:'#4f8ef7'},
          {icon:'⚡',label:'Decisions Supported', val:cnt.d,           delta:'↑ High confidence',  bar:60,  c1:'#7c5cfc',c2:'#f75f5f'},
          {icon:'☁️',label:'Cloud Module',        val:'Phase 2',       delta:'⟳ Coming soon',      bar:15,  c1:'#f7b84f',c2:'#f75f5f'},
        ].map((m,i)=>(
          <div key={i} className={styles.metric}>
            <div className={styles.metricTop}>
              <div className={styles.metricIcon}>{m.icon}</div>
              <div className={styles.metricLabel}>{m.label}</div>
            </div>
            <div className={styles.metricVal}>{m.val}</div>
            <div className={styles.metricDelta}>{m.delta}</div>
            <div className={styles.metricBar}>
              <div className={styles.metricFill} style={{width:`${m.bar}%`,background:`linear-gradient(90deg,${m.c1},${m.c2})`}}/>
            </div>
          </div>
        ))}
      </div>

      {/* CHART + ACTIVITY */}
      <div className={styles.midRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartHdr}>
            <div>
              <div className={styles.chartTitle}>Performance Overview</div>
              <div className={styles.chartSub}>Projected vs Baseline — 2026</div>
            </div>
            <div className={styles.chartLegend}>
              <span className={styles.legendDot} style={{background:'#4f8ef7'}}/>Projected
              <span className={styles.legendDot} style={{background:'rgba(255,255,255,.15)'}}/>Baseline
            </div>
          </div>
          <div className={styles.chartBars}>
            {MONTHS.map((m,i)=>(
              <div key={i} className={styles.barWrap}>
                <div className={styles.barGroup}>
                  <div className={styles.barBase} style={{height:anim?`${(CBASE[i]/maxC)*100}%`:'0%',transitionDelay:`${i*50}ms`}}/>
                  <div className={styles.barMain} style={{
                    height:anim?`${(CDATA[i]/maxC)*100}%`:'0%',
                    background:i>=6?'linear-gradient(180deg,#22d3a5,#4f8ef7)':'linear-gradient(180deg,#7c5cfc,#4f8ef7)',
                    transitionDelay:`${i*50}ms`
                  }}>
                    <div className={styles.barTooltip}>{CDATA[i]}%</div>
                  </div>
                </div>
                <div className={styles.barLabel}>{m}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.activityCard}>
          <div className={styles.activityHdr}>
            <div className={styles.chartTitle}>Live Activity</div>
            <div className={styles.liveDot}><span/>Live</div>
          </div>
          <div className={styles.activityList}>
            {acts.slice(0,7).map((a,i)=>(
              <div key={a.id} className={`${styles.actItem} ${i===0?styles.actNew:''}`}>
                <div className={styles.actIcon} style={{background:`${a.color}18`,border:`1px solid ${a.color}35`}}>{a.icon}</div>
                <div className={styles.actBody}>
                  <div className={styles.actText}>{a.text}</div>
                  <div className={styles.actMeta}>
                    <span className={styles.actTag} style={{color:a.color}}>{a.tag}</span>
                    <span className={styles.actTime}>{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMPARE */}
      {compare&&(
        <div className={styles.compareCard}>
          <div className={styles.compareHdr}>
            <div className={styles.chartTitle}>⚖️ Scenario Comparison</div>
            <button className={styles.closeBtn} onClick={()=>setCompare(false)}>✕ Close</button>
          </div>
          <div className={styles.compareGrid}>
            {[
              {label:'Market Expansion',rev:'+34%',cost:'+18%',roi:'2.4x',risk:'Moderate',color:'#4f8ef7'},
              {label:'Cost Optimisation',rev:'+12%',cost:'-22%',roi:'1.8x',risk:'Low',color:'#22d3a5'},
              {label:'Product Launch',rev:'+48%',cost:'+28%',roi:'3.1x',risk:'High',color:'#7c5cfc'},
            ].map((s,i)=>(
              <div key={i} className={styles.compareItem} style={{borderColor:`${s.color}44`}}>
                <div className={styles.compareLabel} style={{color:s.color}}>{s.label}</div>
                <div className={styles.compareStats}>
                  <div className={styles.compareStat}><span>Revenue</span><strong style={{color:'#22d3a5'}}>{s.rev}</strong></div>
                  <div className={styles.compareStat}><span>Cost</span><strong style={{color:s.cost.startsWith('-')?'#22d3a5':'#f75f5f'}}>{s.cost}</strong></div>
                  <div className={styles.compareStat}><span>ROI</span><strong style={{color:'#4f8ef7'}}>{s.roi}</strong></div>
                  <div className={styles.compareStat}><span>Risk</span><strong style={{color:s.risk==='Low'?'#22d3a5':s.risk==='High'?'#f75f5f':'#f7b84f'}}>{s.risk}</strong></div>
                </div>
                <button className={styles.compareRunBtn} style={{borderColor:`${s.color}55`,color:s.color}} onClick={()=>onNavigate('scenarios')}>Run Simulation ↗</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXPERTS */}
      <div className={styles.sectionHdr}>
        <div className={styles.sectionTitle}>Domain Expert Roster</div>
        <div className={styles.sectionRight}>
          <span className={styles.sectionSub}>4 experts · 3 active · 1 pending</span>
          <button className={styles.exportBtn} onClick={()=>{
            const d=`Enterprise AI Copilot — Expert Roster\n\n`+EXPERTS.map(e=>`${e.name}\nRole: ${e.role}\nSkills: ${e.skills.join(', ')}\n`).join('\n')
            const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([d],{type:'text/plain'})); a.download='expert-roster.txt'; a.click()
          }}>⬇ Export Roster</button>
        </div>
      </div>
      <div className={styles.grid}>
        {EXPERTS.map(expert=>(
          <ExpertCard key={expert.id} expert={expert}
            onClick={()=>onNavigate(expert.id==='aiml'?'chat':expert.id==='fullstack'?'reports':'scenarios')}/>
        ))}
      </div>
    </div>
  )
}
