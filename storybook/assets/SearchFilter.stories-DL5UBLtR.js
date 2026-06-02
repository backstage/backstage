import{ca as w,bR as n,cY as Y,Q as F,a5 as H}from"./iframe-DogXi1kP.js";import{s as J,M as K}from"./api-pe4Jk8Pn.js";import{a as X}from"./lodash-Bl4KCeDg.js";import{a as Z}from"./useAsync-Dwi-mC7O.js";import{u as ee}from"./useDebounce-2bL7MmBq.js";import{a as N,S as ne}from"./SearchContext-OqF0SfrF.js";import{A as ae}from"./Autocomplete-BlX6PKQ0.js";import{C as te}from"./Chip-JsGi1wI9.js";import{T as re}from"./TextField-amsZTFcv.js";import{s as se}from"./translation-DhoBILl4.js";import{m as le}from"./makeStyles-Bkm64Dpi.js";import{F as U,a as ie}from"./FormLabel-NvNkqzZ1.js";import{F as ue}from"./FormControlLabel-CZKsYSWw.js";import{C as oe}from"./Checkbox-DBB3w42E.js";import{S as ce}from"./Select-BintQq4i.js";import{S as $}from"./Grid-D3we3n6C.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-DWMKXBU9.js";import"./useMountedState-38Jpwyxf.js";import"./Popper-C6PO9pUv.js";import"./Portal-DKOM2ljc.js";import"./ListSubheader-CqOWHZJ6.js";import"./Select-BGtOp27L.js";import"./index-B9sM2jn7.js";import"./Popover-BIeLO-69.js";import"./Modal-QwMqv6xi.js";import"./List-DYZA-_Cd.js";import"./ListContext-BOh0ZZsa.js";import"./formControlState-DagtfhUg.js";import"./InputLabel-XG_Q-BYg.js";import"./SwitchBase-CKp6PMnz.js";import"./Cancel-wHu9i32F.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./Box-CJxb0nPe.js";import"./styled-LVo_tic8.js";import"./MenuItem-DR1znhj_.js";import"./ListItem-BXUM3Mts.js";function k(e){if(e!==void 0)return Array.isArray(e)?e.map(a=>k(a)):typeof e=="string"?{value:e,label:e}:e}const W=(e,a,s=[],r=250)=>{const t=w.useRef({}),i=w.useCallback(async u=>(await e?.(u))?.map(y=>k(y))||[],[e]),[g,m]=Z(i,[a],{loading:!0});if(ee(()=>{t.current[a]===void 0&&(t.current[a]=m(a).then(u=>(t.current[a]=u,u)))},r,[m,a]),s.length)return{loading:!1,value:s};const f=t.current[a];return Array.isArray(f)?{loading:!1,value:f}:g},R=(e,a)=>{const{setFilters:s}=N();w.useEffect(()=>{a&&[a].flat().length>0&&s(r=>({...r,[e]:a}))},[])},B=e=>{const{className:a,defaultValue:s,name:r,values:t,valuesDebounceMs:i,label:g,filterSelectedOptions:m,limitTags:f,multiple:u}=e,[y,q]=w.useState("");R(r,s);const b=typeof t=="function"?t:void 0,V=typeof t=="function"?void 0:t?.map(c=>k(c)),{value:S,loading:o}=W(b,y,V,i),{filters:d,setFilters:A}=N(),p=k(d[r]),j=w.useMemo(()=>p||(u?[]:null),[p,u]),D=(c,v)=>{A(_=>{const{[r]:L,...O}=_;return v?{...O,[r]:Array.isArray(v)?v.map(Q=>Q.value):v.value}:{...O}})},h=c=>n.jsx(re,{...c,name:"search",variant:"outlined",label:g,fullWidth:!0}),M=(c,v)=>c.map((_,L)=>n.jsx(te,{label:_.label,color:"primary",...v({index:L})}));return n.jsx(ae,{filterSelectedOptions:m,limitTags:f,multiple:u,className:a,id:`${u?"multi-":""}select-filter-${r}--select`,options:S||[],loading:o,value:j,onChange:D,onInputChange:(c,v)=>q(v),getOptionLabel:c=>c.label,renderInput:h,renderTags:M})};B.__docgenInfo={description:"@public",methods:[],displayName:"AutocompleteFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},defaultValue:{required:!1,tsType:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}]},description:""},valuesDebounceMs:{required:!1,tsType:{name:"number"},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`},filterSelectedOptions:{required:!1,tsType:{name:"boolean"},description:""},limitTags:{required:!1,tsType:{name:"number"},description:""},multiple:{required:!1,tsType:{name:"boolean"},description:""}}};const me=le({label:{textTransform:"capitalize"},checkboxWrapper:{display:"flex",alignItems:"center",width:"100%"},textWrapper:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}),z=e=>{const{className:a,defaultValue:s,label:r,name:t,values:i=[],valuesDebounceMs:g}=e,m=me(),{filters:f,setFilters:u}=N();R(t,s);const y=typeof i=="function"?i:void 0,q=typeof i=="function"?void 0:i.map(o=>k(o)),{value:b=[],loading:V}=W(y,"",q,g),S=o=>{const{target:{value:d,checked:A}}=o;u(p=>{const{[t]:j,...D}=p,h=(j||[]).filter(c=>c!==d),M=A?[...h,d]:h;return M.length?{...D,[t]:M}:D})};return n.jsxs(U,{className:a,disabled:V,fullWidth:!0,"data-testid":"search-checkboxfilter-next",children:[!!r&&n.jsx(ie,{className:m.label,children:r}),b.map(({value:o,label:d})=>n.jsx(ue,{classes:{root:m.checkboxWrapper,label:m.textWrapper},label:d,control:n.jsx(oe,{color:"primary",inputProps:{"aria-labelledby":d},value:o,name:d,onChange:S,checked:(f[t]??[]).includes(o)})},o))]})},G=e=>{const{className:a,defaultValue:s,label:r,name:t,values:i,valuesDebounceMs:g}=e,{t:m}=Y(se);R(t,s);const f=typeof i=="function"?i:void 0,u=typeof i=="function"?void 0:i?.map(p=>k(p)),{value:y=[],loading:q}=W(f,"",u,g),b=w.useRef(globalThis.crypto.randomUUID()),V={value:b.current,label:m("searchFilter.allOptionTitle")},{filters:S,setFilters:o}=N(),d=p=>{o(j=>{const{[t]:D,...h}=j;return p!==b.current?{...h,[t]:p}:h})},A=[V,...y];return n.jsx(U,{disabled:q,className:a,variant:"filled",fullWidth:!0,"data-testid":"search-selectfilter-next",children:n.jsx(ce,{label:r??X.capitalize(t),selected:S[t]||b.current,onChange:d,items:A})})},l=e=>{const{component:a,...s}=e;return n.jsx(a,{...s})};l.Checkbox=e=>n.jsx(l,{...e,component:z});l.Select=e=>n.jsx(l,{...e,component:G});l.Autocomplete=e=>n.jsx(l,{...e,component:B});z.__docgenInfo={description:"@public",methods:[],displayName:"CheckboxFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},defaultValue:{required:!1,tsType:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}]},description:""},valuesDebounceMs:{required:!1,tsType:{name:"number"},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}}};G.__docgenInfo={description:"@public",methods:[],displayName:"SelectFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},defaultValue:{required:!1,tsType:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}]},description:""},valuesDebounceMs:{required:!1,tsType:{name:"number"},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`}}};l.__docgenInfo={description:"@public",methods:[{name:"Checkbox",docblock:null,modifiers:["static"],params:[{name:"props",optional:!1,type:{name:"intersection",raw:`Omit<SearchFilterWrapperProps, 'component'> &
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
Defaults to 250ms.`}]}},name:"props"}],return:{name:"ReactElement"}}},description:""},debug:{required:!1,tsType:{name:"boolean"},description:""}}};const Je={title:"Plugins/Search/SearchFilter",component:l,decorators:[e=>n.jsx(H,{apis:[[J,new K]],children:n.jsx(ne,{children:n.jsx($,{container:!0,direction:"row",children:n.jsx($,{item:!0,xs:4,children:n.jsx(e,{})})})})})],tags:["!manifest"]},x=()=>n.jsx(F,{style:{padding:10},children:n.jsx(l.Checkbox,{name:"Search Checkbox Filter",values:["value1","value2"]})}),T=()=>n.jsx(F,{style:{padding:10},children:n.jsx(l.Select,{label:"Search Select Filter",name:"select_filter",values:["value1","value2"]})}),P=()=>n.jsx(F,{style:{padding:10},children:n.jsx(l.Select,{label:"Asynchronous Values",name:"async_values",values:async()=>(await(await fetch("https://swapi.dev/api/planets")).json()).results.map(s=>s.name)})}),C=()=>n.jsx(F,{style:{padding:10},children:n.jsx(l.Autocomplete,{name:"autocomplete",label:"Single-Select Autocomplete Filter",values:["value1","value2"]})}),I=()=>n.jsx(F,{style:{padding:10},children:n.jsx(l.Autocomplete,{multiple:!0,name:"autocomplete",label:"Multi-Select Autocomplete Filter",values:["value1","value2"]})}),E=()=>n.jsx(F,{style:{padding:10},children:n.jsx(l.Autocomplete,{multiple:!0,name:"starwarsPerson",label:"Starwars Character",values:async e=>e===""?[]:(await(await fetch(`https://swapi.dev/api/people?search=${encodeURIComponent(e)}`)).json()).results.map(r=>r.name)})});x.__docgenInfo={description:"",methods:[],displayName:"CheckBoxFilter"};T.__docgenInfo={description:"",methods:[],displayName:"SelectFilter"};P.__docgenInfo={description:"",methods:[],displayName:"AsyncSelectFilter"};C.__docgenInfo={description:"",methods:[],displayName:"Autocomplete"};I.__docgenInfo={description:"",methods:[],displayName:"MultiSelectAutocomplete"};E.__docgenInfo={description:"",methods:[],displayName:"AsyncMultiSelectAutocomplete"};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Checkbox name="Search Checkbox Filter" values={['value1', 'value2']} />
    </Paper>;
}`,...x.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Select label="Search Select Filter" name="select_filter" values={['value1', 'value2']} />
    </Paper>;
}`,...T.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`() => {
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
}`,...P.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Autocomplete name="autocomplete" label="Single-Select Autocomplete Filter" values={['value1', 'value2']} />
    </Paper>;
}`,...C.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchFilter.Autocomplete multiple name="autocomplete" label="Multi-Select Autocomplete Filter" values={['value1', 'value2']} />
    </Paper>;
}`,...I.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`() => {
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
}`,...E.parameters?.docs?.source}}};const Ke=["CheckBoxFilter","SelectFilter","AsyncSelectFilter","Autocomplete","MultiSelectAutocomplete","AsyncMultiSelectAutocomplete"];export{E as AsyncMultiSelectAutocomplete,P as AsyncSelectFilter,C as Autocomplete,x as CheckBoxFilter,I as MultiSelectAutocomplete,T as SelectFilter,Ke as __namedExportsOrder,Je as default};
