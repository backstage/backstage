import{j as e,r as d,Z as N}from"./iframe-r9k78NKI.js";import{S as k,L as z}from"./Label-Drncav6U.js";import{s as B,M as W}from"./api-BMm8aMaZ.js";import{S as T,u as q}from"./SearchContext-DQabDLMt.js";import{m as E}from"./makeStyles-CipF_TRV.js";import{SearchBar as H}from"./SearchBar-CDftmO4h.js";import{A as M}from"./Autocomplete-DVv6fOmF.js";import{C as V}from"./CircularProgress-B-4bhhkM.js";import{S as P}from"./Grid-Bz9nGms7.js";import{w as G}from"./appWrappers-ChsNZaIk.js";import"./preload-helper-PPVm8Dsz.js";import"./ListItemIcon-BvYCR13w.js";import"./ListContext-BzmVZQwf.js";import"./ListItemText-B4TkGekz.js";import"./lodash-B26Sq6Yw.js";import"./useAsync-2R6wGkWw.js";import"./useMountedState-CrP_-pBR.js";import"./useAnalytics-wKKBdz0U.js";import"./Search-CXT53W12.js";import"./useDebounce-9VH1U3TO.js";import"./translation-DHi4nQAo.js";import"./InputAdornment-Dh51apjw.js";import"./useFormControl-Bog8vARk.js";import"./Button-CciA6M2u.js";import"./TextField-_Zq2sVTj.js";import"./Select-NqQrwrps.js";import"./index-B9sM2jn7.js";import"./Popover-CvDqd1rk.js";import"./Modal-UJSdMD3k.js";import"./Portal-CW8an0o0.js";import"./List-BDEgjW0i.js";import"./formControlState-ByiNFc8I.js";import"./FormLabel-h4jv2e1h.js";import"./InputLabel-D8bN8Wve.js";import"./useApp-Nm0FtJwT.js";import"./Chip-BjbimY6y.js";import"./Popper-oo_sRFxI.js";import"./ListSubheader-6LyLVkIO.js";import"./useObservable-yHFnGuS0.js";import"./useIsomorphicLayoutEffect-yB6xoTQw.js";import"./componentData-Cyx6du4q.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-C1fYClSH.js";const Z=E(t=>({loading:{right:t.spacing(1),position:"absolute"}})),F=t=>c=>e.jsx(T,{inheritParentContextIfAvailable:!0,children:e.jsx(t,{...c})}),J=()=>{const t=Z();return e.jsx(V,{className:t.loading,"data-testid":"search-autocomplete-progressbar",color:"inherit",size:20})},p=F(function(c){const{loading:x,value:u,onChange:S=()=>{},options:w=[],getOptionLabel:h=o=>String(o),inputPlaceholder:g,inputDebounceTime:A,freeSolo:b=!0,fullWidth:j=!0,clearOnBlur:C=!1,"data-testid":_="search-autocomplete",...L}=c,{setTerm:y}=q(),l=d.useCallback(o=>o?typeof o=="string"?o:h(o):"",[h]),I=d.useMemo(()=>l(u),[u,l]),R=d.useCallback((o,m,f,O)=>{y(l(m)),S(o,m,f,O)},[l,y,S]),v=d.useCallback(({InputProps:{ref:o,className:m,endAdornment:f},InputLabelProps:O,...D})=>e.jsx(H,{...D,ref:o,clearButton:!1,value:I,placeholder:g,debounceTime:A,endAdornment:x?e.jsx(J,{}):f,InputProps:{className:m}}),[x,I,g,A]);return e.jsx(M,{...L,"data-testid":_,value:u,onChange:R,options:w,getOptionLabel:h,renderInput:v,freeSolo:b,fullWidth:j,clearOnBlur:C})});p.__docgenInfo={description:`Recommended search autocomplete when you use the Search Provider or Search Context.

@public`,methods:[],displayName:"SearchAutocomplete",props:{"data-testid":{required:!1,tsType:{name:"string"},description:""},inputPlaceholder:{required:!1,tsType:{name:"Partial['placeholder']",raw:"SearchBarProps['placeholder']"},description:""},inputDebounceTime:{required:!1,tsType:{name:"Partial['debounceTime']",raw:"SearchBarProps['debounceTime']"},description:""}}};const qe={title:"Plugins/Search/SearchAutocomplete",component:p,decorators:[t=>G(e.jsx(N,{apis:[[B,new W]],children:e.jsx(T,{children:e.jsx(P,{container:!0,direction:"row",children:e.jsx(P,{item:!0,xs:12,children:e.jsx(t,{})})})})}))],tags:["!manifest"]},r=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),s=()=>e.jsx(p,{options:["hello-word","petstore","spotify"]}),n=()=>{const t=["hello-word","petstore","spotify"];return e.jsx(p,{options:t,value:t[0]})},i=()=>e.jsx(p,{options:[],loading:!0}),a=()=>{const t=[{title:"hello-world",text:"Hello World example for gRPC"},{title:"petstore",text:"The petstore API"},{title:"spotify",text:"The Spotify web API"}];return e.jsx(p,{options:t,renderOption:c=>e.jsx(k,{icon:e.jsx(z,{titleAccess:"Option icon"}),primaryText:c.title,secondaryText:c.text})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"Outlined"};n.__docgenInfo={description:"",methods:[],displayName:"Initialized"};i.__docgenInfo={description:"",methods:[],displayName:"LoadingOptions"};a.__docgenInfo={description:"",methods:[],displayName:"RenderingCustomOptions"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => {
  return <SearchAutocomplete options={["hello-word", "petstore", "spotify"]} />;
};
`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const Outlined = () => {
  return <SearchAutocomplete options={["hello-word", "petstore", "spotify"]} />;
};
`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Initialized = () => {
  const options = ["hello-word", "petstore", "spotify"];
  return <SearchAutocomplete options={options} value={options[0]} />;
};
`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{code:`const LoadingOptions = () => {
  return <SearchAutocomplete options={[]} loading />;
};
`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const RenderingCustomOptions = () => {
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
`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const options = ['hello-word', 'petstore', 'spotify'];
  return <SearchAutocomplete options={options} value={options[0]} />;
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <SearchAutocomplete options={[]} loading />;
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};const Ee=["Default","Outlined","Initialized","LoadingOptions","RenderingCustomOptions"];export{r as Default,n as Initialized,i as LoadingOptions,s as Outlined,a as RenderingCustomOptions,Ee as __namedExportsOrder,qe as default};
