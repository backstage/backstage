import{j as e,m as N,r as d,U as k}from"./iframe-BVVWNhNF.js";import{S as z,L as B}from"./Label-DGmFedEZ.js";import{s as W,M as q}from"./api-BgdT1u7W.js";import{S as T,u as E}from"./SearchContext-Dr2dYMQS.js";import{SearchBar as H}from"./SearchBar-CDDFPFPf.js";import{A as M}from"./Autocomplete-1PMsvgrT.js";import{C as V}from"./CircularProgress-BKVsX0Cu.js";import{S as P}from"./Grid-BhWDjvJh.js";import{w as G}from"./appWrappers-ChYKtzjD.js";import"./preload-helper-PPVm8Dsz.js";import"./ListItemIcon-BiGNPOOS.js";import"./ListContext-D6HHPv4d.js";import"./ListItemText-rQpXHQMd.js";import"./lodash-Czox7iJy.js";import"./useAsync-C3TxRl9Y.js";import"./useMountedState-Lmv_QRT4.js";import"./useAnalytics-DOlQNDHl.js";import"./Search-DDHYanuF.js";import"./useDebounce-0cCcFGDN.js";import"./translation-BM2QIJ0G.js";import"./InputAdornment-Bpv_O3l5.js";import"./useFormControl-C0REJyRQ.js";import"./Button-BmiFnTzM.js";import"./TextField-CzukziRB.js";import"./Select-DfAPcZ2_.js";import"./index-B9sM2jn7.js";import"./Popover-pnksybnm.js";import"./Modal-BSykfrg4.js";import"./Portal-DukR7Qds.js";import"./List-CeUn_h_G.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-DGm40x93.js";import"./InputLabel-iFQrC6eB.js";import"./useApp-CDZ4N_T1.js";import"./Chip-i5Eu3pXX.js";import"./Popper-CpEGPy4_.js";import"./ListSubheader-BQalu6zH.js";import"./useObservable-UOYoI0kL.js";import"./useIsomorphicLayoutEffect-C2UzxJwg.js";import"./componentData-CcSGmjOp.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-Cytn1js_.js";const U=N(t=>({loading:{right:t.spacing(1),position:"absolute"}})),F=t=>c=>e.jsx(T,{inheritParentContextIfAvailable:!0,children:e.jsx(t,{...c})}),J=()=>{const t=U();return e.jsx(V,{className:t.loading,"data-testid":"search-autocomplete-progressbar",color:"inherit",size:20})},p=F(function(c){const{loading:x,value:u,onChange:S=()=>{},options:w=[],getOptionLabel:h=o=>String(o),inputPlaceholder:g,inputDebounceTime:A,freeSolo:b=!0,fullWidth:j=!0,clearOnBlur:C=!1,"data-testid":_="search-autocomplete",...L}=c,{setTerm:y}=E(),l=d.useCallback(o=>o?typeof o=="string"?o:h(o):"",[h]),I=d.useMemo(()=>l(u),[u,l]),R=d.useCallback((o,m,f,O)=>{y(l(m)),S(o,m,f,O)},[l,y,S]),v=d.useCallback(({InputProps:{ref:o,className:m,endAdornment:f},InputLabelProps:O,...D})=>e.jsx(H,{...D,ref:o,clearButton:!1,value:I,placeholder:g,debounceTime:A,endAdornment:x?e.jsx(J,{}):f,InputProps:{className:m}}),[x,I,g,A]);return e.jsx(M,{...L,"data-testid":_,value:u,onChange:R,options:w,getOptionLabel:h,renderInput:v,freeSolo:b,fullWidth:j,clearOnBlur:C})});p.__docgenInfo={description:`Recommended search autocomplete when you use the Search Provider or Search Context.

@public`,methods:[],displayName:"SearchAutocomplete",props:{"data-testid":{required:!1,tsType:{name:"string"},description:""},inputPlaceholder:{required:!1,tsType:{name:"Partial['placeholder']",raw:"SearchBarProps['placeholder']"},description:""},inputDebounceTime:{required:!1,tsType:{name:"Partial['debounceTime']",raw:"SearchBarProps['debounceTime']"},description:""}}};const We={title:"Plugins/Search/SearchAutocomplete",component:p,decorators:[t=>G(e.jsx(k,{apis:[[W,new q]],children:e.jsx(T,{children:e.jsx(P,{container:!0,direction:"row",children:e.jsx(P,{item:!0,xs:12,children:e.jsx(t,{})})})})}))],tags:["!manifest"]},r=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),s=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),n=()=>{const t=["hello-word","petstore","spotify"];return e.jsx(p,{options:t,value:t[0]})},a=()=>e.jsx(p,{options:[],loading:!0}),i=()=>{const t=[{title:"hello-world",text:"Hello World example for gRPC"},{title:"petstore",text:"The petstore API"},{title:"spotify",text:"The Spotify web API"}];return e.jsx(p,{options:t,renderOption:c=>e.jsx(z,{icon:e.jsx(B,{titleAccess:"Option icon"}),primaryText:c.title,secondaryText:c.text})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"Outlined"};n.__docgenInfo={description:"",methods:[],displayName:"Initialized"};a.__docgenInfo={description:"",methods:[],displayName:"LoadingOptions"};i.__docgenInfo={description:"",methods:[],displayName:"RenderingCustomOptions"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => {
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
