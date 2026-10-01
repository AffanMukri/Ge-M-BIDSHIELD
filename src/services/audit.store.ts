import { AuditEvent } from '../types';
import { useSyncExternalStore } from 'react';

const rawSeed:AuditEvent[]=[
 {eventId:'AUD-041-001',timestamp:'2026-09-29T10:42:18+05:30',user:'System',type:'FINDING_CREATED',description:'OEM authorization warning created',tenderId:'CPCL/PROC/2026/041',bidderId:'apex',referenceId:'EV-26041-OEM-0088'},
 {eventId:'AUD-041-002',timestamp:'2026-09-29T10:41:54+05:30',user:'GSTN adapter',type:'PROVIDER_QUERIED',description:'GST verification completed using MOCK response',referenceId:'EV-26041-GST-0182'},
 {eventId:'AUD-041-003',timestamp:'2026-09-29T10:39:12+05:30',user:'Document security gateway',type:'SUSPICIOUS_INSTRUCTION_DETECTED',description:'Hidden instruction-like text routed to manual review; compliance outcome unchanged',documentId:'SEC-DEMO-02',tenderId:'CPCL/PROC/2026/041',bidderId:'apex',securityResult:'SUSPICIOUS',referenceId:'SEC-SEC-DEMO-02-1'},
];
const digest=(value:string)=>{let h=5381;for(const c of value)h=((h<<5)+h)^c.charCodeAt(0);return `sha256-demo-${(h>>>0).toString(16).padStart(8,'0')}`};
let previous='GENESIS-26100';
const seed=rawSeed.slice().reverse().map(event=>{const payloadDigest=digest(JSON.stringify(event));const currentHash=digest(`${previous}|${payloadDigest}|${event.timestamp}`);const chained={...event,payloadDigest,previousHash:previous,currentHash};previous=currentHash;return chained}).reverse();
let events=[...seed]; const listeners=new Set<()=>void>();
export function appendAuditEvent(event:Omit<AuditEvent,'eventId'|'timestamp'|'payloadDigest'|'previousHash'|'currentHash'>){const timestamp=new Date().toISOString();const eventId=`AUD-041-${String(events.length+1).padStart(3,'0')}`;const payloadDigest=digest(JSON.stringify(event));const previousHash=events[0]?.currentHash??'GENESIS-26100';const currentHash=digest(`${previousHash}|${payloadDigest}|${timestamp}`);events=[{...event,eventId,timestamp,payloadDigest,previousHash,currentHash},...events];listeners.forEach(l=>l());}
export function useAuditEvents(){ return useSyncExternalStore(cb=>{listeners.add(cb);return()=>listeners.delete(cb)},()=>events,()=>events); }
export function getAuditEvents(){return events;}
