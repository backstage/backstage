import{j as e,m as N,r as d,T as k}from"./iframe-C6d4amxQ.js";import{S as z,L as B}from"./Label-DUMi-DFW.js";import{s as W,M as q}from"./api-CFhZfUf8.js";import{S as P,u as E}from"./SearchContext-Ckc5PXBu.js";import{SearchBar as H}from"./SearchBar-DMi9V1Gh.js";import{A as M}from"./Autocomplete-BMRwJNpb.js";import{C as V}from"./CircularProgress-D3-AWrdB.js";import{S as O}from"./Grid-WtUylni-.js";import{w as G}from"./appWrappers-BuwXBYCY.js";import"./preload-helper-PPVm8Dsz.js";import"./ListItemIcon-CHICEp0x.js";import"./ListContext-Baa1QRS6.js";import"./ListItemText-DmvyJhay.js";import"./lodash-DLuUt6m8.js";import"./useAsync-C2weF2sY.js";import"./useMountedState-C6W4VPdE.js";import"./useAnalytics-CEJvE44e.js";import"./Search-BiQ5wUh7.js";import"./useDebounce-NQUzqkwD.js";import"./translation-CAg_xGpF.js";import"./InputAdornment-C2tKQKQM.js";import"./useFormControl-CzoWM_jf.js";import"./Button-Cu6BkngO.js";import"./TextField-Bto6RwlD.js";import"./Select-DEVQzAOY.js";import"./index-B9sM2jn7.js";import"./Popover-BUbOGoXS.js";import"./Modal-D1YXIVhd.js";import"./Portal-B6ENv45o.js";import"./List-qMmGjvCV.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DHrmkS6P.js";import"./InputLabel-DTrjmWNd.js";import"./useApp-BUIf5wuk.js";import"./Chip-q8Ev9GF9.js";import"./Popper-aoUur9H0.js";import"./ListSubheader-b_Cj8uar.js";import"./useObservable-9WiB_7an.js";import"./useIsomorphicLayoutEffect-DMZDbwPJ.js";import"./componentData-BhUIek-Q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Bwu9Fyg1.js";const F=N(t=>({loading:{right:t.spacing(1),position:"absolute"}})),J=t=>c=>e.jsx(P,{inheritParentContextIfAvailable:!0,children:e.jsx(t,{...c})}),K=()=>{const t=F();return e.jsx(V,{className:t.loading,"data-testid":"search-autocomplete-progressbar",color:"inherit",size:20})},p=J(function(c){const{loading:x,value:u,onChange:S=()=>{},options:w=[],getOptionLabel:h=o=>String(o),inputPlaceholder:g,inputDebounceTime:A,freeSolo:b=!0,fullWidth:j=!0,clearOnBlur:C=!1,"data-testid":_="search-autocomplete",...L}=c,{setTerm:y}=E(),l=d.useCallback(o=>o?typeof o=="string"?o:h(o):"",[h]),I=d.useMemo(()=>l(u),[u,l]),R=d.useCallback((o,m,f,T)=>{y(l(m)),S(o,m,f,T)},[l,y,S]),v=d.useCallback(({InputProps:{ref:o,className:m,endAdornment:f},InputLabelProps:T,...D})=>e.jsx(H,{...D,ref:o,clearButton:!1,value:I,placeholder:g,debounceTime:A,endAdornment:x?e.jsx(K,{}):f,InputProps:{className:m}}),[x,I,g,A]);return e.jsx(M,{...L,"data-testid":_,value:u,onChange:R,options:w,getOptionLabel:h,renderInput:v,freeSolo:b,fullWidth:j,clearOnBlur:C})});p.__docgenInfo={description:`Recommended search autocomplete when you use the Search Provider or Search Context.

@public`,methods:[],displayName:"SearchAutocomplete",props:{"data-testid":{required:!1,tsType:{name:"string"},description:""},inputPlaceholder:{required:!1,tsType:{name:"Partial['placeholder']",raw:"SearchBarProps['placeholder']"},description:""},inputDebounceTime:{required:!1,tsType:{name:"Partial['debounceTime']",raw:"SearchBarProps['debounceTime']"},description:""}}};const We={title:"Plugins/Search/SearchAutocomplete",component:p,decorators:[t=>G(e.jsx(k,{apis:[[W,new q]],children:e.jsx(P,{children:e.jsx(O,{container:!0,direction:"row",children:e.jsx(O,{item:!0,xs:12,children:e.jsx(t,{})})})})}))],tags:["!manifest"]},r=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),s=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),n=()=>{const t=["hello-word","petstore","spotify"];return e.jsx(p,{options:t,value:t[0]})},a=()=>e.jsx(p,{options:[],loading:!0}),i=()=>{const t=[{title:"hello-world",text:"Hello World example for gRPC"},{title:"petstore",text:"The petstore API"},{title:"spotify",text:"The Spotify web API"}];return e.jsx(p,{options:t,renderOption:c=>e.jsx(z,{icon:e.jsx(B,{titleAccess:"Option icon"}),primaryText:c.title,secondaryText:c.text})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"Outlined"};n.__docgenInfo={description:"",methods:[],displayName:"Initialized"};a.__docgenInfo={description:"",methods:[],displayName:"LoadingOptions"};i.__docgenInfo={description:"",methods:[],displayName:"RenderingCustomOptions"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => {
  return <SearchAutocomplete options={["hello-word", "petstore", "spotify"]} />;
};
`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Outlined = () => {
  return <SearchAutocomplete options={["hello-word", "petstore", "spotify"]} />;
};
`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Initialized = () => {
  const options = ["hello-word", "petstore", "spotify"];
  return <SearchAutocomplete options={options} value={options[0]} />;
};
`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const LoadingOptions = () => {
  return <SearchAutocomplete options={[]} loading />;
};
`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const RenderingCustomOptions = () => {
  const options = [
    {
      title: "hello-world",
      text: "Hello World example for gRPC",
    },
    {
      title: "petstore",
      text: "The petstore API",
    },
    {
      title: "spotify",
      text: "The Spotify web API",
    },
  ];

  return (
    <SearchAutocomplete
      options={options}
      renderOption={(option) => (
        <SearchAutocompleteDefaultOption
          icon={<LabelIcon titleAccess="Option icon" />}
          primaryText={option.title}
          secondaryText={option.text}
        />
      )}
    />
  );
};
`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const options = ['hello-word', 'petstore', 'spotify'];
  return <SearchAutocomplete options={options} value={options[0]} />;
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={[]} loading />;
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const options = [{
    title: 'hello-world',
    text: 'Hello World example for gRPC'
  }, {
    title: 'petstore',
    text: 'The petstore API'
  }, {
    title: 'spotify',
    text: 'The Spotify web API'
  }];
  return <SearchAutocomplete options={options} renderOption={option => <SearchAutocompleteDefaultOption icon={<LabelIcon titleAccess="Option icon" />} primaryText={option.title} secondaryText={option.text} />} />;
}`,...i.parameters?.docs?.source}}};const qe=["Default","Outlined","Initialized","LoadingOptions","RenderingCustomOptions"];export{r as Default,n as Initialized,a as LoadingOptions,s as Outlined,i as RenderingCustomOptions,qe as __namedExportsOrder,We as default};
