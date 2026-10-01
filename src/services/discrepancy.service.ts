import { Discrepancy, DiscrepancyType } from '../types';

export const normalizeValue = (value = '') => value.trim().toUpperCase().replace(/\b(PVT|PRIVATE)\b/g,'PRIVATE').replace(/\bLTD\b/g,'LIMITED').replace(/[^A-Z0-9%]/g,'');

export function compareEvidence(input:{id:string;field:string;submittedValue?:string;documentValue?:string;sourceValue?:string;confidence?:number;evidenceIds:string[];type?:DiscrepancyType}):Discrepancy {
  const values=[input.submittedValue,input.documentValue,input.sourceValue].filter(Boolean) as string[];
  const normalized=values.map(normalizeValue);
  let type:DiscrepancyType=input.type ?? 'MISSING';
  if(!input.type){
    if(values.length<2) type='MISSING';
    else if(values.every(v=>v===values[0])) type='EXACT MATCH';
    else if(normalized.every(v=>v===normalized[0])) type='NORMALIZED MATCH';
    else type='VALUE MISMATCH';
  }
  const severity=type==='EXACT MATCH'||type==='NORMALIZED MATCH'?'info':type==='EXPIRED'||type==='IDENTIFIER MISMATCH'?'critical':'review';
  return {id:input.id,field:input.field,type,submittedValue:input.submittedValue,documentValue:input.documentValue,sourceValue:input.sourceValue,normalizedValues:normalized,severity,confidence:input.confidence??90,explanation:explain(type,input.field),evidenceIds:input.evidenceIds};
}
function explain(type:DiscrepancyType,field:string){
  if(type==='SOURCE UNAVAILABLE') return `The source for ${field} is unavailable. No adverse inference is produced.`;
  if(type==='MISSING') return `${field} is required but no usable value was found. This is missing information, not a confirmed failure.`;
  if(type==='NORMALIZED MATCH') return `Values match after approved legal-entity normalization.`;
  if(type==='EXACT MATCH') return `Submitted, document and source values match exactly.`;
  return `${field} differs across submitted, document or source evidence and requires review.`;
}
