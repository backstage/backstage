import{r as Rt,b as Ot,d as Et,c as St,a as Ct,e as It,A as Nt}from"./ajv-CRBakkEx.js";import{bu as qt,v as N,bL as Zt,P as Pt,bR as M,cZ as Mt,b6 as Lt,b5 as Vt,b2 as Kt}from"./iframe-DogXi1kP.js";import{p as Dt,s as Ut}from"./ref-C0VTUPuL.js";import{A as Ft}from"./useAnalytics-DWMKXBU9.js";import{c as zt}from"./index-DefuoSXt.js";import{C as Bt,c as Jt,a as Wt,b as Gt}from"./Card-Bc-mJ_QX.js";import{F as De}from"./Flex-Bi-SKTgz.js";import{m as Ht}from"./makeStyles-Bkm64Dpi.js";import{T as Yt}from"./Text-BbRcKCRf.js";function ce(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}function dt(n){if(!ce(n))return!1;const e=new Set;return Object.values(n).every(t=>Ee(t,e))}function Ee(n,e){return n===null||typeof n=="string"||typeof n=="number"||typeof n=="boolean"?!0:typeof n!="object"||e.has(n)?!1:(e.add(n),Array.isArray(n)?n.every(t=>Ee(t,e)):ce(n)?Object.values(n).every(t=>Ee(t,e)):!1)}var he={exports:{}},Ue;function Qt(){return Ue||(Ue=1,(function(n,e){Object.defineProperty(e,"__esModule",{value:!0});const t=Rt(),r=Ot(),a=Ct(),s=It(),i=St(),o=Et(),f="errorMessage",l=new t.Name("emUsed"),T={required:"missingProperty",dependencies:"property",dependentRequired:"property"},U=/\$\{[^}]+\}/,Te=/\$\{([^}]+)\}/g,yt=/^""\s*\+\s*|\s*\+\s*""$/g;function gt(ee){return{keyword:f,schemaType:["string","object"],post:!0,code(F){const{gen:u,data:Le,schema:W,schemaValue:$e,it:G}=F;if(G.createErrors===!1)return;const te=W,H=r.strConcat(o.default.instancePath,G.errorPath);u.if(t._`${o.default.errors} > 0`,()=>{if(typeof te=="object"){const[_,k]=_t(te);k&&bt(k),_&&wt(_),kt(vt(te))}const y=typeof te=="string"?te:te._;y&&xt(y),ee.keepErrors||Tt()});function vt({properties:y,items:_}){const k={};if(y){k.props={};for(const R in y)k.props[R]=[]}if(_){k.items={};for(let R=0;R<_.length;R++)k.items[R]=[]}return k}function _t(y){let _,k;for(const R in y){if(R==="properties"||R==="items")continue;const C=y[R];if(typeof C=="object"){_||(_={});const E=_[R]={};for(const A in C)E[A]=[]}else k||(k={}),k[R]=[]}return[_,k]}function bt(y){const _=u.const("emErrors",t.stringify(y)),k=u.const("templates",je(y,W));u.forOf("err",o.default.vErrors,A=>u.if(Ve(A,_),()=>u.code(t._`${_}[${A}.keyword].push(${A})`).assign(t._`${A}.${l}`,!0)));const{singleError:R}=ee;if(R){const A=u.let("message",t._`""`),j=u.let("paramsErrors",t._`[]`);C(P=>{u.if(A,()=>u.code(t._`${A} += ${typeof R=="string"?R:";"}`)),u.code(t._`${A} += ${E(P)}`),u.assign(j,t._`${j}.concat(${_}[${P}])`)}),i.reportError(F,{message:A,params:t._`{errors: ${j}}`})}else C(A=>i.reportError(F,{message:E(A),params:t._`{errors: ${_}[${A}]}`}));function C(A){u.forIn("key",_,j=>u.if(t._`${_}[${j}].length`,()=>A(j)))}function E(A){return t._`${A} in ${k} ? ${k}[${A}]() : ${$e}[${A}]`}}function wt(y){const _=u.const("emErrors",t.stringify(y)),k=[];for(const j in y)k.push([j,je(y[j],W[j])]);const R=u.const("templates",u.object(...k)),C=u.scopeValue("obj",{ref:T,code:t.stringify(T)}),E=u.let("emPropParams"),A=u.let("emParamsErrors");u.forOf("err",o.default.vErrors,j=>u.if(Ve(j,_),()=>{u.assign(E,t._`${C}[${j}.keyword]`),u.assign(A,t._`${_}[${j}.keyword][${j}.params[${E}]]`),u.if(A,()=>u.code(t._`${A}.push(${j})`).assign(t._`${j}.${l}`,!0))})),u.forIn("key",_,j=>u.forIn("keyProp",t._`${_}[${j}]`,P=>{u.assign(A,t._`${_}[${j}][${P}]`),u.if(t._`${A}.length`,()=>{const Y=u.const("tmpl",t._`${R}[${j}] && ${R}[${j}][${P}]`);i.reportError(F,{message:t._`${Y} ? ${Y}() : ${$e}[${j}][${P}]`,params:t._`{errors: ${A}}`})})}))}function kt(y){const{props:_,items:k}=y;if(!_&&!k)return;const R=t._`typeof ${Le} == "object"`,C=t._`Array.isArray(${Le})`,E=u.let("emErrors");let A,j;const P=u.let("templates");_&&k?(A=u.let("emChildKwd"),u.if(R),u.if(C,()=>{Y(k,W.items),u.assign(A,t.str`items`)},()=>{Y(_,W.properties),u.assign(A,t.str`properties`)}),j=t._`[${A}]`):k?(u.if(C),Y(k,W.items),j=t._`.items`):_&&(u.if(r.and(R,r.not(C))),Y(_,W.properties),j=t._`.properties`),u.forOf("err",o.default.vErrors,q=>At(q,E,Re=>u.code(t._`${E}[${Re}].push(${q})`).assign(t._`${q}.${l}`,!0))),u.forIn("key",E,q=>u.if(t._`${E}[${q}].length`,()=>{i.reportError(F,{message:t._`${q} in ${P} ? ${P}[${q}]() : ${$e}${j}[${q}]`,params:t._`{errors: ${E}[${q}]}`}),u.assign(t._`${o.default.vErrors}[${o.default.errors}-1].instancePath`,t._`${H} + "/" + ${q}.replace(/~/g, "~0").replace(/\\//g, "~1")`)})),u.endIf();function Y(q,Re){u.assign(E,t.stringify(q)),u.assign(P,je(q,Re))}}function xt(y){const _=u.const("emErrs",t._`[]`);u.forOf("err",o.default.vErrors,k=>u.if($t(k),()=>u.code(t._`${_}.push(${k})`).assign(t._`${k}.${l}`,!0))),u.if(t._`${_}.length`,()=>i.reportError(F,{message:Ke(y),params:t._`{errors: ${_}}`}))}function Tt(){const y=u.const("emErrs",t._`[]`);u.forOf("err",o.default.vErrors,_=>u.if(t._`!${_}.${l}`,()=>u.code(t._`${y}.push(${_})`))),u.assign(o.default.vErrors,y).assign(o.default.errors,t._`${y}.length`)}function Ve(y,_){return r.and(t._`${y}.keyword !== ${f}`,t._`!${y}.${l}`,t._`${y}.instancePath === ${H}`,t._`${y}.keyword in ${_}`,t._`${y}.schemaPath.indexOf(${G.errSchemaPath}) === 0`,t._`/^\\/[^\\/]*$/.test(${y}.schemaPath.slice(${G.errSchemaPath.length}))`)}function At(y,_,k){u.if(r.and(t._`${y}.keyword !== ${f}`,t._`!${y}.${l}`,t._`${y}.instancePath.indexOf(${H}) === 0`),()=>{const R=u.scopeValue("pattern",{ref:/^\/([^/]*)(?:\/|$)/,code:t._`new RegExp("^\\\/([^/]*)(?:\\\/|$)")`}),C=u.const("emMatches",t._`${R}.exec(${y}.instancePath.slice(${H}.length))`),E=u.const("emChild",t._`${C} && ${C}[1].replace(/~1/g, "/").replace(/~0/g, "~")`);u.if(t._`${E} !== undefined && ${E} in ${_}`,()=>k(E))})}function $t(y){return r.and(t._`${y}.keyword !== ${f}`,t._`!${y}.${l}`,r.or(t._`${y}.instancePath === ${H}`,r.and(t._`${y}.instancePath.indexOf(${H}) === 0`,t._`${y}.instancePath[${H}.length] === "/"`)),t._`${y}.schemaPath.indexOf(${G.errSchemaPath}) === 0`,t._`${y}.schemaPath[${G.errSchemaPath}.length] === "/"`)}function je(y,_){const k=[];for(const R in y){const C=_[R];U.test(C)&&k.push([R,jt(C)])}return u.object(...k)}function Ke(y){return U.test(y)?new a._Code(a.safeStringify(y).replace(Te,(_,k)=>`" + JSON.stringify(${s.getData(k,G)}) + "`).replace(yt,"")):t.stringify(y)}function jt(y){return t._`function(){return ${Ke(y)}}`}},metaSchema:{anyOf:[{type:"string"},{type:"object",properties:{properties:{$ref:"#/$defs/stringMap"},items:{$ref:"#/$defs/stringList"},required:{$ref:"#/$defs/stringOrMap"},dependencies:{$ref:"#/$defs/stringOrMap"}},additionalProperties:{type:"string"}}],$defs:{stringMap:{type:"object",additionalProperties:{type:"string"}},stringOrMap:{anyOf:[{type:"string"},{$ref:"#/$defs/stringMap"}]},stringList:{type:"array",items:{type:"string"}}}}}}const Ae=(ee,F={})=>{if(!ee.opts.allErrors)throw new Error("ajv-errors: Ajv option allErrors must be true");if(ee.opts.jsPropertySyntax)throw new Error("ajv-errors: ajv option jsPropertySyntax is not supported");return ee.addKeyword(gt(F))};e.default=Ae,n.exports=Ae,n.exports.default=Ae})(he,he.exports)),he.exports}var Xt=Qt();const en=qt(Xt),tn=(()=>{let n;return()=>(n||(n=new Nt({allowUnionTypes:!0,allErrors:!0,validateSchema:!0}),en(n)),n)})();function X(n){if(!ce(n)||typeof n.then=="function")throw new N("Invalid JSON schema: must be an object");const e=tn();try{if(typeof e.validateSchema(n)!="boolean")throw new N("Expected synchronous validation result")}catch(r){throw new N(`Invalid JSON schema: ${r}`)}const t=e.errors?.[0];if(t){let r=t.message;throw Array.isArray(t?.params?.allowedValues)&&(r+=`, expected one of: ${t.params.allowedValues.join(", ")}`),new N(`Invalid JSON schema, error at path ${t.instancePath}: ${r}`)}return!0}var $;(function(n){n.assertEqual=a=>{};function e(a){}n.assertIs=e;function t(a){throw new Error}n.assertNever=t,n.arrayToEnum=a=>{const s={};for(const i of a)s[i]=i;return s},n.getValidEnumValues=a=>{const s=n.objectKeys(a).filter(o=>typeof a[a[o]]!="number"),i={};for(const o of s)i[o]=a[o];return n.objectValues(i)},n.objectValues=a=>n.objectKeys(a).map(function(s){return a[s]}),n.objectKeys=typeof Object.keys=="function"?a=>Object.keys(a):a=>{const s=[];for(const i in a)Object.prototype.hasOwnProperty.call(a,i)&&s.push(i);return s},n.find=(a,s)=>{for(const i of a)if(s(i))return i},n.isInteger=typeof Number.isInteger=="function"?a=>Number.isInteger(a):a=>typeof a=="number"&&Number.isFinite(a)&&Math.floor(a)===a;function r(a,s=" | "){return a.map(i=>typeof i=="string"?`'${i}'`:i).join(s)}n.joinValues=r,n.jsonStringifyReplacer=(a,s)=>typeof s=="bigint"?s.toString():s})($||($={}));var Fe;(function(n){n.mergeShapes=(e,t)=>({...e,...t})})(Fe||(Fe={}));const p=$.arrayToEnum(["string","nan","number","integer","float","boolean","date","bigint","symbol","function","undefined","null","array","object","unknown","promise","void","never","map","set"]),z=n=>{switch(typeof n){case"undefined":return p.undefined;case"string":return p.string;case"number":return Number.isNaN(n)?p.nan:p.number;case"boolean":return p.boolean;case"function":return p.function;case"bigint":return p.bigint;case"symbol":return p.symbol;case"object":return Array.isArray(n)?p.array:n===null?p.null:n.then&&typeof n.then=="function"&&n.catch&&typeof n.catch=="function"?p.promise:typeof Map<"u"&&n instanceof Map?p.map:typeof Set<"u"&&n instanceof Set?p.set:typeof Date<"u"&&n instanceof Date?p.date:p.object;default:return p.unknown}},d=$.arrayToEnum(["invalid_type","invalid_literal","custom","invalid_union","invalid_union_discriminator","invalid_enum_value","unrecognized_keys","invalid_arguments","invalid_return_type","invalid_date","invalid_string","too_small","too_big","invalid_intersection_types","not_multiple_of","not_finite"]);class D extends Error{get errors(){return this.issues}constructor(e){super(),this.issues=[],this.addIssue=r=>{this.issues=[...this.issues,r]},this.addIssues=(r=[])=>{this.issues=[...this.issues,...r]};const t=new.target.prototype;Object.setPrototypeOf?Object.setPrototypeOf(this,t):this.__proto__=t,this.name="ZodError",this.issues=e}format(e){const t=e||function(s){return s.message},r={_errors:[]},a=s=>{for(const i of s.issues)if(i.code==="invalid_union")i.unionErrors.map(a);else if(i.code==="invalid_return_type")a(i.returnTypeError);else if(i.code==="invalid_arguments")a(i.argumentsError);else if(i.path.length===0)r._errors.push(t(i));else{let o=r,f=0;for(;f<i.path.length;){const l=i.path[f];f===i.path.length-1?(o[l]=o[l]||{_errors:[]},o[l]._errors.push(t(i))):o[l]=o[l]||{_errors:[]},o=o[l],f++}}};return a(this),r}static assert(e){if(!(e instanceof D))throw new Error(`Not a ZodError: ${e}`)}toString(){return this.message}get message(){return JSON.stringify(this.issues,$.jsonStringifyReplacer,2)}get isEmpty(){return this.issues.length===0}flatten(e=t=>t.message){const t={},r=[];for(const a of this.issues)if(a.path.length>0){const s=a.path[0];t[s]=t[s]||[],t[s].push(e(a))}else r.push(e(a));return{formErrors:r,fieldErrors:t}}get formErrors(){return this.flatten()}}D.create=n=>new D(n);const Se=(n,e)=>{let t;switch(n.code){case d.invalid_type:n.received===p.undefined?t="Required":t=`Expected ${n.expected}, received ${n.received}`;break;case d.invalid_literal:t=`Invalid literal value, expected ${JSON.stringify(n.expected,$.jsonStringifyReplacer)}`;break;case d.unrecognized_keys:t=`Unrecognized key(s) in object: ${$.joinValues(n.keys,", ")}`;break;case d.invalid_union:t="Invalid input";break;case d.invalid_union_discriminator:t=`Invalid discriminator value. Expected ${$.joinValues(n.options)}`;break;case d.invalid_enum_value:t=`Invalid enum value. Expected ${$.joinValues(n.options)}, received '${n.received}'`;break;case d.invalid_arguments:t="Invalid function arguments";break;case d.invalid_return_type:t="Invalid function return type";break;case d.invalid_date:t="Invalid date";break;case d.invalid_string:typeof n.validation=="object"?"includes"in n.validation?(t=`Invalid input: must include "${n.validation.includes}"`,typeof n.validation.position=="number"&&(t=`${t} at one or more positions greater than or equal to ${n.validation.position}`)):"startsWith"in n.validation?t=`Invalid input: must start with "${n.validation.startsWith}"`:"endsWith"in n.validation?t=`Invalid input: must end with "${n.validation.endsWith}"`:$.assertNever(n.validation):n.validation!=="regex"?t=`Invalid ${n.validation}`:t="Invalid";break;case d.too_small:n.type==="array"?t=`Array must contain ${n.exact?"exactly":n.inclusive?"at least":"more than"} ${n.minimum} element(s)`:n.type==="string"?t=`String must contain ${n.exact?"exactly":n.inclusive?"at least":"over"} ${n.minimum} character(s)`:n.type==="number"?t=`Number must be ${n.exact?"exactly equal to ":n.inclusive?"greater than or equal to ":"greater than "}${n.minimum}`:n.type==="bigint"?t=`Number must be ${n.exact?"exactly equal to ":n.inclusive?"greater than or equal to ":"greater than "}${n.minimum}`:n.type==="date"?t=`Date must be ${n.exact?"exactly equal to ":n.inclusive?"greater than or equal to ":"greater than "}${new Date(Number(n.minimum))}`:t="Invalid input";break;case d.too_big:n.type==="array"?t=`Array must contain ${n.exact?"exactly":n.inclusive?"at most":"less than"} ${n.maximum} element(s)`:n.type==="string"?t=`String must contain ${n.exact?"exactly":n.inclusive?"at most":"under"} ${n.maximum} character(s)`:n.type==="number"?t=`Number must be ${n.exact?"exactly":n.inclusive?"less than or equal to":"less than"} ${n.maximum}`:n.type==="bigint"?t=`BigInt must be ${n.exact?"exactly":n.inclusive?"less than or equal to":"less than"} ${n.maximum}`:n.type==="date"?t=`Date must be ${n.exact?"exactly":n.inclusive?"smaller than or equal to":"smaller than"} ${new Date(Number(n.maximum))}`:t="Invalid input";break;case d.custom:t="Invalid input";break;case d.invalid_intersection_types:t="Intersection results could not be merged";break;case d.not_multiple_of:t=`Number must be a multiple of ${n.multipleOf}`;break;case d.not_finite:t="Number must be finite";break;default:t=e.defaultError,$.assertNever(n)}return{message:t}};let nn=Se;function rn(){return nn}const an=n=>{const{data:e,path:t,errorMaps:r,issueData:a}=n,s=[...t,...a.path||[]],i={...a,path:s};if(a.message!==void 0)return{...a,path:s,message:a.message};let o="";const f=r.filter(l=>!!l).slice().reverse();for(const l of f)o=l(i,{data:e,defaultError:o}).message;return{...a,path:s,message:o}};function c(n,e){const t=rn(),r=an({issueData:e,data:n.data,path:n.path,errorMaps:[n.common.contextualErrorMap,n.schemaErrorMap,t,t===Se?void 0:Se].filter(a=>!!a)});n.common.issues.push(r)}class I{constructor(){this.value="valid"}dirty(){this.value==="valid"&&(this.value="dirty")}abort(){this.value!=="aborted"&&(this.value="aborted")}static mergeArray(e,t){const r=[];for(const a of t){if(a.status==="aborted")return v;a.status==="dirty"&&e.dirty(),r.push(a.value)}return{status:e.value,value:r}}static async mergeObjectAsync(e,t){const r=[];for(const a of t){const s=await a.key,i=await a.value;r.push({key:s,value:i})}return I.mergeObjectSync(e,r)}static mergeObjectSync(e,t){const r={};for(const a of t){const{key:s,value:i}=a;if(s.status==="aborted"||i.status==="aborted")return v;s.status==="dirty"&&e.dirty(),i.status==="dirty"&&e.dirty(),s.value!=="__proto__"&&(typeof i.value<"u"||a.alwaysSet)&&(r[s.value]=i.value)}return{status:e.value,value:r}}}const v=Object.freeze({status:"aborted"}),de=n=>({status:"dirty",value:n}),Z=n=>({status:"valid",value:n}),ze=n=>n.status==="aborted",Be=n=>n.status==="dirty",re=n=>n.status==="valid",me=n=>typeof Promise<"u"&&n instanceof Promise;var m;(function(n){n.errToObj=e=>typeof e=="string"?{message:e}:e||{},n.toString=e=>typeof e=="string"?e:e?.message})(m||(m={}));class V{constructor(e,t,r,a){this._cachedPath=[],this.parent=e,this.data=t,this._path=r,this._key=a}get path(){return this._cachedPath.length||(Array.isArray(this._key)?this._cachedPath.push(...this._path,...this._key):this._cachedPath.push(...this._path,this._key)),this._cachedPath}}const Je=(n,e)=>{if(re(e))return{success:!0,data:e.value};if(!n.common.issues.length)throw new Error("Validation failed but no issues detected.");return{success:!1,get error(){if(this._error)return this._error;const t=new D(n.common.issues);return this._error=t,this._error}}};function b(n){if(!n)return{};const{errorMap:e,invalid_type_error:t,required_error:r,description:a}=n;if(e&&(t||r))throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);return e?{errorMap:e,description:a}:{errorMap:(i,o)=>{const{message:f}=n;return i.code==="invalid_enum_value"?{message:f??o.defaultError}:typeof o.data>"u"?{message:f??r??o.defaultError}:i.code!=="invalid_type"?{message:o.defaultError}:{message:f??t??o.defaultError}},description:a}}class x{get description(){return this._def.description}_getType(e){return z(e.data)}_getOrReturnCtx(e,t){return t||{common:e.parent.common,data:e.data,parsedType:z(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}_processInputParams(e){return{status:new I,ctx:{common:e.parent.common,data:e.data,parsedType:z(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}}_parseSync(e){const t=this._parse(e);if(me(t))throw new Error("Synchronous parse encountered promise.");return t}_parseAsync(e){const t=this._parse(e);return Promise.resolve(t)}parse(e,t){const r=this.safeParse(e,t);if(r.success)return r.data;throw r.error}safeParse(e,t){const r={common:{issues:[],async:t?.async??!1,contextualErrorMap:t?.errorMap},path:t?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:z(e)},a=this._parseSync({data:e,path:r.path,parent:r});return Je(r,a)}"~validate"(e){const t={common:{issues:[],async:!!this["~standard"].async},path:[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:z(e)};if(!this["~standard"].async)try{const r=this._parseSync({data:e,path:[],parent:t});return re(r)?{value:r.value}:{issues:t.common.issues}}catch(r){r?.message?.toLowerCase()?.includes("encountered")&&(this["~standard"].async=!0),t.common={issues:[],async:!0}}return this._parseAsync({data:e,path:[],parent:t}).then(r=>re(r)?{value:r.value}:{issues:t.common.issues})}async parseAsync(e,t){const r=await this.safeParseAsync(e,t);if(r.success)return r.data;throw r.error}async safeParseAsync(e,t){const r={common:{issues:[],contextualErrorMap:t?.errorMap,async:!0},path:t?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:z(e)},a=this._parse({data:e,path:r.path,parent:r}),s=await(me(a)?a:Promise.resolve(a));return Je(r,s)}refine(e,t){const r=a=>typeof t=="string"||typeof t>"u"?{message:t}:typeof t=="function"?t(a):t;return this._refinement((a,s)=>{const i=e(a),o=()=>s.addIssue({code:d.custom,...r(a)});return typeof Promise<"u"&&i instanceof Promise?i.then(f=>f?!0:(o(),!1)):i?!0:(o(),!1)})}refinement(e,t){return this._refinement((r,a)=>e(r)?!0:(a.addIssue(typeof t=="function"?t(r,a):t),!1))}_refinement(e){return new se({schema:this,typeName:g.ZodEffects,effect:{type:"refinement",refinement:e}})}superRefine(e){return this._refinement(e)}constructor(e){this.spa=this.safeParseAsync,this._def=e,this.parse=this.parse.bind(this),this.safeParse=this.safeParse.bind(this),this.parseAsync=this.parseAsync.bind(this),this.safeParseAsync=this.safeParseAsync.bind(this),this.spa=this.spa.bind(this),this.refine=this.refine.bind(this),this.refinement=this.refinement.bind(this),this.superRefine=this.superRefine.bind(this),this.optional=this.optional.bind(this),this.nullable=this.nullable.bind(this),this.nullish=this.nullish.bind(this),this.array=this.array.bind(this),this.promise=this.promise.bind(this),this.or=this.or.bind(this),this.and=this.and.bind(this),this.transform=this.transform.bind(this),this.brand=this.brand.bind(this),this.default=this.default.bind(this),this.catch=this.catch.bind(this),this.describe=this.describe.bind(this),this.pipe=this.pipe.bind(this),this.readonly=this.readonly.bind(this),this.isNullable=this.isNullable.bind(this),this.isOptional=this.isOptional.bind(this),this["~standard"]={version:1,vendor:"zod",validate:t=>this["~validate"](t)}}optional(){return B.create(this,this._def)}nullable(){return ie.create(this,this._def)}nullish(){return this.nullable().optional()}array(){return L.create(this)}promise(){return be.create(this,this._def)}or(e){return ge.create([this,e],this._def)}and(e){return ve.create(this,e,this._def)}transform(e){return new se({...b(this._def),schema:this,typeName:g.ZodEffects,effect:{type:"transform",transform:e}})}default(e){const t=typeof e=="function"?e:()=>e;return new qe({...b(this._def),innerType:this,defaultValue:t,typeName:g.ZodDefault})}brand(){return new Rn({typeName:g.ZodBranded,type:this,...b(this._def)})}catch(e){const t=typeof e=="function"?e:()=>e;return new Ze({...b(this._def),innerType:this,catchValue:t,typeName:g.ZodCatch})}describe(e){const t=this.constructor;return new t({...this._def,description:e})}pipe(e){return Me.create(this,e)}readonly(){return Pe.create(this)}isOptional(){return this.safeParse(void 0).success}isNullable(){return this.safeParse(null).success}}const sn=/^c[^\s-]{8,}$/i,on=/^[0-9a-z]+$/,dn=/^[0-9A-HJKMNP-TV-Z]{26}$/i,cn=/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,ln=/^[a-z0-9_-]{21}$/i,un=/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,pn=/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,hn=/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,fn="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";let Oe;const mn=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,yn=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,gn=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,vn=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,_n=/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,bn=/^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,ct="((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))",wn=new RegExp(`^${ct}$`);function lt(n){let e="[0-5]\\d";n.precision?e=`${e}\\.\\d{${n.precision}}`:n.precision==null&&(e=`${e}(\\.\\d+)?`);const t=n.precision?"+":"?";return`([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`}function kn(n){return new RegExp(`^${lt(n)}$`)}function xn(n){let e=`${ct}T${lt(n)}`;const t=[];return t.push(n.local?"Z?":"Z"),n.offset&&t.push("([+-]\\d{2}:?\\d{2})"),e=`${e}(${t.join("|")})`,new RegExp(`^${e}$`)}function Tn(n,e){return!!((e==="v4"||!e)&&mn.test(n)||(e==="v6"||!e)&&gn.test(n))}function An(n,e){if(!un.test(n))return!1;try{const[t]=n.split(".");if(!t)return!1;const r=t.replace(/-/g,"+").replace(/_/g,"/").padEnd(t.length+(4-t.length%4)%4,"="),a=JSON.parse(atob(r));return!(typeof a!="object"||a===null||"typ"in a&&a?.typ!=="JWT"||!a.alg||e&&a.alg!==e)}catch{return!1}}function $n(n,e){return!!((e==="v4"||!e)&&yn.test(n)||(e==="v6"||!e)&&vn.test(n))}class K extends x{_parse(e){if(this._def.coerce&&(e.data=String(e.data)),this._getType(e)!==p.string){const s=this._getOrReturnCtx(e);return c(s,{code:d.invalid_type,expected:p.string,received:s.parsedType}),v}const r=new I;let a;for(const s of this._def.checks)if(s.kind==="min")e.data.length<s.value&&(a=this._getOrReturnCtx(e,a),c(a,{code:d.too_small,minimum:s.value,type:"string",inclusive:!0,exact:!1,message:s.message}),r.dirty());else if(s.kind==="max")e.data.length>s.value&&(a=this._getOrReturnCtx(e,a),c(a,{code:d.too_big,maximum:s.value,type:"string",inclusive:!0,exact:!1,message:s.message}),r.dirty());else if(s.kind==="length"){const i=e.data.length>s.value,o=e.data.length<s.value;(i||o)&&(a=this._getOrReturnCtx(e,a),i?c(a,{code:d.too_big,maximum:s.value,type:"string",inclusive:!0,exact:!0,message:s.message}):o&&c(a,{code:d.too_small,minimum:s.value,type:"string",inclusive:!0,exact:!0,message:s.message}),r.dirty())}else if(s.kind==="email")hn.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"email",code:d.invalid_string,message:s.message}),r.dirty());else if(s.kind==="emoji")Oe||(Oe=new RegExp(fn,"u")),Oe.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"emoji",code:d.invalid_string,message:s.message}),r.dirty());else if(s.kind==="uuid")cn.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"uuid",code:d.invalid_string,message:s.message}),r.dirty());else if(s.kind==="nanoid")ln.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"nanoid",code:d.invalid_string,message:s.message}),r.dirty());else if(s.kind==="cuid")sn.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"cuid",code:d.invalid_string,message:s.message}),r.dirty());else if(s.kind==="cuid2")on.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"cuid2",code:d.invalid_string,message:s.message}),r.dirty());else if(s.kind==="ulid")dn.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"ulid",code:d.invalid_string,message:s.message}),r.dirty());else if(s.kind==="url")try{new URL(e.data)}catch{a=this._getOrReturnCtx(e,a),c(a,{validation:"url",code:d.invalid_string,message:s.message}),r.dirty()}else s.kind==="regex"?(s.regex.lastIndex=0,s.regex.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"regex",code:d.invalid_string,message:s.message}),r.dirty())):s.kind==="trim"?e.data=e.data.trim():s.kind==="includes"?e.data.includes(s.value,s.position)||(a=this._getOrReturnCtx(e,a),c(a,{code:d.invalid_string,validation:{includes:s.value,position:s.position},message:s.message}),r.dirty()):s.kind==="toLowerCase"?e.data=e.data.toLowerCase():s.kind==="toUpperCase"?e.data=e.data.toUpperCase():s.kind==="startsWith"?e.data.startsWith(s.value)||(a=this._getOrReturnCtx(e,a),c(a,{code:d.invalid_string,validation:{startsWith:s.value},message:s.message}),r.dirty()):s.kind==="endsWith"?e.data.endsWith(s.value)||(a=this._getOrReturnCtx(e,a),c(a,{code:d.invalid_string,validation:{endsWith:s.value},message:s.message}),r.dirty()):s.kind==="datetime"?xn(s).test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{code:d.invalid_string,validation:"datetime",message:s.message}),r.dirty()):s.kind==="date"?wn.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{code:d.invalid_string,validation:"date",message:s.message}),r.dirty()):s.kind==="time"?kn(s).test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{code:d.invalid_string,validation:"time",message:s.message}),r.dirty()):s.kind==="duration"?pn.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"duration",code:d.invalid_string,message:s.message}),r.dirty()):s.kind==="ip"?Tn(e.data,s.version)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"ip",code:d.invalid_string,message:s.message}),r.dirty()):s.kind==="jwt"?An(e.data,s.alg)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"jwt",code:d.invalid_string,message:s.message}),r.dirty()):s.kind==="cidr"?$n(e.data,s.version)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"cidr",code:d.invalid_string,message:s.message}),r.dirty()):s.kind==="base64"?_n.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"base64",code:d.invalid_string,message:s.message}),r.dirty()):s.kind==="base64url"?bn.test(e.data)||(a=this._getOrReturnCtx(e,a),c(a,{validation:"base64url",code:d.invalid_string,message:s.message}),r.dirty()):$.assertNever(s);return{status:r.value,value:e.data}}_regex(e,t,r){return this.refinement(a=>e.test(a),{validation:t,code:d.invalid_string,...m.errToObj(r)})}_addCheck(e){return new K({...this._def,checks:[...this._def.checks,e]})}email(e){return this._addCheck({kind:"email",...m.errToObj(e)})}url(e){return this._addCheck({kind:"url",...m.errToObj(e)})}emoji(e){return this._addCheck({kind:"emoji",...m.errToObj(e)})}uuid(e){return this._addCheck({kind:"uuid",...m.errToObj(e)})}nanoid(e){return this._addCheck({kind:"nanoid",...m.errToObj(e)})}cuid(e){return this._addCheck({kind:"cuid",...m.errToObj(e)})}cuid2(e){return this._addCheck({kind:"cuid2",...m.errToObj(e)})}ulid(e){return this._addCheck({kind:"ulid",...m.errToObj(e)})}base64(e){return this._addCheck({kind:"base64",...m.errToObj(e)})}base64url(e){return this._addCheck({kind:"base64url",...m.errToObj(e)})}jwt(e){return this._addCheck({kind:"jwt",...m.errToObj(e)})}ip(e){return this._addCheck({kind:"ip",...m.errToObj(e)})}cidr(e){return this._addCheck({kind:"cidr",...m.errToObj(e)})}datetime(e){return typeof e=="string"?this._addCheck({kind:"datetime",precision:null,offset:!1,local:!1,message:e}):this._addCheck({kind:"datetime",precision:typeof e?.precision>"u"?null:e?.precision,offset:e?.offset??!1,local:e?.local??!1,...m.errToObj(e?.message)})}date(e){return this._addCheck({kind:"date",message:e})}time(e){return typeof e=="string"?this._addCheck({kind:"time",precision:null,message:e}):this._addCheck({kind:"time",precision:typeof e?.precision>"u"?null:e?.precision,...m.errToObj(e?.message)})}duration(e){return this._addCheck({kind:"duration",...m.errToObj(e)})}regex(e,t){return this._addCheck({kind:"regex",regex:e,...m.errToObj(t)})}includes(e,t){return this._addCheck({kind:"includes",value:e,position:t?.position,...m.errToObj(t?.message)})}startsWith(e,t){return this._addCheck({kind:"startsWith",value:e,...m.errToObj(t)})}endsWith(e,t){return this._addCheck({kind:"endsWith",value:e,...m.errToObj(t)})}min(e,t){return this._addCheck({kind:"min",value:e,...m.errToObj(t)})}max(e,t){return this._addCheck({kind:"max",value:e,...m.errToObj(t)})}length(e,t){return this._addCheck({kind:"length",value:e,...m.errToObj(t)})}nonempty(e){return this.min(1,m.errToObj(e))}trim(){return new K({...this._def,checks:[...this._def.checks,{kind:"trim"}]})}toLowerCase(){return new K({...this._def,checks:[...this._def.checks,{kind:"toLowerCase"}]})}toUpperCase(){return new K({...this._def,checks:[...this._def.checks,{kind:"toUpperCase"}]})}get isDatetime(){return!!this._def.checks.find(e=>e.kind==="datetime")}get isDate(){return!!this._def.checks.find(e=>e.kind==="date")}get isTime(){return!!this._def.checks.find(e=>e.kind==="time")}get isDuration(){return!!this._def.checks.find(e=>e.kind==="duration")}get isEmail(){return!!this._def.checks.find(e=>e.kind==="email")}get isURL(){return!!this._def.checks.find(e=>e.kind==="url")}get isEmoji(){return!!this._def.checks.find(e=>e.kind==="emoji")}get isUUID(){return!!this._def.checks.find(e=>e.kind==="uuid")}get isNANOID(){return!!this._def.checks.find(e=>e.kind==="nanoid")}get isCUID(){return!!this._def.checks.find(e=>e.kind==="cuid")}get isCUID2(){return!!this._def.checks.find(e=>e.kind==="cuid2")}get isULID(){return!!this._def.checks.find(e=>e.kind==="ulid")}get isIP(){return!!this._def.checks.find(e=>e.kind==="ip")}get isCIDR(){return!!this._def.checks.find(e=>e.kind==="cidr")}get isBase64(){return!!this._def.checks.find(e=>e.kind==="base64")}get isBase64url(){return!!this._def.checks.find(e=>e.kind==="base64url")}get minLength(){let e=null;for(const t of this._def.checks)t.kind==="min"&&(e===null||t.value>e)&&(e=t.value);return e}get maxLength(){let e=null;for(const t of this._def.checks)t.kind==="max"&&(e===null||t.value<e)&&(e=t.value);return e}}K.create=n=>new K({checks:[],typeName:g.ZodString,coerce:n?.coerce??!1,...b(n)});function jn(n,e){const t=(n.toString().split(".")[1]||"").length,r=(e.toString().split(".")[1]||"").length,a=t>r?t:r,s=Number.parseInt(n.toFixed(a).replace(".","")),i=Number.parseInt(e.toFixed(a).replace(".",""));return s%i/10**a}class le extends x{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte,this.step=this.multipleOf}_parse(e){if(this._def.coerce&&(e.data=Number(e.data)),this._getType(e)!==p.number){const s=this._getOrReturnCtx(e);return c(s,{code:d.invalid_type,expected:p.number,received:s.parsedType}),v}let r;const a=new I;for(const s of this._def.checks)s.kind==="int"?$.isInteger(e.data)||(r=this._getOrReturnCtx(e,r),c(r,{code:d.invalid_type,expected:"integer",received:"float",message:s.message}),a.dirty()):s.kind==="min"?(s.inclusive?e.data<s.value:e.data<=s.value)&&(r=this._getOrReturnCtx(e,r),c(r,{code:d.too_small,minimum:s.value,type:"number",inclusive:s.inclusive,exact:!1,message:s.message}),a.dirty()):s.kind==="max"?(s.inclusive?e.data>s.value:e.data>=s.value)&&(r=this._getOrReturnCtx(e,r),c(r,{code:d.too_big,maximum:s.value,type:"number",inclusive:s.inclusive,exact:!1,message:s.message}),a.dirty()):s.kind==="multipleOf"?jn(e.data,s.value)!==0&&(r=this._getOrReturnCtx(e,r),c(r,{code:d.not_multiple_of,multipleOf:s.value,message:s.message}),a.dirty()):s.kind==="finite"?Number.isFinite(e.data)||(r=this._getOrReturnCtx(e,r),c(r,{code:d.not_finite,message:s.message}),a.dirty()):$.assertNever(s);return{status:a.value,value:e.data}}gte(e,t){return this.setLimit("min",e,!0,m.toString(t))}gt(e,t){return this.setLimit("min",e,!1,m.toString(t))}lte(e,t){return this.setLimit("max",e,!0,m.toString(t))}lt(e,t){return this.setLimit("max",e,!1,m.toString(t))}setLimit(e,t,r,a){return new le({...this._def,checks:[...this._def.checks,{kind:e,value:t,inclusive:r,message:m.toString(a)}]})}_addCheck(e){return new le({...this._def,checks:[...this._def.checks,e]})}int(e){return this._addCheck({kind:"int",message:m.toString(e)})}positive(e){return this._addCheck({kind:"min",value:0,inclusive:!1,message:m.toString(e)})}negative(e){return this._addCheck({kind:"max",value:0,inclusive:!1,message:m.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:0,inclusive:!0,message:m.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:0,inclusive:!0,message:m.toString(e)})}multipleOf(e,t){return this._addCheck({kind:"multipleOf",value:e,message:m.toString(t)})}finite(e){return this._addCheck({kind:"finite",message:m.toString(e)})}safe(e){return this._addCheck({kind:"min",inclusive:!0,value:Number.MIN_SAFE_INTEGER,message:m.toString(e)})._addCheck({kind:"max",inclusive:!0,value:Number.MAX_SAFE_INTEGER,message:m.toString(e)})}get minValue(){let e=null;for(const t of this._def.checks)t.kind==="min"&&(e===null||t.value>e)&&(e=t.value);return e}get maxValue(){let e=null;for(const t of this._def.checks)t.kind==="max"&&(e===null||t.value<e)&&(e=t.value);return e}get isInt(){return!!this._def.checks.find(e=>e.kind==="int"||e.kind==="multipleOf"&&$.isInteger(e.value))}get isFinite(){let e=null,t=null;for(const r of this._def.checks){if(r.kind==="finite"||r.kind==="int"||r.kind==="multipleOf")return!0;r.kind==="min"?(t===null||r.value>t)&&(t=r.value):r.kind==="max"&&(e===null||r.value<e)&&(e=r.value)}return Number.isFinite(t)&&Number.isFinite(e)}}le.create=n=>new le({checks:[],typeName:g.ZodNumber,coerce:n?.coerce||!1,...b(n)});class ue extends x{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte}_parse(e){if(this._def.coerce)try{e.data=BigInt(e.data)}catch{return this._getInvalidInput(e)}if(this._getType(e)!==p.bigint)return this._getInvalidInput(e);let r;const a=new I;for(const s of this._def.checks)s.kind==="min"?(s.inclusive?e.data<s.value:e.data<=s.value)&&(r=this._getOrReturnCtx(e,r),c(r,{code:d.too_small,type:"bigint",minimum:s.value,inclusive:s.inclusive,message:s.message}),a.dirty()):s.kind==="max"?(s.inclusive?e.data>s.value:e.data>=s.value)&&(r=this._getOrReturnCtx(e,r),c(r,{code:d.too_big,type:"bigint",maximum:s.value,inclusive:s.inclusive,message:s.message}),a.dirty()):s.kind==="multipleOf"?e.data%s.value!==BigInt(0)&&(r=this._getOrReturnCtx(e,r),c(r,{code:d.not_multiple_of,multipleOf:s.value,message:s.message}),a.dirty()):$.assertNever(s);return{status:a.value,value:e.data}}_getInvalidInput(e){const t=this._getOrReturnCtx(e);return c(t,{code:d.invalid_type,expected:p.bigint,received:t.parsedType}),v}gte(e,t){return this.setLimit("min",e,!0,m.toString(t))}gt(e,t){return this.setLimit("min",e,!1,m.toString(t))}lte(e,t){return this.setLimit("max",e,!0,m.toString(t))}lt(e,t){return this.setLimit("max",e,!1,m.toString(t))}setLimit(e,t,r,a){return new ue({...this._def,checks:[...this._def.checks,{kind:e,value:t,inclusive:r,message:m.toString(a)}]})}_addCheck(e){return new ue({...this._def,checks:[...this._def.checks,e]})}positive(e){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!1,message:m.toString(e)})}negative(e){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!1,message:m.toString(e)})}nonpositive(e){return this._addCheck({kind:"max",value:BigInt(0),inclusive:!0,message:m.toString(e)})}nonnegative(e){return this._addCheck({kind:"min",value:BigInt(0),inclusive:!0,message:m.toString(e)})}multipleOf(e,t){return this._addCheck({kind:"multipleOf",value:e,message:m.toString(t)})}get minValue(){let e=null;for(const t of this._def.checks)t.kind==="min"&&(e===null||t.value>e)&&(e=t.value);return e}get maxValue(){let e=null;for(const t of this._def.checks)t.kind==="max"&&(e===null||t.value<e)&&(e=t.value);return e}}ue.create=n=>new ue({checks:[],typeName:g.ZodBigInt,coerce:n?.coerce??!1,...b(n)});class We extends x{_parse(e){if(this._def.coerce&&(e.data=!!e.data),this._getType(e)!==p.boolean){const r=this._getOrReturnCtx(e);return c(r,{code:d.invalid_type,expected:p.boolean,received:r.parsedType}),v}return Z(e.data)}}We.create=n=>new We({typeName:g.ZodBoolean,coerce:n?.coerce||!1,...b(n)});class ye extends x{_parse(e){if(this._def.coerce&&(e.data=new Date(e.data)),this._getType(e)!==p.date){const s=this._getOrReturnCtx(e);return c(s,{code:d.invalid_type,expected:p.date,received:s.parsedType}),v}if(Number.isNaN(e.data.getTime())){const s=this._getOrReturnCtx(e);return c(s,{code:d.invalid_date}),v}const r=new I;let a;for(const s of this._def.checks)s.kind==="min"?e.data.getTime()<s.value&&(a=this._getOrReturnCtx(e,a),c(a,{code:d.too_small,message:s.message,inclusive:!0,exact:!1,minimum:s.value,type:"date"}),r.dirty()):s.kind==="max"?e.data.getTime()>s.value&&(a=this._getOrReturnCtx(e,a),c(a,{code:d.too_big,message:s.message,inclusive:!0,exact:!1,maximum:s.value,type:"date"}),r.dirty()):$.assertNever(s);return{status:r.value,value:new Date(e.data.getTime())}}_addCheck(e){return new ye({...this._def,checks:[...this._def.checks,e]})}min(e,t){return this._addCheck({kind:"min",value:e.getTime(),message:m.toString(t)})}max(e,t){return this._addCheck({kind:"max",value:e.getTime(),message:m.toString(t)})}get minDate(){let e=null;for(const t of this._def.checks)t.kind==="min"&&(e===null||t.value>e)&&(e=t.value);return e!=null?new Date(e):null}get maxDate(){let e=null;for(const t of this._def.checks)t.kind==="max"&&(e===null||t.value<e)&&(e=t.value);return e!=null?new Date(e):null}}ye.create=n=>new ye({checks:[],coerce:n?.coerce||!1,typeName:g.ZodDate,...b(n)});class Ge extends x{_parse(e){if(this._getType(e)!==p.symbol){const r=this._getOrReturnCtx(e);return c(r,{code:d.invalid_type,expected:p.symbol,received:r.parsedType}),v}return Z(e.data)}}Ge.create=n=>new Ge({typeName:g.ZodSymbol,...b(n)});class He extends x{_parse(e){if(this._getType(e)!==p.undefined){const r=this._getOrReturnCtx(e);return c(r,{code:d.invalid_type,expected:p.undefined,received:r.parsedType}),v}return Z(e.data)}}He.create=n=>new He({typeName:g.ZodUndefined,...b(n)});class Ye extends x{_parse(e){if(this._getType(e)!==p.null){const r=this._getOrReturnCtx(e);return c(r,{code:d.invalid_type,expected:p.null,received:r.parsedType}),v}return Z(e.data)}}Ye.create=n=>new Ye({typeName:g.ZodNull,...b(n)});class Qe extends x{constructor(){super(...arguments),this._any=!0}_parse(e){return Z(e.data)}}Qe.create=n=>new Qe({typeName:g.ZodAny,...b(n)});class Ce extends x{constructor(){super(...arguments),this._unknown=!0}_parse(e){return Z(e.data)}}Ce.create=n=>new Ce({typeName:g.ZodUnknown,...b(n)});class J extends x{_parse(e){const t=this._getOrReturnCtx(e);return c(t,{code:d.invalid_type,expected:p.never,received:t.parsedType}),v}}J.create=n=>new J({typeName:g.ZodNever,...b(n)});class Xe extends x{_parse(e){if(this._getType(e)!==p.undefined){const r=this._getOrReturnCtx(e);return c(r,{code:d.invalid_type,expected:p.void,received:r.parsedType}),v}return Z(e.data)}}Xe.create=n=>new Xe({typeName:g.ZodVoid,...b(n)});class L extends x{_parse(e){const{ctx:t,status:r}=this._processInputParams(e),a=this._def;if(t.parsedType!==p.array)return c(t,{code:d.invalid_type,expected:p.array,received:t.parsedType}),v;if(a.exactLength!==null){const i=t.data.length>a.exactLength.value,o=t.data.length<a.exactLength.value;(i||o)&&(c(t,{code:i?d.too_big:d.too_small,minimum:o?a.exactLength.value:void 0,maximum:i?a.exactLength.value:void 0,type:"array",inclusive:!0,exact:!0,message:a.exactLength.message}),r.dirty())}if(a.minLength!==null&&t.data.length<a.minLength.value&&(c(t,{code:d.too_small,minimum:a.minLength.value,type:"array",inclusive:!0,exact:!1,message:a.minLength.message}),r.dirty()),a.maxLength!==null&&t.data.length>a.maxLength.value&&(c(t,{code:d.too_big,maximum:a.maxLength.value,type:"array",inclusive:!0,exact:!1,message:a.maxLength.message}),r.dirty()),t.common.async)return Promise.all([...t.data].map((i,o)=>a.type._parseAsync(new V(t,i,t.path,o)))).then(i=>I.mergeArray(r,i));const s=[...t.data].map((i,o)=>a.type._parseSync(new V(t,i,t.path,o)));return I.mergeArray(r,s)}get element(){return this._def.type}min(e,t){return new L({...this._def,minLength:{value:e,message:m.toString(t)}})}max(e,t){return new L({...this._def,maxLength:{value:e,message:m.toString(t)}})}length(e,t){return new L({...this._def,exactLength:{value:e,message:m.toString(t)}})}nonempty(e){return this.min(1,e)}}L.create=(n,e)=>new L({type:n,minLength:null,maxLength:null,exactLength:null,typeName:g.ZodArray,...b(e)});function ne(n){if(n instanceof O){const e={};for(const t in n.shape){const r=n.shape[t];e[t]=B.create(ne(r))}return new O({...n._def,shape:()=>e})}else return n instanceof L?new L({...n._def,type:ne(n.element)}):n instanceof B?B.create(ne(n.unwrap())):n instanceof ie?ie.create(ne(n.unwrap())):n instanceof Q?Q.create(n.items.map(e=>ne(e))):n}class O extends x{constructor(){super(...arguments),this._cached=null,this.nonstrict=this.passthrough,this.augment=this.extend}_getCached(){if(this._cached!==null)return this._cached;const e=this._def.shape(),t=$.objectKeys(e);return this._cached={shape:e,keys:t},this._cached}_parse(e){if(this._getType(e)!==p.object){const l=this._getOrReturnCtx(e);return c(l,{code:d.invalid_type,expected:p.object,received:l.parsedType}),v}const{status:r,ctx:a}=this._processInputParams(e),{shape:s,keys:i}=this._getCached(),o=[];if(!(this._def.catchall instanceof J&&this._def.unknownKeys==="strip"))for(const l in a.data)i.includes(l)||o.push(l);const f=[];for(const l of i){const T=s[l],U=a.data[l];f.push({key:{status:"valid",value:l},value:T._parse(new V(a,U,a.path,l)),alwaysSet:l in a.data})}if(this._def.catchall instanceof J){const l=this._def.unknownKeys;if(l==="passthrough")for(const T of o)f.push({key:{status:"valid",value:T},value:{status:"valid",value:a.data[T]}});else if(l==="strict")o.length>0&&(c(a,{code:d.unrecognized_keys,keys:o}),r.dirty());else if(l!=="strip")throw new Error("Internal ZodObject error: invalid unknownKeys value.")}else{const l=this._def.catchall;for(const T of o){const U=a.data[T];f.push({key:{status:"valid",value:T},value:l._parse(new V(a,U,a.path,T)),alwaysSet:T in a.data})}}return a.common.async?Promise.resolve().then(async()=>{const l=[];for(const T of f){const U=await T.key,Te=await T.value;l.push({key:U,value:Te,alwaysSet:T.alwaysSet})}return l}).then(l=>I.mergeObjectSync(r,l)):I.mergeObjectSync(r,f)}get shape(){return this._def.shape()}strict(e){return m.errToObj,new O({...this._def,unknownKeys:"strict",...e!==void 0?{errorMap:(t,r)=>{const a=this._def.errorMap?.(t,r).message??r.defaultError;return t.code==="unrecognized_keys"?{message:m.errToObj(e).message??a}:{message:a}}}:{}})}strip(){return new O({...this._def,unknownKeys:"strip"})}passthrough(){return new O({...this._def,unknownKeys:"passthrough"})}extend(e){return new O({...this._def,shape:()=>({...this._def.shape(),...e})})}merge(e){return new O({unknownKeys:e._def.unknownKeys,catchall:e._def.catchall,shape:()=>({...this._def.shape(),...e._def.shape()}),typeName:g.ZodObject})}setKey(e,t){return this.augment({[e]:t})}catchall(e){return new O({...this._def,catchall:e})}pick(e){const t={};for(const r of $.objectKeys(e))e[r]&&this.shape[r]&&(t[r]=this.shape[r]);return new O({...this._def,shape:()=>t})}omit(e){const t={};for(const r of $.objectKeys(this.shape))e[r]||(t[r]=this.shape[r]);return new O({...this._def,shape:()=>t})}deepPartial(){return ne(this)}partial(e){const t={};for(const r of $.objectKeys(this.shape)){const a=this.shape[r];e&&!e[r]?t[r]=a:t[r]=a.optional()}return new O({...this._def,shape:()=>t})}required(e){const t={};for(const r of $.objectKeys(this.shape))if(e&&!e[r])t[r]=this.shape[r];else{let s=this.shape[r];for(;s instanceof B;)s=s._def.innerType;t[r]=s}return new O({...this._def,shape:()=>t})}keyof(){return ut($.objectKeys(this.shape))}}O.create=(n,e)=>new O({shape:()=>n,unknownKeys:"strip",catchall:J.create(),typeName:g.ZodObject,...b(e)});O.strictCreate=(n,e)=>new O({shape:()=>n,unknownKeys:"strict",catchall:J.create(),typeName:g.ZodObject,...b(e)});O.lazycreate=(n,e)=>new O({shape:n,unknownKeys:"strip",catchall:J.create(),typeName:g.ZodObject,...b(e)});class ge extends x{_parse(e){const{ctx:t}=this._processInputParams(e),r=this._def.options;function a(s){for(const o of s)if(o.result.status==="valid")return o.result;for(const o of s)if(o.result.status==="dirty")return t.common.issues.push(...o.ctx.common.issues),o.result;const i=s.map(o=>new D(o.ctx.common.issues));return c(t,{code:d.invalid_union,unionErrors:i}),v}if(t.common.async)return Promise.all(r.map(async s=>{const i={...t,common:{...t.common,issues:[]},parent:null};return{result:await s._parseAsync({data:t.data,path:t.path,parent:i}),ctx:i}})).then(a);{let s;const i=[];for(const f of r){const l={...t,common:{...t.common,issues:[]},parent:null},T=f._parseSync({data:t.data,path:t.path,parent:l});if(T.status==="valid")return T;T.status==="dirty"&&!s&&(s={result:T,ctx:l}),l.common.issues.length&&i.push(l.common.issues)}if(s)return t.common.issues.push(...s.ctx.common.issues),s.result;const o=i.map(f=>new D(f));return c(t,{code:d.invalid_union,unionErrors:o}),v}}get options(){return this._def.options}}ge.create=(n,e)=>new ge({options:n,typeName:g.ZodUnion,...b(e)});function Ie(n,e){const t=z(n),r=z(e);if(n===e)return{valid:!0,data:n};if(t===p.object&&r===p.object){const a=$.objectKeys(e),s=$.objectKeys(n).filter(o=>a.indexOf(o)!==-1),i={...n,...e};for(const o of s){const f=Ie(n[o],e[o]);if(!f.valid)return{valid:!1};i[o]=f.data}return{valid:!0,data:i}}else if(t===p.array&&r===p.array){if(n.length!==e.length)return{valid:!1};const a=[];for(let s=0;s<n.length;s++){const i=n[s],o=e[s],f=Ie(i,o);if(!f.valid)return{valid:!1};a.push(f.data)}return{valid:!0,data:a}}else return t===p.date&&r===p.date&&+n==+e?{valid:!0,data:n}:{valid:!1}}class ve extends x{_parse(e){const{status:t,ctx:r}=this._processInputParams(e),a=(s,i)=>{if(ze(s)||ze(i))return v;const o=Ie(s.value,i.value);return o.valid?((Be(s)||Be(i))&&t.dirty(),{status:t.value,value:o.data}):(c(r,{code:d.invalid_intersection_types}),v)};return r.common.async?Promise.all([this._def.left._parseAsync({data:r.data,path:r.path,parent:r}),this._def.right._parseAsync({data:r.data,path:r.path,parent:r})]).then(([s,i])=>a(s,i)):a(this._def.left._parseSync({data:r.data,path:r.path,parent:r}),this._def.right._parseSync({data:r.data,path:r.path,parent:r}))}}ve.create=(n,e,t)=>new ve({left:n,right:e,typeName:g.ZodIntersection,...b(t)});class Q extends x{_parse(e){const{status:t,ctx:r}=this._processInputParams(e);if(r.parsedType!==p.array)return c(r,{code:d.invalid_type,expected:p.array,received:r.parsedType}),v;if(r.data.length<this._def.items.length)return c(r,{code:d.too_small,minimum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),v;!this._def.rest&&r.data.length>this._def.items.length&&(c(r,{code:d.too_big,maximum:this._def.items.length,inclusive:!0,exact:!1,type:"array"}),t.dirty());const s=[...r.data].map((i,o)=>{const f=this._def.items[o]||this._def.rest;return f?f._parse(new V(r,i,r.path,o)):null}).filter(i=>!!i);return r.common.async?Promise.all(s).then(i=>I.mergeArray(t,i)):I.mergeArray(t,s)}get items(){return this._def.items}rest(e){return new Q({...this._def,rest:e})}}Q.create=(n,e)=>{if(!Array.isArray(n))throw new Error("You must pass an array of schemas to z.tuple([ ... ])");return new Q({items:n,typeName:g.ZodTuple,rest:null,...b(e)})};class _e extends x{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){const{status:t,ctx:r}=this._processInputParams(e);if(r.parsedType!==p.object)return c(r,{code:d.invalid_type,expected:p.object,received:r.parsedType}),v;const a=[],s=this._def.keyType,i=this._def.valueType;for(const o in r.data)a.push({key:s._parse(new V(r,o,r.path,o)),value:i._parse(new V(r,r.data[o],r.path,o)),alwaysSet:o in r.data});return r.common.async?I.mergeObjectAsync(t,a):I.mergeObjectSync(t,a)}get element(){return this._def.valueType}static create(e,t,r){return t instanceof x?new _e({keyType:e,valueType:t,typeName:g.ZodRecord,...b(r)}):new _e({keyType:K.create(),valueType:e,typeName:g.ZodRecord,...b(t)})}}class et extends x{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){const{status:t,ctx:r}=this._processInputParams(e);if(r.parsedType!==p.map)return c(r,{code:d.invalid_type,expected:p.map,received:r.parsedType}),v;const a=this._def.keyType,s=this._def.valueType,i=[...r.data.entries()].map(([o,f],l)=>({key:a._parse(new V(r,o,r.path,[l,"key"])),value:s._parse(new V(r,f,r.path,[l,"value"]))}));if(r.common.async){const o=new Map;return Promise.resolve().then(async()=>{for(const f of i){const l=await f.key,T=await f.value;if(l.status==="aborted"||T.status==="aborted")return v;(l.status==="dirty"||T.status==="dirty")&&t.dirty(),o.set(l.value,T.value)}return{status:t.value,value:o}})}else{const o=new Map;for(const f of i){const l=f.key,T=f.value;if(l.status==="aborted"||T.status==="aborted")return v;(l.status==="dirty"||T.status==="dirty")&&t.dirty(),o.set(l.value,T.value)}return{status:t.value,value:o}}}}et.create=(n,e,t)=>new et({valueType:e,keyType:n,typeName:g.ZodMap,...b(t)});class pe extends x{_parse(e){const{status:t,ctx:r}=this._processInputParams(e);if(r.parsedType!==p.set)return c(r,{code:d.invalid_type,expected:p.set,received:r.parsedType}),v;const a=this._def;a.minSize!==null&&r.data.size<a.minSize.value&&(c(r,{code:d.too_small,minimum:a.minSize.value,type:"set",inclusive:!0,exact:!1,message:a.minSize.message}),t.dirty()),a.maxSize!==null&&r.data.size>a.maxSize.value&&(c(r,{code:d.too_big,maximum:a.maxSize.value,type:"set",inclusive:!0,exact:!1,message:a.maxSize.message}),t.dirty());const s=this._def.valueType;function i(f){const l=new Set;for(const T of f){if(T.status==="aborted")return v;T.status==="dirty"&&t.dirty(),l.add(T.value)}return{status:t.value,value:l}}const o=[...r.data.values()].map((f,l)=>s._parse(new V(r,f,r.path,l)));return r.common.async?Promise.all(o).then(f=>i(f)):i(o)}min(e,t){return new pe({...this._def,minSize:{value:e,message:m.toString(t)}})}max(e,t){return new pe({...this._def,maxSize:{value:e,message:m.toString(t)}})}size(e,t){return this.min(e,t).max(e,t)}nonempty(e){return this.min(1,e)}}pe.create=(n,e)=>new pe({valueType:n,minSize:null,maxSize:null,typeName:g.ZodSet,...b(e)});class tt extends x{get schema(){return this._def.getter()}_parse(e){const{ctx:t}=this._processInputParams(e);return this._def.getter()._parse({data:t.data,path:t.path,parent:t})}}tt.create=(n,e)=>new tt({getter:n,typeName:g.ZodLazy,...b(e)});class Ne extends x{_parse(e){if(e.data!==this._def.value){const t=this._getOrReturnCtx(e);return c(t,{received:t.data,code:d.invalid_literal,expected:this._def.value}),v}return{status:"valid",value:e.data}}get value(){return this._def.value}}Ne.create=(n,e)=>new Ne({value:n,typeName:g.ZodLiteral,...b(e)});function ut(n,e){return new ae({values:n,typeName:g.ZodEnum,...b(e)})}class ae extends x{_parse(e){if(typeof e.data!="string"){const t=this._getOrReturnCtx(e),r=this._def.values;return c(t,{expected:$.joinValues(r),received:t.parsedType,code:d.invalid_type}),v}if(this._cache||(this._cache=new Set(this._def.values)),!this._cache.has(e.data)){const t=this._getOrReturnCtx(e),r=this._def.values;return c(t,{received:t.data,code:d.invalid_enum_value,options:r}),v}return Z(e.data)}get options(){return this._def.values}get enum(){const e={};for(const t of this._def.values)e[t]=t;return e}get Values(){const e={};for(const t of this._def.values)e[t]=t;return e}get Enum(){const e={};for(const t of this._def.values)e[t]=t;return e}extract(e,t=this._def){return ae.create(e,{...this._def,...t})}exclude(e,t=this._def){return ae.create(this.options.filter(r=>!e.includes(r)),{...this._def,...t})}}ae.create=ut;class nt extends x{_parse(e){const t=$.getValidEnumValues(this._def.values),r=this._getOrReturnCtx(e);if(r.parsedType!==p.string&&r.parsedType!==p.number){const a=$.objectValues(t);return c(r,{expected:$.joinValues(a),received:r.parsedType,code:d.invalid_type}),v}if(this._cache||(this._cache=new Set($.getValidEnumValues(this._def.values))),!this._cache.has(e.data)){const a=$.objectValues(t);return c(r,{received:r.data,code:d.invalid_enum_value,options:a}),v}return Z(e.data)}get enum(){return this._def.values}}nt.create=(n,e)=>new nt({values:n,typeName:g.ZodNativeEnum,...b(e)});class be extends x{unwrap(){return this._def.type}_parse(e){const{ctx:t}=this._processInputParams(e);if(t.parsedType!==p.promise&&t.common.async===!1)return c(t,{code:d.invalid_type,expected:p.promise,received:t.parsedType}),v;const r=t.parsedType===p.promise?t.data:Promise.resolve(t.data);return Z(r.then(a=>this._def.type.parseAsync(a,{path:t.path,errorMap:t.common.contextualErrorMap})))}}be.create=(n,e)=>new be({type:n,typeName:g.ZodPromise,...b(e)});class se extends x{innerType(){return this._def.schema}sourceType(){return this._def.schema._def.typeName===g.ZodEffects?this._def.schema.sourceType():this._def.schema}_parse(e){const{status:t,ctx:r}=this._processInputParams(e),a=this._def.effect||null,s={addIssue:i=>{c(r,i),i.fatal?t.abort():t.dirty()},get path(){return r.path}};if(s.addIssue=s.addIssue.bind(s),a.type==="preprocess"){const i=a.transform(r.data,s);if(r.common.async)return Promise.resolve(i).then(async o=>{if(t.value==="aborted")return v;const f=await this._def.schema._parseAsync({data:o,path:r.path,parent:r});return f.status==="aborted"?v:f.status==="dirty"||t.value==="dirty"?de(f.value):f});{if(t.value==="aborted")return v;const o=this._def.schema._parseSync({data:i,path:r.path,parent:r});return o.status==="aborted"?v:o.status==="dirty"||t.value==="dirty"?de(o.value):o}}if(a.type==="refinement"){const i=o=>{const f=a.refinement(o,s);if(r.common.async)return Promise.resolve(f);if(f instanceof Promise)throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");return o};if(r.common.async===!1){const o=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});return o.status==="aborted"?v:(o.status==="dirty"&&t.dirty(),i(o.value),{status:t.value,value:o.value})}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(o=>o.status==="aborted"?v:(o.status==="dirty"&&t.dirty(),i(o.value).then(()=>({status:t.value,value:o.value}))))}if(a.type==="transform")if(r.common.async===!1){const i=this._def.schema._parseSync({data:r.data,path:r.path,parent:r});if(!re(i))return v;const o=a.transform(i.value,s);if(o instanceof Promise)throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");return{status:t.value,value:o}}else return this._def.schema._parseAsync({data:r.data,path:r.path,parent:r}).then(i=>re(i)?Promise.resolve(a.transform(i.value,s)).then(o=>({status:t.value,value:o})):v);$.assertNever(a)}}se.create=(n,e,t)=>new se({schema:n,typeName:g.ZodEffects,effect:e,...b(t)});se.createWithPreprocess=(n,e,t)=>new se({schema:e,effect:{type:"preprocess",transform:n},typeName:g.ZodEffects,...b(t)});class B extends x{_parse(e){return this._getType(e)===p.undefined?Z(void 0):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}}B.create=(n,e)=>new B({innerType:n,typeName:g.ZodOptional,...b(e)});class ie extends x{_parse(e){return this._getType(e)===p.null?Z(null):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}}ie.create=(n,e)=>new ie({innerType:n,typeName:g.ZodNullable,...b(e)});class qe extends x{_parse(e){const{ctx:t}=this._processInputParams(e);let r=t.data;return t.parsedType===p.undefined&&(r=this._def.defaultValue()),this._def.innerType._parse({data:r,path:t.path,parent:t})}removeDefault(){return this._def.innerType}}qe.create=(n,e)=>new qe({innerType:n,typeName:g.ZodDefault,defaultValue:typeof e.default=="function"?e.default:()=>e.default,...b(e)});class Ze extends x{_parse(e){const{ctx:t}=this._processInputParams(e),r={...t,common:{...t.common,issues:[]}},a=this._def.innerType._parse({data:r.data,path:r.path,parent:{...r}});return me(a)?a.then(s=>({status:"valid",value:s.status==="valid"?s.value:this._def.catchValue({get error(){return new D(r.common.issues)},input:r.data})})):{status:"valid",value:a.status==="valid"?a.value:this._def.catchValue({get error(){return new D(r.common.issues)},input:r.data})}}removeCatch(){return this._def.innerType}}Ze.create=(n,e)=>new Ze({innerType:n,typeName:g.ZodCatch,catchValue:typeof e.catch=="function"?e.catch:()=>e.catch,...b(e)});class rt extends x{_parse(e){if(this._getType(e)!==p.nan){const r=this._getOrReturnCtx(e);return c(r,{code:d.invalid_type,expected:p.nan,received:r.parsedType}),v}return{status:"valid",value:e.data}}}rt.create=n=>new rt({typeName:g.ZodNaN,...b(n)});class Rn extends x{_parse(e){const{ctx:t}=this._processInputParams(e),r=t.data;return this._def.type._parse({data:r,path:t.path,parent:t})}unwrap(){return this._def.type}}class Me extends x{_parse(e){const{status:t,ctx:r}=this._processInputParams(e);if(r.common.async)return(async()=>{const s=await this._def.in._parseAsync({data:r.data,path:r.path,parent:r});return s.status==="aborted"?v:s.status==="dirty"?(t.dirty(),de(s.value)):this._def.out._parseAsync({data:s.value,path:r.path,parent:r})})();{const a=this._def.in._parseSync({data:r.data,path:r.path,parent:r});return a.status==="aborted"?v:a.status==="dirty"?(t.dirty(),{status:"dirty",value:a.value}):this._def.out._parseSync({data:a.value,path:r.path,parent:r})}}static create(e,t){return new Me({in:e,out:t,typeName:g.ZodPipeline})}}class Pe extends x{_parse(e){const t=this._def.innerType._parse(e),r=a=>(re(a)&&(a.value=Object.freeze(a.value)),a);return me(t)?t.then(a=>r(a)):r(t)}unwrap(){return this._def.innerType}}Pe.create=(n,e)=>new Pe({innerType:n,typeName:g.ZodReadonly,...b(e)});var g;(function(n){n.ZodString="ZodString",n.ZodNumber="ZodNumber",n.ZodNaN="ZodNaN",n.ZodBigInt="ZodBigInt",n.ZodBoolean="ZodBoolean",n.ZodDate="ZodDate",n.ZodSymbol="ZodSymbol",n.ZodUndefined="ZodUndefined",n.ZodNull="ZodNull",n.ZodAny="ZodAny",n.ZodUnknown="ZodUnknown",n.ZodNever="ZodNever",n.ZodVoid="ZodVoid",n.ZodArray="ZodArray",n.ZodObject="ZodObject",n.ZodUnion="ZodUnion",n.ZodDiscriminatedUnion="ZodDiscriminatedUnion",n.ZodIntersection="ZodIntersection",n.ZodTuple="ZodTuple",n.ZodRecord="ZodRecord",n.ZodMap="ZodMap",n.ZodSet="ZodSet",n.ZodFunction="ZodFunction",n.ZodLazy="ZodLazy",n.ZodLiteral="ZodLiteral",n.ZodEnum="ZodEnum",n.ZodEffects="ZodEffects",n.ZodNativeEnum="ZodNativeEnum",n.ZodOptional="ZodOptional",n.ZodNullable="ZodNullable",n.ZodDefault="ZodDefault",n.ZodCatch="ZodCatch",n.ZodPromise="ZodPromise",n.ZodBranded="ZodBranded",n.ZodPipeline="ZodPipeline",n.ZodReadonly="ZodReadonly"})(g||(g={}));const h=K.create,we=Ce.create;J.create;const xe=L.create,fe=O.create,w=O.strictCreate;ge.create;ve.create;const On=Q.create,ke=_e.create,S=Ne.create,pt=ae.create;be.create;B.create;ie.create;ke(h(),we()).refine(n=>dt(n),{message:"Invalid JSON schema"});const oe=ke(h(),we()).superRefine((n,e)=>{try{return X(n)}catch(t){return e.addIssue({code:d.custom,message:Zt(t)?t.message:"Invalid JSON schema"}),!1}}),En=w({op:S("declareAnnotation.v1"),name:h(),properties:w({title:h().optional(),description:h(),schema:w({jsonSchema:oe}).optional()})});function Sn(n){return En.parse({...n,op:"declareAnnotation.v1"})}function Cn(n){if(n.schema?.jsonSchema&&(X(n.schema.jsonSchema),n.schema.jsonSchema.type!=="string"))throw new N(`Annotation "${n.name}" schema must have "type": "string" at the root, only string values are supported`);return[Sn({name:n.name,properties:{title:n.title,description:n.description,schema:n.schema}})]}const In=w({op:S("declareKind.v1"),kind:h(),group:h(),properties:w({singular:h(),plural:h(),description:h()})});function Nn(n){return In.parse({...n,op:"declareKind.v1"})}const qn=fe({allOf:On([fe({$ref:S("Entity")}),fe({type:S("object"),properties:fe({apiVersion:ke(h(),we()).optional(),kind:ke(h(),we()).optional()}).passthrough()}).passthrough()])}).passthrough();function ht(n){const e=qn.safeParse(n);if(!e.success)return n;const{allOf:t,...r}=e.data,{type:a,properties:s,...i}=t[1],{apiVersion:o,kind:f,...l}=s;return{...r,type:a,...i,properties:l}}const Zn=["kind","apiVersion","metadata","$ref"],at=["allOf","oneOf","anyOf","if","else","then","not","$ref"];function Pn(n){if(!dt(n))throw new N("Schema must be an object");for(const t of at)if(t in n)throw new N(`Schema must not use "${t}" keyword in the root`);const e=n.properties;if(!ce(e))throw new N('Schema must have a "properties" field that is an object');for(const t of Zn)if(t in e)throw new N(`Schema must not try to declare the reserved root field "${t}"`);for(const[t,r]of Object.entries(e)){if(!ce(r))throw new N(`Schema for root field "${t}" must be an object`);for(const a of at)if(a in r)throw new N(`Schema for root field "${t}" must not use "${a}" keyword`)}return!0}const Mn=w({selector:w({path:h()}),relation:h(),defaultKind:h().optional(),defaultNamespace:pt(["default","inherit"]).optional(),allowedKinds:xe(h()).optional()}),Ln=w({op:S("declareKindVersion.v1"),kind:h(),name:h(),specType:h().optional(),properties:w({description:h().optional(),relationFields:xe(Mn).optional(),schema:w({jsonSchema:oe})})});function Vn(n){return Ln.parse({...n,op:"declareKindVersion.v1"})}function ft(n){const e=[];for(const t of n.versions){const r=ht(t.schema.jsonSchema);X(r),Pn(r);const a=Array.isArray(t.name)?t.name:[t.name];for(const s of a){const i=t.specType?[t.specType].flat():[void 0];for(const o of i)e.push(Vn({kind:n.kind,name:s,specType:o,properties:{description:t.description,relationFields:t.relationFields,schema:{jsonSchema:r}}}))}}return e}function Kn(n){const e=[];return e.push(Nn({kind:n.names.kind,group:n.group,properties:{singular:n.names.singular,plural:n.names.plural,description:n.description}})),e.push(...ft({kind:n.names.kind,versions:n.versions??[]})),e}const Dn=w({op:S("declareLabel.v1"),name:h(),properties:w({title:h().optional(),description:h(),schema:w({jsonSchema:oe}).optional()})});function Un(n){return Dn.parse({...n,op:"declareLabel.v1"})}function Fn(n){if(n.schema?.jsonSchema&&(X(n.schema.jsonSchema),n.schema.jsonSchema.type!=="string"))throw new N(`Label "${n.name}" schema must have "type": "string" at the root, only string values are supported`);return[Un({name:n.name,properties:{title:n.title,description:n.description,schema:n.schema}})]}const zn=w({op:S("declareRelation.v1"),fromKind:h(),type:h(),toKind:h(),properties:w({reverseType:h(),title:h(),description:h()})});function st(n){return zn.parse({...n,op:"declareRelation.v1"})}function Bn(n){const e=[];for(const t of[n.fromKind].flat())for(const r of[n.toKind].flat())e.push(st({fromKind:t,type:n.forward.type,toKind:r,properties:{reverseType:n.reverse.type,title:n.forward.title,description:n.description}})),e.push(st({fromKind:r,type:n.reverse.type,toKind:t,properties:{reverseType:n.forward.type,title:n.reverse.title,description:n.description}}));return e}const Jn=w({op:S("removeAnnotation.v1"),name:h()});function Wn(n){return Jn.parse({...n,op:"removeAnnotation.v1"})}function Gn(n){return[Wn({name:n.name})]}const Hn=w({op:S("removeKind.v1"),kind:h()});function Yn(n){return Hn.parse({...n,op:"removeKind.v1"})}function Qn(n){return[Yn({kind:n.kind})]}const Xn=w({op:S("removeLabel.v1"),name:h()});function er(n){return Xn.parse({...n,op:"removeLabel.v1"})}function tr(n){return[er({name:n.name})]}const nr=w({op:S("removeTag.v1"),name:h()});function rr(n){return nr.parse({...n,op:"removeTag.v1"})}function ar(n){return[rr({name:n.name})]}const sr=w({op:S("declareTag.v1"),name:h(),properties:w({title:h().optional(),description:h()})});function ir(n){return sr.parse({...n,op:"declareTag.v1"})}function or(n){return[ir({name:n.name,properties:{title:n.title,description:n.description}})]}const dr=w({op:S("updateAnnotation.v1"),name:h(),properties:w({title:h().optional(),description:h().optional(),schema:w({jsonSchema:oe}).optional()})});function cr(n){return dr.parse({...n,op:"updateAnnotation.v1"})}function lr(n){if(n.schema&&(X(n.schema.jsonSchema),n.schema.jsonSchema.type!=="string"))throw new N(`Annotation "${n.name}" schema must have "type": "string" at the root, only string values are supported`);return[cr({name:n.name,properties:{title:n.title,description:n.description,schema:n.schema}})]}const ur=w({op:S("updateKind.v1"),kind:h(),properties:w({singular:h().optional(),plural:h().optional(),description:h().optional()})});function pr(n){return ur.parse({...n,op:"updateKind.v1"})}const hr=w({selector:w({path:h()}),relation:h(),defaultKind:h().optional(),defaultNamespace:pt(["default","inherit"]).optional(),allowedKinds:xe(h()).optional()}),fr=w({op:S("updateKindVersion.v1"),kind:h(),name:h(),specType:h().optional(),properties:w({description:h().optional(),relationFields:xe(hr).optional(),schema:w({jsonSchema:oe}).optional()})});function mr(n){return fr.parse({...n,op:"updateKindVersion.v1"})}function yr(n){const e=[];(n.names.singular||n.names.plural||n.description)&&e.push(pr({kind:n.names.kind,properties:{singular:n.names.singular,plural:n.names.plural,description:n.description}}));for(const t of n.versions??[]){const r=t.schema?ht(t.schema.jsonSchema):void 0;r&&X(r);const a=Array.isArray(t.name)?t.name:[t.name];for(const s of a){const i=t.specType?.length?[t.specType].flat():[void 0];for(const o of i)e.push(mr({kind:n.names.kind,name:s,specType:o,properties:{description:t.description,relationFields:t.relationFields,schema:r?{jsonSchema:r}:void 0}}))}}return e}const gr=w({op:S("updateLabel.v1"),name:h(),properties:w({title:h().optional(),description:h().optional(),schema:w({jsonSchema:oe}).optional()})});function vr(n){return gr.parse({...n,op:"updateLabel.v1"})}function _r(n){if(n.schema&&(X(n.schema.jsonSchema),n.schema.jsonSchema.type!=="string"))throw new N(`Label "${n.name}" schema must have "type": "string" at the root, only string values are supported`);return[vr({name:n.name,properties:{title:n.title,description:n.description,schema:n.schema}})]}const br=w({op:S("updateRelation.v1"),fromKind:h(),type:h(),toKind:h(),properties:w({reverseType:h().optional(),title:h().optional(),description:h().optional()})});function it(n){return br.parse({...n,op:"updateRelation.v1"})}function wr(n){const e=[];for(const t of[n.fromKind].flat())for(const r of[n.toKind].flat())e.push(it({fromKind:t,type:n.forward.type,toKind:r,properties:{reverseType:n.reverse.type,title:n.forward.title,description:n.description}})),n.reverse.type&&e.push(it({fromKind:r,type:n.reverse.type,toKind:t,properties:{reverseType:n.forward.type,title:n.reverse.title,description:n.description}}));return e}const kr=w({op:S("updateTag.v1"),name:h(),properties:w({title:h().optional(),description:h().optional()})});function xr(n){return kr.parse({...n,op:"updateTag.v1"})}function Tr(n){return[xr({name:n.name,properties:{title:n.title,description:n.description}})]}const ot=Pt.create({type:"@backstage/CatalogModelLayer",versions:["v1"]});class Ar{#t;#e;constructor(e){this.#t=e.layerId,this.#e=[]}addKind(e){const t=Kn(e);this.#e.push(...t)}addKindVersion(e){const t=ft(e);this.#e.push(...t)}updateKind(e){const t=yr(e);this.#e.push(...t)}removeKind(e){const t=Qn(e);this.#e.push(...t)}addRelationPair(e){const t=Bn(e);this.#e.push(...t)}updateRelationPair(e){const t=wr(e);this.#e.push(...t)}addAnnotation(e){const t=Cn(e);this.#e.push(...t)}updateAnnotation(e){const t=lr(e);this.#e.push(...t)}removeAnnotation(e){const t=Gn(e);this.#e.push(...t)}addLabel(e){const t=Fn(e);this.#e.push(...t)}updateLabel(e){const t=_r(e);this.#e.push(...t)}removeLabel(e){const t=tr(e);this.#e.push(...t)}addTag(e){const t=or(e);this.#e.push(...t)}updateTag(e){const t=Tr(e);this.#e.push(...t)}removeTag(e){const t=ar(e);this.#e.push(...t)}import(e){const t=ot.toInternal(e);this.#e.push(...t.ops)}build(){return ot.createInstance("v1",{layerId:this.#t,ops:this.#e.slice()})}}function $r(n){return new Ar(n)}function jr(n){const e=$r({layerId:n.layerId});return n.builder(e),e.build()}const Kr="parentOf",Dr="memberOf";jr({layerId:"catalog.backstage.io/well-known-relations",builder:n=>{n.addRelationPair({fromKind:["API","Component","Domain","Group","Location","Resource","System","User"],toKind:["Group","User"],description:"An ownership relation where the owner is usually an organizational entity (user or group), and the other entity can be anything.",forward:{type:"ownedBy",title:"owned by"},reverse:{type:"ownerOf",title:"owner of"}}),n.addRelationPair({fromKind:"Component",toKind:"API",description:"A relation from a component to an API it provides for consumption by others.",forward:{type:"providesApi",title:"provides API"},reverse:{type:"apiProvidedBy",title:"API provided by"}}),n.addRelationPair({fromKind:"Component",toKind:"API",description:"A relation from a component to an API it consumes.",forward:{type:"consumesApi",title:"consumes API"},reverse:{type:"apiConsumedBy",title:"API consumed by"}}),n.addRelationPair({fromKind:["Component","Resource"],toKind:["Component","Resource"],description:"A dependency relation expressing that an entity needs another entity to function.",forward:{type:"dependsOn",title:"depends on"},reverse:{type:"dependencyOf",title:"dependency of"}}),n.addRelationPair({fromKind:"Group",toKind:"Group",description:"A parent/child relation to build up a tree, used for example to describe the organizational structure between groups.",forward:{type:"parentOf",title:"parent of"},reverse:{type:"childOf",title:"child of"}}),n.addRelationPair({fromKind:"User",toKind:"Group",description:"A membership relation, typically for users in a group.",forward:{type:"memberOf",title:"member of"},reverse:{type:"hasMember",title:"has member"}}),n.addRelationPair({fromKind:["Component","API","Resource"],toKind:["Component","System"],description:"A part/whole relation where a component, API, or resource belongs to a system or a component is a subcomponent of another.",forward:{type:"partOf",title:"part of"},reverse:{type:"hasPart",title:"has part"}}),n.addRelationPair({fromKind:"System",toKind:"Domain",description:"A part/whole relation where a system belongs to a domain.",forward:{type:"partOf",title:"part of"},reverse:{type:"hasPart",title:"has part"}}),n.addRelationPair({fromKind:"Domain",toKind:"Domain",description:"A part/whole relation where a domain is a subdomain of another domain.",forward:{type:"partOf",title:"part of"},reverse:{type:"hasPart",title:"has part"}})}});function Ur(n,e,t){let r=n?.relations?.filter(a=>a.type===e).map(a=>Dt(a.targetRef))||[];return t?.kind&&(r=r.filter(a=>a.kind.toLocaleLowerCase("en-US")===t.kind.toLocaleLowerCase("en-US"))),r}const Rr=Vt("entity-context"),mt=n=>{const{children:e,entity:t,loading:r,error:a,refresh:s}=n,i={entity:t,loading:r,error:a,refresh:s};return M.jsx(Rr.Provider,{value:Lt({1:i}),children:M.jsx(Ft,{attributes:{...t?{entityRef:Ut(t)}:void 0},children:e})})},Or=n=>M.jsx(mt,{entity:n.entity,loading:!n.entity,error:void 0,refresh:void 0,children:n.children});function Fr(){const n=Mt("entity-context");if(!n)throw new Error("Entity context is not available");const e=n.atVersion(1);if(!e)throw new Error("EntityContext v1 not available");if(!e.entity)throw new Error("useEntity hook is being called outside of an EntityLayout where the entity has not been loaded. If this is intentional, please use useAsyncEntity instead.");return{entity:e.entity}}mt.__docgenInfo={description:"Provides a loaded entity to be picked up by the `useEntity` hook.\n\n@public",methods:[],displayName:"AsyncEntityProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},entity:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  /**
   * The version of specification format for this particular entity that
   * this is written against.
   */
  apiVersion: string;

  /**
   * The high level entity type being described.
   */
  kind: string;

  /**
   * Metadata related to the entity.
   */
  metadata: EntityMeta;

  /**
   * The specification data describing the entity itself.
   */
  spec?: JsonObject;

  /**
   * The relations that this entity has with other entities.
   */
  relations?: EntityRelation[];
}`,signature:{properties:[{key:"apiVersion",value:{name:"string",required:!0},description:`The version of specification format for this particular entity that
this is written against.`},{key:"kind",value:{name:"string",required:!0},description:"The high level entity type being described."},{key:"metadata",value:{name:"intersection",raw:`JsonObject & {
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair. This value is part of the technical
   * identifier of the entity, and as such it will appear in URLs, database
   * tables, entity references, and similar. It is subject to restrictions
   * regarding what characters are allowed.
   *
   * If you want to use a different, more human readable string with fewer
   * restrictions on it in user interfaces, see the \`title\` field below.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A display name of the entity, to be presented in user interfaces instead
   * of the \`name\` property above, when available.
   *
   * This field is sometimes useful when the \`name\` is cumbersome or ends up
   * being perceived as overly technical. The title generally does not have
   * as stringent format requirements on it, so it may contain special
   * characters and be more explanatory. Do keep it very short though, and
   * avoid situations where a title can be confused with the name of another
   * entity, or where two entities share a title.
   *
   * Note that this is only for display purposes, and may be ignored by some
   * parts of the code. Entity references still always make use of the \`name\`
   * property, not the title.
   */
  title?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
}`,elements:[{name:"signature",type:"object",raw:"{ [key in string]?: JsonValue }",signature:{properties:[{key:{name:"string",required:!1},value:{name:"union",raw:"JsonObject | JsonArray | JsonPrimitive",elements:[{name:"JsonObject"},{name:"JsonArray"},{name:"union",raw:"number | string | boolean | null",elements:[{name:"number"},{name:"string"},{name:"boolean"},{name:"null"}]}]}}]},required:!1},{name:"signature",type:"object",raw:`{
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair. This value is part of the technical
   * identifier of the entity, and as such it will appear in URLs, database
   * tables, entity references, and similar. It is subject to restrictions
   * regarding what characters are allowed.
   *
   * If you want to use a different, more human readable string with fewer
   * restrictions on it in user interfaces, see the \`title\` field below.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A display name of the entity, to be presented in user interfaces instead
   * of the \`name\` property above, when available.
   *
   * This field is sometimes useful when the \`name\` is cumbersome or ends up
   * being perceived as overly technical. The title generally does not have
   * as stringent format requirements on it, so it may contain special
   * characters and be more explanatory. Do keep it very short though, and
   * avoid situations where a title can be confused with the name of another
   * entity, or where two entities share a title.
   *
   * Note that this is only for display purposes, and may be ignored by some
   * parts of the code. Entity references still always make use of the \`name\`
   * property, not the title.
   */
  title?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
}`,signature:{properties:[{key:"uid",value:{name:"string",required:!1},description:`A globally unique ID for the entity.

This field can not be set by the user at creation time, and the server
will reject an attempt to do so. The field will be populated in read
operations. The field can (optionally) be specified when performing
update or delete operations, but the server is free to reject requests
that do so in such a way that it breaks semantics.`},{key:"etag",value:{name:"string",required:!1},description:`An opaque string that changes for each update operation to any part of
the entity, including metadata.

This field can not be set by the user at creation time, and the server
will reject an attempt to do so. The field will be populated in read
operations. The field can (optionally) be specified when performing
update or delete operations, and the server will then reject the
operation if it does not match the current stored value.`},{key:"name",value:{name:"string",required:!0},description:`The name of the entity.

Must be unique within the catalog at any given point in time, for any
given namespace + kind pair. This value is part of the technical
identifier of the entity, and as such it will appear in URLs, database
tables, entity references, and similar. It is subject to restrictions
regarding what characters are allowed.

If you want to use a different, more human readable string with fewer
restrictions on it in user interfaces, see the \`title\` field below.`},{key:"namespace",value:{name:"string",required:!1},description:"The namespace that the entity belongs to."},{key:"title",value:{name:"string",required:!1},description:`A display name of the entity, to be presented in user interfaces instead
of the \`name\` property above, when available.

This field is sometimes useful when the \`name\` is cumbersome or ends up
being perceived as overly technical. The title generally does not have
as stringent format requirements on it, so it may contain special
characters and be more explanatory. Do keep it very short though, and
avoid situations where a title can be confused with the name of another
entity, or where two entities share a title.

Note that this is only for display purposes, and may be ignored by some
parts of the code. Entity references still always make use of the \`name\`
property, not the title.`},{key:"description",value:{name:"string",required:!1},description:`A short (typically relatively few words, on one line) description of the
entity.`},{key:"labels",value:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>",required:!1},description:"Key/value pairs of identifying information attached to the entity."},{key:"annotations",value:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>",required:!1},description:`Key/value pairs of non-identifying auxiliary information attached to the
entity.`},{key:"tags",value:{name:"Array",elements:[{name:"string"}],raw:"string[]",required:!1},description:`A list of single-valued strings, to for example classify catalog entities in
various ways.`},{key:"links",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  /**
   * The url to the external site, document, etc.
   */
  url: string;

  /**
   * An optional descriptive title for the link.
   */
  title?: string;

  /**
   * An optional semantic key that represents a visual icon.
   */
  icon?: string;

  /**
   * An optional value to categorize links into specific groups
   */
  type?: string;
}`,signature:{properties:[{key:"url",value:{name:"string",required:!0},description:"The url to the external site, document, etc."},{key:"title",value:{name:"string",required:!1},description:"An optional descriptive title for the link."},{key:"icon",value:{name:"string",required:!1},description:"An optional semantic key that represents a visual icon."},{key:"type",value:{name:"string",required:!1},description:"An optional value to categorize links into specific groups"}]}}],raw:"EntityLink[]",required:!1},description:"A list of external hyperlinks related to the entity."}]}}],required:!0},description:"Metadata related to the entity."},{key:"spec",value:{name:"signature",type:"object",raw:"{ [key in string]?: JsonValue }",signature:{properties:[{key:{name:"string",required:!1},value:{name:"union",raw:"JsonObject | JsonArray | JsonPrimitive",elements:[{name:"JsonObject"},{name:"JsonArray"},{name:"union",raw:"number | string | boolean | null",elements:[{name:"number"},{name:"string"},{name:"boolean"},{name:"null"}]}]}}]},required:!1},description:"The specification data describing the entity itself."},{key:"relations",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  /**
   * The type of the relation.
   */
  type: string;

  /**
   * The entity ref of the target of this relation.
   */
  targetRef: string;
}`,signature:{properties:[{key:"type",value:{name:"string",required:!0},description:"The type of the relation."},{key:"targetRef",value:{name:"string",required:!0},description:"The entity ref of the target of this relation."}]}}],raw:"EntityRelation[]",required:!1},description:"The relations that this entity has with other entities."}]}},description:""},loading:{required:!0,tsType:{name:"boolean"},description:""},error:{required:!1,tsType:{name:"Error"},description:""},refresh:{required:!1,tsType:{name:"VoidFunction"},description:""}}};Or.__docgenInfo={description:"Provides an entity to be picked up by the `useEntity` hook.\n\n@public",methods:[],displayName:"EntityProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},entity:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  /**
   * The version of specification format for this particular entity that
   * this is written against.
   */
  apiVersion: string;

  /**
   * The high level entity type being described.
   */
  kind: string;

  /**
   * Metadata related to the entity.
   */
  metadata: EntityMeta;

  /**
   * The specification data describing the entity itself.
   */
  spec?: JsonObject;

  /**
   * The relations that this entity has with other entities.
   */
  relations?: EntityRelation[];
}`,signature:{properties:[{key:"apiVersion",value:{name:"string",required:!0},description:`The version of specification format for this particular entity that
this is written against.`},{key:"kind",value:{name:"string",required:!0},description:"The high level entity type being described."},{key:"metadata",value:{name:"intersection",raw:`JsonObject & {
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair. This value is part of the technical
   * identifier of the entity, and as such it will appear in URLs, database
   * tables, entity references, and similar. It is subject to restrictions
   * regarding what characters are allowed.
   *
   * If you want to use a different, more human readable string with fewer
   * restrictions on it in user interfaces, see the \`title\` field below.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A display name of the entity, to be presented in user interfaces instead
   * of the \`name\` property above, when available.
   *
   * This field is sometimes useful when the \`name\` is cumbersome or ends up
   * being perceived as overly technical. The title generally does not have
   * as stringent format requirements on it, so it may contain special
   * characters and be more explanatory. Do keep it very short though, and
   * avoid situations where a title can be confused with the name of another
   * entity, or where two entities share a title.
   *
   * Note that this is only for display purposes, and may be ignored by some
   * parts of the code. Entity references still always make use of the \`name\`
   * property, not the title.
   */
  title?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
}`,elements:[{name:"signature",type:"object",raw:"{ [key in string]?: JsonValue }",signature:{properties:[{key:{name:"string",required:!1},value:{name:"union",raw:"JsonObject | JsonArray | JsonPrimitive",elements:[{name:"JsonObject"},{name:"JsonArray"},{name:"union",raw:"number | string | boolean | null",elements:[{name:"number"},{name:"string"},{name:"boolean"},{name:"null"}]}]}}]},required:!1},{name:"signature",type:"object",raw:`{
  /**
   * A globally unique ID for the entity.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, but the server is free to reject requests
   * that do so in such a way that it breaks semantics.
   */
  uid?: string;

  /**
   * An opaque string that changes for each update operation to any part of
   * the entity, including metadata.
   *
   * This field can not be set by the user at creation time, and the server
   * will reject an attempt to do so. The field will be populated in read
   * operations. The field can (optionally) be specified when performing
   * update or delete operations, and the server will then reject the
   * operation if it does not match the current stored value.
   */
  etag?: string;

  /**
   * The name of the entity.
   *
   * Must be unique within the catalog at any given point in time, for any
   * given namespace + kind pair. This value is part of the technical
   * identifier of the entity, and as such it will appear in URLs, database
   * tables, entity references, and similar. It is subject to restrictions
   * regarding what characters are allowed.
   *
   * If you want to use a different, more human readable string with fewer
   * restrictions on it in user interfaces, see the \`title\` field below.
   */
  name: string;

  /**
   * The namespace that the entity belongs to.
   */
  namespace?: string;

  /**
   * A display name of the entity, to be presented in user interfaces instead
   * of the \`name\` property above, when available.
   *
   * This field is sometimes useful when the \`name\` is cumbersome or ends up
   * being perceived as overly technical. The title generally does not have
   * as stringent format requirements on it, so it may contain special
   * characters and be more explanatory. Do keep it very short though, and
   * avoid situations where a title can be confused with the name of another
   * entity, or where two entities share a title.
   *
   * Note that this is only for display purposes, and may be ignored by some
   * parts of the code. Entity references still always make use of the \`name\`
   * property, not the title.
   */
  title?: string;

  /**
   * A short (typically relatively few words, on one line) description of the
   * entity.
   */
  description?: string;

  /**
   * Key/value pairs of identifying information attached to the entity.
   */
  labels?: Record<string, string>;

  /**
   * Key/value pairs of non-identifying auxiliary information attached to the
   * entity.
   */
  annotations?: Record<string, string>;

  /**
   * A list of single-valued strings, to for example classify catalog entities in
   * various ways.
   */
  tags?: string[];

  /**
   * A list of external hyperlinks related to the entity.
   */
  links?: EntityLink[];
}`,signature:{properties:[{key:"uid",value:{name:"string",required:!1},description:`A globally unique ID for the entity.

This field can not be set by the user at creation time, and the server
will reject an attempt to do so. The field will be populated in read
operations. The field can (optionally) be specified when performing
update or delete operations, but the server is free to reject requests
that do so in such a way that it breaks semantics.`},{key:"etag",value:{name:"string",required:!1},description:`An opaque string that changes for each update operation to any part of
the entity, including metadata.

This field can not be set by the user at creation time, and the server
will reject an attempt to do so. The field will be populated in read
operations. The field can (optionally) be specified when performing
update or delete operations, and the server will then reject the
operation if it does not match the current stored value.`},{key:"name",value:{name:"string",required:!0},description:`The name of the entity.

Must be unique within the catalog at any given point in time, for any
given namespace + kind pair. This value is part of the technical
identifier of the entity, and as such it will appear in URLs, database
tables, entity references, and similar. It is subject to restrictions
regarding what characters are allowed.

If you want to use a different, more human readable string with fewer
restrictions on it in user interfaces, see the \`title\` field below.`},{key:"namespace",value:{name:"string",required:!1},description:"The namespace that the entity belongs to."},{key:"title",value:{name:"string",required:!1},description:`A display name of the entity, to be presented in user interfaces instead
of the \`name\` property above, when available.

This field is sometimes useful when the \`name\` is cumbersome or ends up
being perceived as overly technical. The title generally does not have
as stringent format requirements on it, so it may contain special
characters and be more explanatory. Do keep it very short though, and
avoid situations where a title can be confused with the name of another
entity, or where two entities share a title.

Note that this is only for display purposes, and may be ignored by some
parts of the code. Entity references still always make use of the \`name\`
property, not the title.`},{key:"description",value:{name:"string",required:!1},description:`A short (typically relatively few words, on one line) description of the
entity.`},{key:"labels",value:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>",required:!1},description:"Key/value pairs of identifying information attached to the entity."},{key:"annotations",value:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>",required:!1},description:`Key/value pairs of non-identifying auxiliary information attached to the
entity.`},{key:"tags",value:{name:"Array",elements:[{name:"string"}],raw:"string[]",required:!1},description:`A list of single-valued strings, to for example classify catalog entities in
various ways.`},{key:"links",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  /**
   * The url to the external site, document, etc.
   */
  url: string;

  /**
   * An optional descriptive title for the link.
   */
  title?: string;

  /**
   * An optional semantic key that represents a visual icon.
   */
  icon?: string;

  /**
   * An optional value to categorize links into specific groups
   */
  type?: string;
}`,signature:{properties:[{key:"url",value:{name:"string",required:!0},description:"The url to the external site, document, etc."},{key:"title",value:{name:"string",required:!1},description:"An optional descriptive title for the link."},{key:"icon",value:{name:"string",required:!1},description:"An optional semantic key that represents a visual icon."},{key:"type",value:{name:"string",required:!1},description:"An optional value to categorize links into specific groups"}]}}],raw:"EntityLink[]",required:!1},description:"A list of external hyperlinks related to the entity."}]}}],required:!0},description:"Metadata related to the entity."},{key:"spec",value:{name:"signature",type:"object",raw:"{ [key in string]?: JsonValue }",signature:{properties:[{key:{name:"string",required:!1},value:{name:"union",raw:"JsonObject | JsonArray | JsonPrimitive",elements:[{name:"JsonObject"},{name:"JsonArray"},{name:"union",raw:"number | string | boolean | null",elements:[{name:"number"},{name:"string"},{name:"boolean"},{name:"null"}]}]}}]},required:!1},description:"The specification data describing the entity itself."},{key:"relations",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  /**
   * The type of the relation.
   */
  type: string;

  /**
   * The entity ref of the target of this relation.
   */
  targetRef: string;
}`,signature:{properties:[{key:"type",value:{name:"string",required:!0},description:"The type of the relation."},{key:"targetRef",value:{name:"string",required:!0},description:"The entity ref of the target of this relation."}]}}],raw:"EntityRelation[]",required:!1},description:"The relations that this entity has with other entities."}]}},description:""}}};const Er=Ht({root:{height:"100%"},title:{minWidth:0,overflow:"hidden"},footer:{display:"flex",justifyContent:"flex-end"}});function Sr(n){const{title:e,headerActions:t,footerActions:r,children:a,className:s}=n,i=Er();return M.jsxs(Bt,{className:zt(i.root,s),children:[e&&M.jsx(Jt,{children:M.jsxs(De,{justify:"between",align:"center",children:[M.jsx(Yt,{as:"h3",variant:"title-x-small",weight:"bold",className:i.title,children:e}),t&&M.jsx(De,{align:"center",gap:"1",children:t})]})}),M.jsx(Wt,{children:a}),r&&M.jsx(Gt,{className:i.footer,children:r})]})}Sr.__docgenInfo={description:"@public",methods:[],displayName:"EntityInfoCard",props:{title:{required:!1,tsType:{name:"ReactNode"},description:""},headerActions:{required:!1,tsType:{name:"ReactNode"},description:""},footerActions:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};const zr=Kt({id:"org",messages:{groupProfileCard:{groupNotFound:"Group not found",editIconButtonTitle:"Edit Metadata",refreshIconButtonTitle:"Schedule entity refresh",refreshIconButtonAriaLabel:"Refresh",listItemTitle:{entityRef:"Entity Ref",email:"Email",parentGroup:"Parent Group",childGroups:"Child Groups"}},membersListCard:{cardLabel:"User page for {{memberName}}",title:"{{groupName}} members",noMembersDescription:"This group has no members.",noSearchResult:'Found no members matching "{{searchTerm}}".',aggregateMembersToggle:{label:"Include subgroups"}},ownershipCard:{title:"Ownership",aggregateRelationsToggle:{label:"Include indirect ownership"}},userProfileCard:{userNotFound:"User not found",editIconButtonTitle:"Edit Metadata",listItemTitle:{email:"Email",memberOf:"Member of"},moreGroupButtonTitle:"...More ({{number}})",allGroupDialog:{title:"All {{name}}'s groups:",closeButtonTitle:"Close"}}}});export{Sr as E,Dr as R,Or as a,Kr as b,Ur as g,zr as o,Fr as u};
