import { DocumentSecurityResult, SecurityFlag } from '../types';

const indicators=[
  {category:'AI_TARGETING',pattern:/\b(ai|assistant|model|system)\b/i},
  {category:'INSTRUCTION_OVERRIDE',pattern:/ignore (all |any )?(previous|prior) instructions?/i},
  {category:'OUTCOME_MANIPULATION',pattern:/(mark|declare).{0,24}(compliant|qualified)|skip verification|override (the )?rules?/i},
  {category:'DATA_EXFILTRATION',pattern:/reveal.{0,20}(system|hidden|prompt)/i},
];
export interface UntrustedDocumentInput { documentId:string; embeddedText:string; visibleOcrText:string; page?:number }
export function scanUntrustedDocument(input:UntrustedDocumentInput):DocumentSecurityResult {
  const extra=input.embeddedText.replace(input.visibleOcrText,'');
  const differencePercent=Math.round(Math.abs(input.embeddedText.length-input.visibleOcrText.length)/Math.max(input.visibleOcrText.length,1)*100);
  const flags:SecurityFlag[]=indicators.filter(x=>x.pattern.test(extra)).map((x,i)=>({id:`SEC-${input.documentId}-${i+1}`,category:x.category,matchedPhrase:(extra.match(x.pattern)?.[0]??'instruction-like content'),page:input.page??1,location:'Embedded text layer',visibility:'hidden',confidence:96,detectedAt:'2026-09-29T10:39:12+05:30',documentId:input.documentId}));
  const status=flags.length?'SUSPICIOUS':differencePercent>20?'REVIEW':'SAFE';
  return {documentId:input.documentId,status,scannedAt:'2026-09-29T10:39:12+05:30',embeddedTextCount:input.embeddedText.length,ocrTextCount:input.visibleOcrText.length,differencePercent,flags,explanation:flags.length?'Instruction-like text exists only in the machine-readable layer. Manual review is required; no compliance outcome was changed.':differencePercent>20?'Machine-readable content differs from the rendered document.':'Rendered and machine-readable text are consistent.'};
}

// Trust boundary: callers receive extraction data only. This service cannot mutate scores,
// verification status, rules, audit records, databases, or provider data.
export function validateExtraction<T extends Record<string,unknown>>(value:unknown,allowedFields:(keyof T)[]):Partial<T>{
  if(!value||typeof value!=='object'||Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key])=>allowedFields.includes(key as keyof T))) as Partial<T>;
}
