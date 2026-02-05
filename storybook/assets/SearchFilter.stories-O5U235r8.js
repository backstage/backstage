import{r as j,j as a,m as X,F as Y,U as Z,P}from"./iframe-M9O-K8SB.js";import{s as ee,M as ne}from"./api-JIjLndcE.js";import{l as ae}from"./lodash-Czox7iJy.js";import{a as te}from"./useAsync-CFnaQwpM.js";import{u as re}from"./useDebounce-CveqfYag.js";import{u as _,S as se}from"./SearchContext-3Ne9i5li.js";import{A as le}from"./Autocomplete-B0qCKk_C.js";import{C as ie}from"./Chip-UMWnGD-v.js";import{T as ue}from"./TextField-Dl4vLPoK.js";import{s as oe}from"./translation-kn3hcwTy.js";import{a as G,F as ce}from"./FormLabel-CaD7F1Na.js";import{F as me}from"./FormControlLabel-BGQ5MuAT.js";import{C as pe}from"./Checkbox-DTbDgxgs.js";import{S as de}from"./Select-BqrpLaY-.js";import{S as B}from"./Grid-DxciBpqo.js";import"./preload-helper-PPVm8Dsz.js";import"./useMountedState-CLl1ZXx0.js";import"./useAnalytics-8ya555GT.js";import"./Popper-BxqJldSX.js";import"./Portal-B9990TVI.js";import"./ListSubheader-DjN8eIzh.js";import"./Select-ByRkfEZ7.js";import"./index-B9sM2jn7.js";import"./Popover-9y8CeMZr.js";import"./Modal-Bu63BRBX.js";import"./List-DFXlWgcm.js";import"./ListContext-CQy2fJuy.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CnxnhVyN.js";import"./InputLabel-BRgQ3qkL.js";import"./SwitchBase-D1GSrS3W.js";import"./Cancel-D79u7Nda.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./Box-DrVgjJoD.js";import"./styled-Ddkk_tuK.js";import"./MenuItem-Df6QXV-k.js";import"./ListItem-CccU-wMK.js";const s=[];for(let e=0;e<256;++e)s.push((e+256).toString(16).slice(1));function ve(e,n=0){return(s[e[n+0]]+s[e[n+1]]+s[e[n+2]]+s[e[n+3]]+"-"+s[e[n+4]]+s[e[n+5]]+"-"+s[e[n+6]]+s[e[n+7]]+"-"+s[e[n+8]]+s[e[n+9]]+"-"+s[e[n+10]]+s[e[n+11]]+s[e[n+12]]+s[e[n+13]]+s[e[n+14]]+s[e[n+15]]).toLowerCase()}let W;const ge=new Uint8Array(16);function fe(){if(!W){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");W=crypto.getRandomValues.bind(crypto)}return W(ge)}const ye=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),z={randomUUID:ye};function be(e,n,l){if(z.randomUUID&&!e)return z.randomUUID();e=e||{};const t=e.random??e.rng?.()??fe();if(t.length<16)throw new Error("Random bytes length must be >= 16");return t[6]=t[6]&15|64,t[8]=t[8]&63|128,ve(t)}function x(e){if(e!==void 0)return Array.isArray(e)?e.map(n=>x(n)):typeof e=="string"?{value:e,label:e}:e}const L=(e,n,l=[],t=250)=>{const r=j.useRef({}),u=j.useCallback(async o=>(await e?.(o))?.map(S=>x(S))||[],[e]),[q,p]=te(u,[n],{loading:!0});if(re(()=>{r.current[n]===void 0&&(r.current[n]=p(n).then(o=>(r.current[n]=o,o)))},t,[p,n]),l.length)return{loading:!1,value:l};const F=r.current[n];return Array.isArray(F)?{loading:!1,value:F}:q},O=(e,n)=>{const{setFilters:l}=_();j.useEffect(()=>{n&&[n].flat().length>0&&l(t=>({...t,[e]:n}))},[])},H=e=>{const{className:n,defaultValue:l,name:t,values:r,valuesDebounceMs:u,label:q,filterSelectedOptions:p,limitTags:F,multiple:o}=e,[S,D]=j.useState("");O(t,l);const V=typeof r=="function"?r:void 0,T=typeof r=="function"?void 0:r?.map(m=>x(m)),{value:C,loading:c}=L(V,S,T,u),{filters:d,setFilters:I}=_(),v=x(d[t]),E=j.useMemo(()=>v||(o?[]:null),[v,o]),M=(m,k)=>{I(R=>{const{[t]:U,...$}=R;return k?{...$,[t]:Array.isArray(k)?k.map(Q=>Q.value):k.value}:{...$}})},A=m=>a.jsx(ue,{...m,name:"search",variant:"outlined",label:q,fullWidth:!0}),N=(m,k)=>m.map((R,U)=>a.jsx(ie,{label:R.label,color:"primary",...k({index:U})}));return a.jsx(le,{filterSelectedOptions:p,limitTags:F,multiple:o,className:n,id:`${o?"multi-":""}select-filter-${t}--select`,options:C||[],loading:c,value:E,onChange:M,onInputChange:(m,k)=>D(k),getOptionLabel:m=>m.label,renderInput:A,renderTags:N})};H.__docgenInfo={description:"@public",methods:[],displayName:"AutocompleteFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},defaultValue:{required:!1,tsType:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}]},description:""},valuesDebounceMs:{required:!1,tsType:{name:"number"},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`},filterSelectedOptions:{required:!1,tsType:{name:"boolean"},description:""},limitTags:{required:!1,tsType:{name:"number"},description:""},multiple:{required:!1,tsType:{name:"boolean"},description:""}}};const he=X({label:{textTransform:"capitalize"},checkboxWrapper:{display:"flex",alignItems:"center",width:"100%"},textWrapper:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}),J=e=>{const{className:n,defaultValue:l,label:t,name:r,values:u=[],valuesDebounceMs:q}=e,p=he(),{filters:F,setFilters:o}=_();O(r,l);const S=typeof u=="function"?u:void 0,D=typeof u=="function"?void 0:u.map(c=>x(c)),{value:V=[],loading:T}=L(S,"",D,q),C=c=>{const{target:{value:d,checked:I}}=c;o(v=>{const{[r]:E,...M}=v,A=(E||[]).filter(m=>m!==d),N=I?[...A,d]:A;return N.length?{...M,[r]:N}:M})};return a.jsxs(G,{className:n,disabled:T,fullWidth:!0,"data-testid":"search-checkboxfilter-next",children:[!!t&&a.jsx(ce,{className:p.label,children:t}),V.map(({value:c,label:d})=>a.jsx(me,{classes:{root:p.checkboxWrapper,label:p.textWrapper},label:d,control:a.jsx(pe,{color:"primary",inputProps:{"aria-labelledby":d},value:c,name:d,onChange:C,checked:(F[r]??[]).includes(c)})},c))]})},K=e=>{const{className:n,defaultValue:l,label:t,name:r,values:u,valuesDebounceMs:q}=e,{t:p}=Y(oe);O(r,l);const F=typeof u=="function"?u:void 0,o=typeof u=="function"?void 0:u?.map(v=>x(v)),{value:S=[],loading:D}=L(F,"",o,q),V=j.useRef(be()),T={value:V.current,label:p("searchFilter.allOptionTitle")},{filters:C,setFilters:c}=_(),d=v=>{c(E=>{const{[r]:M,...A}=E;return v!==V.current?{...A,[r]:v}:A})},I=[T,...S];return a.jsx(G,{disabled:D,className:n,variant:"filled",fullWidth:!0,"data-testid":"search-selectfilter-next",children:a.jsx(de,{label:t??ae.capitalize(r),selected:C[r]||V.current,onChange:d,items:I})})},i=e=>{const{component:n,...l}=e;return a.jsx(n,{...l})};i.Checkbox=e=>a.jsx(i,{...e,component:J});i.Select=e=>a.jsx(i,{...e,component:K});i.Autocomplete=e=>a.jsx(i,{...e,component:H});J.__docgenInfo={description:"@public",methods:[],displayName:"CheckboxFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
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
Defaults to 250ms.`}]}},name:"props"}],return:{name:"ReactElement"}}},description:""},debug:{required:!1,tsType:{name:"boolean"},description:""}}};const rn={title:"Plugins/Search/SearchFilter",component:i,decorators:[e=>a.jsx(Z,{apis:[[ee,new ne]],children:a.jsx(se,{children:a.jsx(B,{container:!0,direction:"row",children:a.jsx(B,{item:!0,xs:4,children:a.jsx(e,{})})})})})],tags:["!manifest"]},g=()=>a.jsx(P,{style:{padding:10},children:a.jsx(i.Checkbox,{name:"Search Checkbox Filter",values:["value1","value2"]})}),f=()=>a.jsx(P,{style:{padding:10},children:a.jsx(i.Select,{label:"Search Select Filter",name:"select_filter",values:["value1","value2"]})}),y=()=>a.jsx(P,{style:{padding:10},children:a.jsx(i.Select,{label:"Asynchronous Values",name:"async_values",values:async()=>(await(await fetch("https://swapi.dev/api/planets")).json()).results.map(l=>l.name)})}),b=()=>a.jsx(P,{style:{padding:10},children:a.jsx(i.Autocomplete,{name:"autocomplete",label:"Single-Select Autocomplete Filter",values:["value1","value2"]})}),h=()=>a.jsx(P,{style:{padding:10},children:a.jsx(i.Autocomplete,{multiple:!0,name:"autocomplete",label:"Multi-Select Autocomplete Filter",values:["value1","value2"]})}),w=()=>a.jsx(P,{style:{padding:10},children:a.jsx(i.Autocomplete,{multiple:!0,name:"starwarsPerson",label:"Starwars Character",values:async e=>e===""?[]:(await(await fetch(`https://swapi.dev/api/people?search=${encodeURIComponent(e)}`)).json()).results.map(t=>t.name)})});g.__docgenInfo={description:"",methods:[],displayName:"CheckBoxFilter"};f.__docgenInfo={description:"",methods:[],displayName:"SelectFilter"};y.__docgenInfo={description:"",methods:[],displayName:"AsyncSelectFilter"};b.__docgenInfo={description:"",methods:[],displayName:"Autocomplete"};h.__docgenInfo={description:"",methods:[],displayName:"MultiSelectAutocomplete"};w.__docgenInfo={description:"",methods:[],displayName:"AsyncMultiSelectAutocomplete"};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{code:`const CheckBoxFilter = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Checkbox
        name="Search Checkbox Filter"
        values={["value1", "value2"]}
      />
    </Paper>
  );
};
`,...g.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{code:`const SelectFilter = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Select
        label="Search Select Filter"
        name="select_filter"
        values={["value1", "value2"]}
      />
    </Paper>
  );
};
`,...f.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{code:`const AsyncSelectFilter = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Select
        label="Asynchronous Values"
        name="async_values"
        values={async () => {
          const response = await fetch("https://swapi.dev/api/planets");
          const json: { results: Array<{ name: string }> } =
            await response.json();
          return json.results.map((r) => r.name);
        }}
      />
    </Paper>
  );
};
`,...y.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{code:`const Autocomplete = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Autocomplete
        name="autocomplete"
        label="Single-Select Autocomplete Filter"
        values={["value1", "value2"]}
      />
    </Paper>
  );
};
`,...b.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{code:`const MultiSelectAutocomplete = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Autocomplete
        multiple
        name="autocomplete"
        label="Multi-Select Autocomplete Filter"
        values={["value1", "value2"]}
      />
    </Paper>
  );
};
`,...h.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{code:`const AsyncMultiSelectAutocomplete = () => {
  return (
    <Paper style={{ padding: 10 }}>
      <SearchFilter.Autocomplete
        multiple
        name="starwarsPerson"
        label="Starwars Character"
        values={async (partial) => {
          if (partial === "") return [];
          const response = await fetch(
            \`https://swapi.dev/api/people?search=\${encodeURIComponent(partial)}\`
          );
          const json: { results: Array<{ name: string }> } =
            await response.json();
          return json.results.map((r) => r.name);
        }}
      />
    </Paper>
  );
};
`,...w.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Checkbox name="Search Checkbox Filter" values={['value1', 'value2']} />
    </Paper>;
}`,...g.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Select label="Search Select Filter" name="select_filter" values={['value1', 'value2']} />
    </Paper>;
}`,...f.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`() => {
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
}`,...y.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Autocomplete name="autocomplete" label="Single-Select Autocomplete Filter" values={['value1', 'value2']} />
    </Paper>;
}`,...b.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Autocomplete multiple name="autocomplete" label="Multi-Select Autocomplete Filter" values={['value1', 'value2']} />
    </Paper>;
}`,...h.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`() => {
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
}`,...w.parameters?.docs?.source}}};const sn=["CheckBoxFilter","SelectFilter","AsyncSelectFilter","Autocomplete","MultiSelectAutocomplete","AsyncMultiSelectAutocomplete"];export{w as AsyncMultiSelectAutocomplete,y as AsyncSelectFilter,b as Autocomplete,g as CheckBoxFilter,h as MultiSelectAutocomplete,f as SelectFilter,sn as __namedExportsOrder,rn as default};
