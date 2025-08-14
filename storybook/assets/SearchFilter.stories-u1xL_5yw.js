import{j as a}from"./jsx-runtime-hv06LKfz.js";import{s as X,M as Y}from"./api-YILTVPsk.js";import{r as k}from"./index-D8-PC79C.js";import{l as Z}from"./lodash-D1GzKnrP.js";import{a as ee}from"./useAsync-7M-9CJJS.js";import{u as ne}from"./useDebounce-DXlgMZDE.js";import{u as _,S as ae}from"./SearchContext-DiK7zrkk.js";import{A as te}from"./Autocomplete-DkeIkNkf.js";import{C as re}from"./Chip-D_bIHfxd.js";import{T as se}from"./TextField-DmWL4a35.js";import{s as le}from"./translation-BIsYolyo.js";import{m as ie}from"./makeStyles-CJp8qHqH.js";import{a as G,F as ue}from"./FormLabel-CjYxj4ka.js";import{F as oe}from"./FormControlLabel-DM5JIk7M.js";import{C as me}from"./Checkbox-qt6-_sIU.js";import{u as ce}from"./useTranslationRef-DKy5gnX5.js";import{S as pe}from"./Select-DwLWjVhZ.js";import{S as B}from"./Grid-8Ap4jsYG.js";import{P as q}from"./Paper-BiLxp0Cg.js";import{T as de}from"./TestApiProvider-DCQwDAHh.js";import"./ApiRef-ByCJBjX1.js";import"./useMountedState-YD35FCBK.js";import"./ConfigApi-ij0WO1-Y.js";import"./useAnalytics-Q-nz63z2.js";import"./defaultTheme-NkpNA350.js";import"./clsx.m-CH7BE6MN.js";import"./Close-D-8NHvXu.js";import"./createSvgIcon-D-gz-Nq7.js";import"./capitalize-fS9uM6tv.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./unstable_useId-DQJte0g1.js";import"./useControlled-CliGfT3L.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./IconButton-tgA3biVt.js";import"./ButtonBase-DXo3xcpP.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./Popper-ErueZYbr.js";import"./createChainedFunction-Da-WpsAN.js";import"./Portal-yuzZovYw.js";import"./ListSubheader-9iaHlYVi.js";import"./Select-aGy7NPFn.js";import"./index-DnL3XN75.js";import"./useTheme-Dk0AiudM.js";import"./Popover-CKCFsMrH.js";import"./debounce-DtXjJkxj.js";import"./Grow-BOepmPk1.js";import"./utils-DMni-BWz.js";import"./Modal-m69wb1rs.js";import"./classCallCheck-MFKM5G8b.js";import"./List-Bi5n8Alr.js";import"./ListContext-Brz5ktZ2.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Dd17crCt.js";import"./InputLabel-BbZEQtws.js";import"./TranslationApi-CV0OlCW4.js";import"./isMuiElement-DKhW5xVU.js";import"./Typography-NhBf-tfS.js";import"./SwitchBase-DyocCphe.js";import"./Cancel-Zy33v8ql.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./Box-dSpCvcz2.js";import"./typography-Mwc_tj4E.js";import"./MenuItem-BeuliaIE.js";import"./ListItem-CIr9U5k9.js";import"./ApiProvider-CYh4HGR1.js";import"./index-BKN9BsH4.js";const s=[];for(let e=0;e<256;++e)s.push((e+256).toString(16).slice(1));function ge(e,n=0){return(s[e[n+0]]+s[e[n+1]]+s[e[n+2]]+s[e[n+3]]+"-"+s[e[n+4]]+s[e[n+5]]+"-"+s[e[n+6]]+s[e[n+7]]+"-"+s[e[n+8]]+s[e[n+9]]+"-"+s[e[n+10]]+s[e[n+11]]+s[e[n+12]]+s[e[n+13]]+s[e[n+14]]+s[e[n+15]]).toLowerCase()}let R;const fe=new Uint8Array(16);function ve(){if(!R){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");R=crypto.getRandomValues.bind(crypto)}return R(fe)}const ye=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),z={randomUUID:ye};function be(e,n,l){if(z.randomUUID&&!e)return z.randomUUID();e=e||{};const t=e.random??e.rng?.()??ve();if(t.length<16)throw new Error("Random bytes length must be >= 16");return t[6]=t[6]&15|64,t[8]=t[8]&63|128,ge(t)}function F(e){if(e!==void 0)return Array.isArray(e)?e.map(n=>F(n)):typeof e=="string"?{value:e,label:e}:e}const L=(e,n,l=[],t=250)=>{const r=k.useRef({}),u=k.useCallback(async o=>(await e?.(o))?.map(b=>F(b))||[],[e]),[y,p]=ee(u,[n],{loading:!0});if(ne(()=>{r.current[n]===void 0&&(r.current[n]=p(n).then(o=>(r.current[n]=o,o)))},t,[p,n]),l.length)return{loading:!1,value:l};const f=r.current[n];return Array.isArray(f)?{loading:!1,value:f}:y},O=(e,n)=>{const{setFilters:l}=_();k.useEffect(()=>{n&&[n].flat().length>0&&l(t=>({...t,[e]:n}))},[])},H=e=>{const{className:n,defaultValue:l,name:t,values:r,valuesDebounceMs:u,label:y,filterSelectedOptions:p,limitTags:f,multiple:o}=e,[b,V]=k.useState("");O(t,l);const h=typeof r=="function"?r:void 0,S=typeof r=="function"?void 0:r?.map(c=>F(c)),{value:A,loading:m}=L(h,b,S,u),{filters:d,setFilters:D}=_(),g=F(d[t]),x=k.useMemo(()=>g||(o?[]:null),[g,o]),j=(c,v)=>{D(W=>{const{[t]:U,...$}=W;return v?{...$,[t]:Array.isArray(v)?v.map(Q=>Q.value):v.value}:{...$}})},w=c=>a.jsx(se,{...c,name:"search",variant:"outlined",label:y,fullWidth:!0}),N=(c,v)=>c.map((W,U)=>a.jsx(re,{label:W.label,color:"primary",...v({index:U})}));return a.jsx(te,{filterSelectedOptions:p,limitTags:f,multiple:o,className:n,id:`${o?"multi-":""}select-filter-${t}--select`,options:A||[],loading:m,value:x,onChange:j,onInputChange:(c,v)=>V(v),getOptionLabel:c=>c.label,renderInput:w,renderTags:N})};H.__docgenInfo={description:"@public",methods:[],displayName:"AutocompleteFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
of values to be used in the filter. In the autocomplete filter, the last
input value is provided as an input to allow values to be filtered. This
function is debounced and values cached.`},defaultValue:{required:!1,tsType:{name:"union",raw:"string[] | string | null",elements:[{name:"Array",elements:[{name:"string"}],raw:"string[]"},{name:"string"},{name:"null"}]},description:""},valuesDebounceMs:{required:!1,tsType:{name:"number"},description:`Debounce time in milliseconds, used when values is an async callback.
Defaults to 250ms.`},filterSelectedOptions:{required:!1,tsType:{name:"boolean"},description:""},limitTags:{required:!1,tsType:{name:"number"},description:""},multiple:{required:!1,tsType:{name:"boolean"},description:""}}};const he=ie({label:{textTransform:"capitalize"},checkboxWrapper:{display:"flex",alignItems:"center",width:"100%"},textWrapper:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}),J=e=>{const{className:n,defaultValue:l,label:t,name:r,values:u=[],valuesDebounceMs:y}=e,p=he(),{filters:f,setFilters:o}=_();O(r,l);const b=typeof u=="function"?u:void 0,V=typeof u=="function"?void 0:u.map(m=>F(m)),{value:h=[],loading:S}=L(b,"",V,y),A=m=>{const{target:{value:d,checked:D}}=m;o(g=>{const{[r]:x,...j}=g,w=(x||[]).filter(c=>c!==d),N=D?[...w,d]:w;return N.length?{...j,[r]:N}:j})};return a.jsxs(G,{className:n,disabled:S,fullWidth:!0,"data-testid":"search-checkboxfilter-next",children:[!!t&&a.jsx(ue,{className:p.label,children:t}),h.map(({value:m,label:d})=>a.jsx(oe,{classes:{root:p.checkboxWrapper,label:p.textWrapper},label:d,control:a.jsx(me,{color:"primary",inputProps:{"aria-labelledby":d},value:m,name:d,onChange:A,checked:(f[r]??[]).includes(m)})},m))]})},K=e=>{const{className:n,defaultValue:l,label:t,name:r,values:u,valuesDebounceMs:y}=e,{t:p}=ce(le);O(r,l);const f=typeof u=="function"?u:void 0,o=typeof u=="function"?void 0:u?.map(g=>F(g)),{value:b=[],loading:V}=L(f,"",o,y),h=k.useRef(be()),S={value:h.current,label:p("searchFilter.allOptionTitle")},{filters:A,setFilters:m}=_(),d=g=>{m(x=>{const{[r]:j,...w}=x;return g!==h.current?{...w,[r]:g}:w})},D=[S,...b];return a.jsx(G,{disabled:V,className:n,variant:"filled",fullWidth:!0,"data-testid":"search-selectfilter-next",children:a.jsx(pe,{label:t??Z.capitalize(r),selected:A[r]||h.current,onChange:d,items:D})})},i=e=>{const{component:n,...l}=e;return a.jsx(n,{...l})};i.Checkbox=e=>a.jsx(i,{...e,component:J});i.Select=e=>a.jsx(i,{...e,component:K});i.Autocomplete=e=>a.jsx(i,{...e,component:H});J.__docgenInfo={description:"@public",methods:[],displayName:"CheckboxFilter",props:{className:{required:!1,tsType:{name:"string"},description:""},name:{required:!0,tsType:{name:"string"},description:""},label:{required:!1,tsType:{name:"string"},description:""},values:{required:!1,tsType:{name:"union",raw:"FilterValue[] | ((partial: string) => Promise<FilterValue[]>)",elements:[{name:"Array",elements:[{name:"union",raw:"string | FilterValueWithLabel",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}]}],raw:"FilterValue[]"},{name:"unknown"}]},description:`Either an array of values directly, or an async function to return a list
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
Defaults to 250ms.`}]}},name:"props"}],return:{name:"ReactElement"}}},description:""},debug:{required:!1,tsType:{name:"boolean"},description:""}}};const Ln={title:"Plugins/Search/SearchFilter",component:i,decorators:[e=>a.jsx(de,{apis:[[X,new Y]],children:a.jsx(ae,{children:a.jsx(B,{container:!0,direction:"row",children:a.jsx(B,{item:!0,xs:4,children:a.jsx(e,{})})})})})]},T=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Checkbox,{name:"Search Checkbox Filter",values:["value1","value2"]})}),P=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Select,{label:"Search Select Filter",name:"select_filter",values:["value1","value2"]})}),C=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Select,{label:"Asynchronous Values",name:"async_values",values:async()=>(await(await fetch("https://swapi.dev/api/planets")).json()).results.map(l=>l.name)})}),I=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Autocomplete,{name:"autocomplete",label:"Single-Select Autocomplete Filter",values:["value1","value2"]})}),E=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Autocomplete,{multiple:!0,name:"autocomplete",label:"Multi-Select Autocomplete Filter",values:["value1","value2"]})}),M=()=>a.jsx(q,{style:{padding:10},children:a.jsx(i.Autocomplete,{multiple:!0,name:"starwarsPerson",label:"Starwars Character",values:async e=>e===""?[]:(await(await fetch(`https://swapi.dev/api/people?search=${encodeURIComponent(e)}`)).json()).results.map(t=>t.name)})});T.__docgenInfo={description:"",methods:[],displayName:"CheckBoxFilter"};P.__docgenInfo={description:"",methods:[],displayName:"SelectFilter"};C.__docgenInfo={description:"",methods:[],displayName:"AsyncSelectFilter"};I.__docgenInfo={description:"",methods:[],displayName:"Autocomplete"};E.__docgenInfo={description:"",methods:[],displayName:"MultiSelectAutocomplete"};M.__docgenInfo={description:"",methods:[],displayName:"AsyncMultiSelectAutocomplete"};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`() => {
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
}`,...M.parameters?.docs?.source}}};const On=["CheckBoxFilter","SelectFilter","AsyncSelectFilter","Autocomplete","MultiSelectAutocomplete","AsyncMultiSelectAutocomplete"];export{M as AsyncMultiSelectAutocomplete,C as AsyncSelectFilter,I as Autocomplete,T as CheckBoxFilter,E as MultiSelectAutocomplete,P as SelectFilter,On as __namedExportsOrder,Ln as default};
