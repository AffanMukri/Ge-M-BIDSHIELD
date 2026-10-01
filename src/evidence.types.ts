export type EvidenceNodeCategory='RULE'|'DOCUMENT'|'FIELD'|'SOURCE'|'ENTITY'|'FINDING'|'RISK'|'CLARIFICATION'|'DECISION';
export type FreshnessState='LIVE'|'FRESH'|'AGING'|'STALE'|'EXPIRED'|'SOURCE_UNAVAILABLE';
export interface FreshnessPolicy { id:string; label:string; maxAgeHours:number; reverifyBeforeDecision:boolean }
export interface EvidenceFreshness { verifiedAt:string; freshnessPolicy:FreshnessPolicy; freshUntil:string; age:string; freshnessStatus:FreshnessState }
export interface EvidenceNode { id:string; category:EvidenceNodeCategory; title:string; subtitle:string; status:string; evidenceIds:string[]; details:Record<string,string>; freshness?:EvidenceFreshness; criticalPath:boolean; x:number; y:number }
export interface EvidenceEdge { id:string; source:string; target:string; label:string; state:'verified'|'review'|'unavailable'|'neutral' }
export interface EvidenceSnapshot { id:string; timestamp:string; label:string; nodeStates:Record<string,string>; ruleVersion:string }
export interface EntitySignal { label:string; state:'CONSISTENT'|'PARTIAL'|'CONFLICT'|'UNAVAILABLE'; detail:string }
export interface EntityResolution { canonicalName:string; submittedNames:string[]; confidence:number; result:'LIKELY SAME ENTITY'|'MANUAL REVIEW'; signals:EntitySignal[] }
export interface RelationshipSignal { id:string; bidderA:string; bidderB:string; type:string; value:string; confidence:number; severity:'Info'|'Review'; explanation:string; evidenceIds:string[] }
export interface DocumentIntegrityResult { documentId:string; mimeSignature:string; fileSize:string; pageCount:number; sha256:string; createdAt:string; modifiedAt:string; digitalSignature:string; ocrTextConsistency:number; hiddenTextDifference:number; duplicatePages:number; unusualOverlays:number; extractionConfidence:number; nearDuplicateSimilarity?:number; state:'NORMAL'|'REVIEW'|'SUSPICIOUS'|'UNSCANNED'|'UNSUPPORTED' }
export interface RuleTestCase { id:string; input:string; expected:string; actual:string; passed:boolean }
export interface RuleImpact { changedField:string; from:string; to:string; affectedEvaluations:number; compliantResults:number; clarificationCases:number }
export interface ComplianceCoverage { category:string; verified:number; total:number }
export interface DecisionSnapshot { id:string; timestamp:string; title:string; ruleVersion:string; evidence:string[]; findings:string[]; actor:string }
