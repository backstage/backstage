import{r as k,j as a,m as X,k as Y,T as Z,$ as q}from"./iframe-B6vHPHUS.js";import{s as ee,M as ne}from"./api-C-mL8dKS.js";import{l as ae}from"./lodash-CwBbdt2Q.js";import{a as te}from"./useAsync-CtKW-R0u.js";import{u as re}from"./useDebounce-F2nZrB7B.js";import{u as _,S as se}from"./SearchContext-BpiouIkX.js";import{A as le}from"./Autocomplete-CUXyaZwB.js";import{C as ie}from"./Chip-DVrU94NQ.js";import{T as ue}from"./TextField-BE4yNrH2.js";import{s as oe}from"./translation-CTFPAqDU.js";import{a as G,F as ce}from"./FormLabel-D_770mFO.js";import{F as me}from"./FormControlLabel-DBV8ovMP.js";import{C as de}from"./Checkbox-BCXRv9zx.js";import{S as pe}from"./Select-Di8xf9Yp.js";import{S as B}from"./Grid-BHnfM9BN.js";import"./preload-helper-D9Z9MdNV.js";import"./useMountedState-4spEAOpb.js";import"./useAnalytics-CHRs9F0l.js";import"./Popper-0ce0RW6i.js";import"./Portal-DQJrkvBY.js";import"./ListSubheader-DFJUt0bb.js";import"./Select-psTXzcAQ.js";import"./index-DnL3XN75.js";import"./Popover-CBmXs0vj.js";import"./Modal-BadxeSQ1.js";import"./List-C19QDRq1.js";import"./ListContext-D8DpMZfT.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B8k-6ghs.js";import"./InputLabel-CuDSj0Lj.js";import"./SwitchBase-BC6VPVu3.js";import"./Cancel-RkG8WOFO.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./Box-BsuLuKk6.js";import"./styled-BNzka1pC.js";import"./MenuItem-D6E9BD6T.js";import"./ListItem-BxDrZyrD.js";const s=[];for(let e=0;e<256;++e)s.push((e+256).toString(16).slice(1));function ge(e,n=0){return(s[e[n+0]]+s[e[n+1]]+s[e[n+2]]+s[e[n+3]]+"-"+s[e[n+4]]+s[e[n+5]]+"-"+s[e[n+6]]+s[e[n+7]]+"-"+s[e[n+8]]+s[e[n+9]]+"-"+s[e[n+10]]+s[e[n+11]]+s[e[n+12]]+s[e[n+13]]+s[e[n+14]]+s[e[n+15]]).toLowerCase()}let R;const ve=new Uint8Array(16);function fe(){if(!R){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");R=crypto.getRandomValues.bind(crypto)}return R(ve)}const ye=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),z={randomUUID:ye};function be(e,n,l){if(z.randomUUID&&!e)return z.randomUUID();e=e||{};const t=e.random??e.rng?.()??fe();if(t.length<16)throw new Error("Random bytes length must be >= 16");return t[6]=t[6]&15|64,t[8]=t[8]&63|128,ge(t)}function F(e){if(e!==void 0)return Array.isArray(e)?e.map(n=>F(n)):typeof e=="string"?{value:e,label:e}:e}const L=(e,n,l=[],t=250)=>{const r=k.useRef({}),u=k.useCallback(async o=>(await e?.(o))?.map(b=>F(b))||[],[e]),[y,d]=te(u,[n],{loading:!0});if(re(()=>{r.current[n]===void 0&&(r.current[n]=d(n).then(o=>(r.current[n]=o,o)))},t,[d,n]),l.length)return{loading:!1,value:l};const v=r.current[n];return Array.isArray(v)?{loading:!1,value:v}:y},O=(e,n)=>{const{setFilters:l}=_();k.useEffect(()=>{n&&[n].flat().length>0&&l(t=>({...t,[e]:n}))},[])},H=e=>{const{className:n,defaultValue:l,name:t,values:r,valuesDebounceMs:u,label:y,filterSelectedOptions:d,limitTags:v,multiple:o}=e,[b,V]=k.useState("");O(t,l);const h=typeof r=="function"?r:void 0,S=typeof r=="function"?void 0:r?.map(m=>F(m)),{value:A,loading:c}=L(h,b,S,u),{filters:p,setFilters:D}=_(),g=F(p[t]),x=k.useMemo(()=>g||(o?[]:null),[g,o]),j=(m,f)=>{D(W=>{const{[t]:U,...$}=W;return f?{...$,[t]:Array.isArray(f)?f.map(Q=>Q.value):f.value}:{...$}})},w=m=>a.jsx(ue,{...m,name:"search",variant:"outlined",label:y,fullWidth:!0}),N=(m,f)=>m.map((W,U)=>a.jsx(ie,{label:W.label,color:"primary",...f({index:U})}));return a.jsx(le,{filterSelectedOptions:d,limitTags:v,multiple:o,className:n,id:`${o?"multi-":""}select-filter-${t}--select`,options:A||[],loading:c,value:x,onChange:j,onInputChange:(m,f)=>V(f),getOptionLabel:m=>m.label,renderInput:w,renderTags:N})};H.__docgenInfo={description:"@public",methods:[],displayName:"AutocompleteFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},defaultValue:{required:!1,tsType:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}]},description:""},valuesDebounceMs:{required:!1,tsType:{name:"number"},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`},filterSelectedOptions:{required:!1,tsType:{name:"boolean"},description:""},limitTags:{required:!1,tsType:{name:"number"},description:""},multiple:{required:!1,tsType:{name:"boolean"},description:""}}};const he=X({label:{textTransform:"capitalize"},checkboxWrapper:{display:"flex",alignItems:"center",width:"100%"},textWrapper:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}),J=e=>{const{className:n,defaultValue:l,label:t,name:r,values:u=[],valuesDebounceMs:y}=e,d=he(),{filters:v,setFilters:o}=_();O(r,l);const b=typeof u=="function"?u:void 0,V=typeof u=="function"?void 0:u.map(c=>F(c)),{value:h=[],loading:S}=L(b,"",V,y),A=c=>{const{target:{value:p,checked:D}}=c;o(g=>{const{[r]:x,...j}=g,w=(x||[]).filter(m=>m!==p),N=D?[...w,p]:w;return N.length?{...j,[r]:N}:j})};return a.jsxs(G,{className:n,disabled:S,fullWidth:!0,"data-testid":"search-checkboxfilter-next",children:[!!t&&a.jsx(ce,{className:d.label,children:t}),h.map(({value:c,label:p})=>a.jsx(me,{classes:{root:d.checkboxWrapper,label:d.textWrapper},label:p,control:a.jsx(de,{color:"primary",inputProps:{"aria-labelledby":p},value:c,name:p,onChange:A,checked:(v[r]??[]).includes(c)})},c))]})},K=e=>{const{className:n,defaultValue:l,label:t,name:r,values:u,valuesDebounceMs:y}=e,{t:d}=Y(oe);O(r,l);const v=typeof u=="function"?u:void 0,o=typeof u=="function"?void 0:u?.map(g=>F(g)),{value:b=[],loading:V}=L(v,"",o,y),h=k.useRef(be()),S={value:h.current,label:d("searchFilter.allOptionTitle")},{filters:A,setFilters:c}=_(),p=g=>{c(x=>{const{[r]:j,...w}=x;return g!==h.current?{...w,[r]:g}:w})},D=[S,...b];return a.jsx(G,{disabled:V,className:n,variant:"filled",fullWidth:!0,"data-testid":"search-selectfilter-next",children:a.jsx(pe,{label:t??ae.capitalize(r),selected:A[r]||h.current,onChange:p,items:D})})},i=e=>{const{component:n,...l}=e;return a.jsx(n,{...l})};i.Checkbox=e=>a.jsx(i,{...e,component:J});i.Select=e=>a.jsx(i,{...e,component:K});i.Autocomplete=e=>a.jsx(i,{...e,component:H});J.__docgenInfo={description:"@public",methods:[],displayName:"CheckboxFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},defaultValue:{required:!1,tsType:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}]},description:""},valuesDebounceMs:{required:!1,tsType:{name:"number"},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}}};K.__docgenInfo={description:"@public",methods:[],displayName:"SelectFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},defaultValue:{required:!1,tsType:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}]},description:""},valuesDebounceMs:{required:!1,tsType:{name:"number"},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}}};i.__docgenInfo={description:"@public",methods:[{name:"Checkbox",docblock:null,modifiers:["static"],params:[{name:"props",optional:!1,type:{name:"intersection",raw:`Omit<SearchFilterWrapperProps, 'component'> &
SearchFilterComponentProps`,elements:[{name:"Omit",elements:[{name:"intersection",raw:`SearchFilterComponentProps & {
  component: (props: SearchFilterComponentProps) => ReactElement;
  debug?: boolean;
}`,elements:[{name:"signature",type:"object",raw:`{
  className?: string;
  name: string;
  label?: string;
  /**
   * Either an array of values directly, or an async function to return a list
   * of values to be used in the filter. In the autocomplete filter, the last
   * input value is provided as an input to allow values to be filtered. This
   * function is debounced and values cached.
   */
  values?: FilterValue[] | ((partial: string) => Promise<FilterValue[]>);
  defaultValue?: string[] | string | null;
  /**
   * Debounce time in milliseconds, used when values is an async callback.
   * Defaults to 250ms.
   */
  valuesDebounceMs?: number;
}`,signature:{properties:[{key:"className",value:{name:"string",required:!1}},{key:"name",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"values",value:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}],required:!1},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},{key:"defaultValue",value:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}],required:!1}},{key:"valuesDebounceMs",value:{name:"number",required:!1},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}]}},{name:"signature",type:"object",raw:`{
  component: (props: SearchFilterComponentProps) => ReactElement;
  debug?: boolean;
}`,signature:{properties:[{key:"component",value:{name:"signature",type:"function",raw:"(props: SearchFilterComponentProps) => ReactElement",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  className?: string;
  name: string;
  label?: string;
  /**
   * Either an array of values directly, or an async function to return a list
   * of values to be used in the filter. In the autocomplete filter, the last
   * input value is provided as an input to allow values to be filtered. This
   * function is debounced and values cached.
   */
  values?: FilterValue[] | ((partial: string) => Promise<FilterValue[]>);
  defaultValue?: string[] | string | null;
  /**
   * Debounce time in milliseconds, used when values is an async callback.
   * Defaults to 250ms.
   */
  valuesDebounceMs?: number;
}`,signature:{properties:[{key:"className",value:{name:"string",required:!1}},{key:"name",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"values",value:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}],required:!1},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},{key:"defaultValue",value:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}],required:!1}},{key:"valuesDebounceMs",value:{name:"number",required:!1},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}]}},name:"props"}],return:{name:"ReactElement"}},required:!0}},{key:"debug",value:{name:"boolean",required:!1}}]}}]},{name:"literal",value:"'component'"}],raw:"Omit<SearchFilterWrapperProps, 'component'>"},{name:"signature",type:"object",raw:`{
  className?: string;
  name: string;
  label?: string;
  /**
   * Either an array of values directly, or an async function to return a list
   * of values to be used in the filter. In the autocomplete filter, the last
   * input value is provided as an input to allow values to be filtered. This
   * function is debounced and values cached.
   */
  values?: FilterValue[] | ((partial: string) => Promise<FilterValue[]>);
  defaultValue?: string[] | string | null;
  /**
   * Debounce time in milliseconds, used when values is an async callback.
   * Defaults to 250ms.
   */
  valuesDebounceMs?: number;
}`,signature:{properties:[{key:"className",value:{name:"string",required:!1}},{key:"name",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"values",value:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}],required:!1},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},{key:"defaultValue",value:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}],required:!1}},{key:"valuesDebounceMs",value:{name:"number",required:!1},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}]}}]}}],returns:null},{name:"Select",docblock:null,modifiers:["static"],params:[{name:"props",optional:!1,type:{name:"intersection",raw:`Omit<SearchFilterWrapperProps, 'component'> &
SearchFilterComponentProps`,elements:[{name:"Omit",elements:[{name:"intersection",raw:`SearchFilterComponentProps & {
  component: (props: SearchFilterComponentProps) => ReactElement;
  debug?: boolean;
}`,elements:[{name:"signature",type:"object",raw:`{
  className?: string;
  name: string;
  label?: string;
  /**
   * Either an array of values directly, or an async function to return a list
   * of values to be used in the filter. In the autocomplete filter, the last
   * input value is provided as an input to allow values to be filtered. This
   * function is debounced and values cached.
   */
  values?: FilterValue[] | ((partial: string) => Promise<FilterValue[]>);
  defaultValue?: string[] | string | null;
  /**
   * Debounce time in milliseconds, used when values is an async callback.
   * Defaults to 250ms.
   */
  valuesDebounceMs?: number;
}`,signature:{properties:[{key:"className",value:{name:"string",required:!1}},{key:"name",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"values",value:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}],required:!1},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},{key:"defaultValue",value:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}],required:!1}},{key:"valuesDebounceMs",value:{name:"number",required:!1},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}]}},{name:"signature",type:"object",raw:`{
  component: (props: SearchFilterComponentProps) => ReactElement;
  debug?: boolean;
}`,signature:{properties:[{key:"component",value:{name:"signature",type:"function",raw:"(props: SearchFilterComponentProps) => ReactElement",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  className?: string;
  name: string;
  label?: string;
  /**
   * Either an array of values directly, or an async function to return a list
   * of values to be used in the filter. In the autocomplete filter, the last
   * input value is provided as an input to allow values to be filtered. This
   * function is debounced and values cached.
   */
  values?: FilterValue[] | ((partial: string) => Promise<FilterValue[]>);
  defaultValue?: string[] | string | null;
  /**
   * Debounce time in milliseconds, used when values is an async callback.
   * Defaults to 250ms.
   */
  valuesDebounceMs?: number;
}`,signature:{properties:[{key:"className",value:{name:"string",required:!1}},{key:"name",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"values",value:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}],required:!1},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},{key:"defaultValue",value:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}],required:!1}},{key:"valuesDebounceMs",value:{name:"number",required:!1},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}]}},name:"props"}],return:{name:"ReactElement"}},required:!0}},{key:"debug",value:{name:"boolean",required:!1}}]}}]},{name:"literal",value:"'component'"}],raw:"Omit<SearchFilterWrapperProps, 'component'>"},{name:"signature",type:"object",raw:`{
  className?: string;
  name: string;
  label?: string;
  /**
   * Either an array of values directly, or an async function to return a list
   * of values to be used in the filter. In the autocomplete filter, the last
   * input value is provided as an input to allow values to be filtered. This
   * function is debounced and values cached.
   */
  values?: FilterValue[] | ((partial: string) => Promise<FilterValue[]>);
  defaultValue?: string[] | string | null;
  /**
   * Debounce time in milliseconds, used when values is an async callback.
   * Defaults to 250ms.
   */
  valuesDebounceMs?: number;
}`,signature:{properties:[{key:"className",value:{name:"string",required:!1}},{key:"name",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"values",value:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}],required:!1},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},{key:"defaultValue",value:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}],required:!1}},{key:"valuesDebounceMs",value:{name:"number",required:!1},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}]}}]}}],returns:null},{name:"Autocomplete",docblock:`A control surface for a given filter field name, rendered as an autocomplete
textfield. A hard-coded list of values may be provided, or an async function
which returns values may be provided instead.

@public`,modifiers:["static"],params:[{name:"props",optional:!1,type:{name:"intersection",raw:`SearchFilterComponentProps & {
  filterSelectedOptions?: boolean;
  limitTags?: number;
  multiple?: boolean;
}`,elements:[{name:"signature",type:"object",raw:`{
  className?: string;
  name: string;
  label?: string;
  /**
   * Either an array of values directly, or an async function to return a list
   * of values to be used in the filter. In the autocomplete filter, the last
   * input value is provided as an input to allow values to be filtered. This
   * function is debounced and values cached.
   */
  values?: FilterValue[] | ((partial: string) => Promise<FilterValue[]>);
  defaultValue?: string[] | string | null;
  /**
   * Debounce time in milliseconds, used when values is an async callback.
   * Defaults to 250ms.
   */
  valuesDebounceMs?: number;
}`,signature:{properties:[{key:"className",value:{name:"string",required:!1}},{key:"name",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"values",value:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}],required:!1},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},{key:"defaultValue",value:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}],required:!1}},{key:"valuesDebounceMs",value:{name:"number",required:!1},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}]}},{name:"signature",type:"object",raw:`{
  filterSelectedOptions?: boolean;
  limitTags?: number;
  multiple?: boolean;
}`,signature:{properties:[{key:"filterSelectedOptions",value:{name:"boolean",required:!1}},{key:"limitTags",value:{name:"number",required:!1}},{key:"multiple",value:{name:"boolean",required:!1}}]}}],alias:"SearchAutocompleteFilterProps"}}],returns:null,description:`A control surface for a given filter field name, rendered as an autocomplete
textfield. A hard-coded list of values may be provided, or an async function
which returns values may be provided instead.`}],displayName:"SearchFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},defaultValue:{required:!1,tsType:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}]},description:""},valuesDebounceMs:{required:!1,tsType:{name:"number"},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`},component:{required:!0,tsType:{name:"signature",type:"function",raw:"(props: SearchFilterComponentProps) => ReactElement",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  className?: string;
  name: string;
  label?: string;
  /**
   * Either an array of values directly, or an async function to return a list
   * of values to be used in the filter. In the autocomplete filter, the last
   * input value is provided as an input to allow values to be filtered. This
   * function is debounced and values cached.
   */
  values?: FilterValue[] | ((partial: string) => Promise<FilterValue[]>);
  defaultValue?: string[] | string | null;
  /**
   * Debounce time in milliseconds, used when values is an async callback.
   * Defaults to 250ms.
   */
  valuesDebounceMs?: number;
}`,signature:{properties:[{key:"className",value:{name:"string",required:!1}},{key:"name",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!1}},{key:"values",value:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}],required:!1},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},{key:"defaultValue",value:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}],required:!1}},{key:"valuesDebounceMs",value:{name:"number",required:!1},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}]}},name:"props"}],return:{name:"ReactElement"}}},description:""},debug:{required:!1,tsType:{name:"boolean"},description:""}}};const rn={title:"Plugins/Search/SearchFilter",component:i,decorators:[e=>a.jsx(Z,{apis:[[ee,new ne]],children:a.jsx(se,{children:a.jsx(B,{container:!0,direction:"row",children:a.jsx(B,{item:!0,xs:4,children:a.jsx(e,{})})})})})]},T=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Checkbox,{name:"Search Checkbox Filter",values:["value1","value2"]})}),P=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Select,{label:"Search Select Filter",name:"select_filter",values:["value1","value2"]})}),C=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Select,{label:"Asynchronous Values",name:"async_values",values:async()=>(await(await fetch("https://swapi.dev/api/planets")).json()).results.map(l=>l.name)})}),I=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Autocomplete,{name:"autocomplete",label:"Single-Select Autocomplete Filter",values:["value1","value2"]})}),E=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Autocomplete,{multiple:!0,name:"autocomplete",label:"Multi-Select Autocomplete Filter",values:["value1","value2"]})}),M=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Autocomplete,{multiple:!0,name:"starwarsPerson",label:"Starwars Character",values:async e=>e===""?[]:(await(await fetch(`https://swapi.dev/api/people?search=${encodeURIComponent(e)}`)).json()).results.map(t=>t.name)})});T.__docgenInfo={description:"",methods:[],displayName:"CheckBoxFilter"};P.__docgenInfo={description:"",methods:[],displayName:"SelectFilter"};C.__docgenInfo={description:"",methods:[],displayName:"AsyncSelectFilter"};I.__docgenInfo={description:"",methods:[],displayName:"Autocomplete"};E.__docgenInfo={description:"",methods:[],displayName:"MultiSelectAutocomplete"};M.__docgenInfo={description:"",methods:[],displayName:"AsyncMultiSelectAutocomplete"};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Checkbox name="Search Checkbox Filter" values={['value1', 'value2']} />
    </Paper>;
}`,...T.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Select label="Search Select Filter" name="select_filter" values={['value1', 'value2']} />
    </Paper>;
}`,...P.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Select label="Asynchronous Values" name="async_values" values={async () => {
      const response = await fetch('https://swapi.dev/api/planets');
      const json: {
        results: Array<{
          name: string;
        }>;
      } = await response.json();
      return json.results.map(r => r.name);
    }} />
    </Paper>;
}`,...C.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Autocomplete name="autocomplete" label="Single-Select Autocomplete Filter" values={['value1', 'value2']} />
    </Paper>;
}`,...I.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Autocomplete multiple name="autocomplete" label="Multi-Select Autocomplete Filter" values={['value1', 'value2']} />
    </Paper>;
}`,...E.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Autocomplete multiple name="starwarsPerson" label="Starwars Character" values={async partial => {
      if (partial === '') return [];
      const response = await fetch(\`https://swapi.dev/api/people?search=\${encodeURIComponent(partial)}\`);
      const json: {
        results: Array<{
          name: string;
        }>;
      } = await response.json();
      return json.results.map(r => r.name);
    }} />
    </Paper>;
}`,...M.parameters?.docs?.source}}};const sn=["CheckBoxFilter","SelectFilter","AsyncSelectFilter","Autocomplete","MultiSelectAutocomplete","AsyncMultiSelectAutocomplete"];export{M as AsyncMultiSelectAutocomplete,C as AsyncSelectFilter,I as Autocomplete,T as CheckBoxFilter,E as MultiSelectAutocomplete,P as SelectFilter,sn as __namedExportsOrder,rn as default};
